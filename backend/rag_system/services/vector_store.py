import os
import time
import logging
import requests
import chromadb
from chromadb import Documents, EmbeddingFunction, Embeddings
from typing import List, Dict, Any
import uuid
from pathlib import Path

logger = logging.getLogger(__name__)

HF_API_KEY = os.getenv("HF_API_KEY", "")
HF_MODEL_URL = (
    "https://api-inference.huggingface.co/pipeline/feature-extraction/"
    "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
)


class HuggingFaceAPIEmbeddingFunction(EmbeddingFunction):
    """ChromaDB embedding function using HuggingFace Inference API."""

    def __init__(self, retries: int = 3):
        self.api_url = HF_MODEL_URL
        self.headers = {"Authorization": f"Bearer {HF_API_KEY}"}
        self.retries = retries

    def __call__(self, input: Documents) -> Embeddings:
        payload = {"inputs": list(input), "options": {"wait_for_model": True}}
        for attempt in range(1, self.retries + 1):
            try:
                resp = requests.post(self.api_url, headers=self.headers, json=payload, timeout=30)
                resp.raise_for_status()
                result = resp.json()
                if isinstance(result, list) and len(result) > 0 and isinstance(result[0], list):
                    return result
                raise ValueError(f"Unexpected HF API response: {type(result)}")
            except Exception as exc:
                logger.warning("HF vector store embedding attempt %d/%d: %s", attempt, self.retries, exc)
                if attempt < self.retries:
                    time.sleep(2 ** attempt)
        raise RuntimeError("HuggingFace embedding API failed for vector store")


class VectorStoreService:
    def __init__(self, collection_name: str = "mental_health_knowledge"):
        persist_dir = Path(__file__).parent.parent.parent / "chroma_db"
        persist_dir.mkdir(exist_ok=True)

        self.client = chromadb.PersistentClient(path=str(persist_dir))
        self.embedding_fn = HuggingFaceAPIEmbeddingFunction()

        self.collection = self.client.get_or_create_collection(
            name=collection_name,
            embedding_function=self.embedding_fn
        )

        logger.info("✅ Vector store initialized: %s (docs: %d)", collection_name, self.collection.count())

    
    def add_documents(self, documents: List[str], metadatas: List[Dict] = None):
        ids = [str(uuid.uuid4()) for _ in documents]
        if metadatas is None:
            metadatas = [{"source": "knowledge_base"} for _ in documents]
        
        self.collection.add(
            documents=documents,
            ids=ids,
            metadatas=metadatas
        )
        return ids
    
    def search(self, query: str, k: int = 5) -> List[Dict]:
        results = self.collection.query(query_texts=[query], n_results=k)
        
        if results and results['documents']:
            docs = []
            for i, doc in enumerate(results['documents'][0]):
                docs.append({
                    "text": doc,
                    "metadata": results['metadatas'][0][i] if results['metadatas'] else {},
                    "distance": results['distances'][0][i] if results['distances'] else None
                })
            return docs
        return []
    
    def get_all_documents(self) -> List[str]:
        all_data = self.collection.get()
        return all_data['documents'] if all_data else []

vector_store = VectorStoreService()
