from sentence_transformers import SentenceTransformer
import numpy as np
from typing import List

class EmbeddingService:
    def __init__(self):
        # Multilingual model for Bangla + English
        self.model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')
    
    def embed_text(self, text: str) -> List[float]:
        return self.model.encode(text).tolist()
    
    def embed_batch(self, texts: List[str]) -> List[List[float]]:
        return self.model.encode(texts).tolist()

embedding_service = EmbeddingService()