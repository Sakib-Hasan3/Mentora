import os
import time
import logging
import requests
import chromadb
from chromadb import Documents, EmbeddingFunction, Embeddings
from typing import List, Dict
import uuid
from pathlib import Path

logger = logging.getLogger(__name__)

HF_API_KEY = os.getenv("HF_API_KEY", "")
HF_MODEL_URL = (
    "https://api-inference.huggingface.co/pipeline/feature-extraction/"
    "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
)


class HuggingFaceAPIEmbeddingFunction(EmbeddingFunction):
    def __init__(self, retries: int = 3):
        self.api_url = HF_MODEL_URL
        self.headers = {"Authorization": f"Bearer {HF_API_KEY}"}
        self.retries = retries

    def name(self) -> str:
        return "sentence_transformer"

    def __call__(self, input: Documents) -> Embeddings:
        payload = {"inputs": list(input), "options": {"wait_for_model": True}}
        for attempt in range(1, self.retries + 1):
            try:
                resp = requests.post(self.api_url, headers=self.headers, json=payload, timeout=30)
                resp.raise_for_status()
                result = resp.json()
                if isinstance(result, list) and len(result) > 0 and isinstance(result[0], list):
                    return result
                raise ValueError(f"Unexpected response: {type(result)}")
            except Exception as exc:
                logger.warning("HF embedding attempt %d/%d: %s", attempt, self.retries, exc)
                if attempt < self.retries:
                    time.sleep(2 ** attempt)
        raise RuntimeError("HuggingFace embedding API failed")


class VectorStoreService:
    def __init__(self):
        embedding_fn = HuggingFaceAPIEmbeddingFunction()

        is_production = os.getenv("ENV", "development").lower() == "production"
        if is_production:
            self.client = chromadb.EphemeralClient()
            logger.info("🌐 Multimodal ChromaDB: EphemeralClient (production)")
        else:
            self.client = chromadb.PersistentClient(path="./chroma_db")
            logger.info("💾 Multimodal ChromaDB: PersistentClient")

        self.collection = self.client.get_or_create_collection(
            name="mental_health_knowledge",
            embedding_function=embedding_fn
        )

    def add_documents(self, documents: List[str], metadatas: List[Dict] = None):
        ids = [str(uuid.uuid4()) for _ in documents]
        self.collection.add(documents=documents, ids=ids, metadatas=metadatas)
        return ids

    def search(self, query: str, k: int = 5) -> List[Dict]:
        results = self.collection.query(query_texts=[query], n_results=k)
        return [
            {"text": doc, "metadata": meta}
            for doc, meta in zip(results['documents'][0], results['metadatas'][0])
        ] if results['documents'] else []


vector_store = VectorStoreService()