import os
import time
import logging
import requests
from typing import List

logger = logging.getLogger(__name__)

HF_API_KEY = os.getenv("HF_API_KEY", "")
HF_MODEL_URL = (
    "https://api-inference.huggingface.co/pipeline/feature-extraction/"
    "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
)


class EmbeddingService:
    """Embedding service using HuggingFace Inference API (no local torch needed)."""

    def __init__(self):
        self.api_url = HF_MODEL_URL
        self.headers = {"Authorization": f"Bearer {HF_API_KEY}"}
        self.embedding_dim = 384
        logger.info("✅ EmbeddingService (multimodal) ready (HuggingFace API mode)")

    def _call_api(self, texts: List[str], retries: int = 3) -> List[List[float]]:
        payload = {"inputs": texts, "options": {"wait_for_model": True}}
        for attempt in range(1, retries + 1):
            try:
                resp = requests.post(self.api_url, headers=self.headers, json=payload, timeout=30)
                resp.raise_for_status()
                result = resp.json()
                if isinstance(result, list) and isinstance(result[0], list):
                    return result
                raise ValueError(f"Unexpected HF API response format: {type(result)}")
            except Exception as exc:
                logger.warning("HF embedding attempt %d/%d failed: %s", attempt, retries, exc)
                if attempt < retries:
                    time.sleep(2 ** attempt)
        raise RuntimeError("HuggingFace embedding API failed after retries")

    def embed_text(self, text: str) -> List[float]:
        return self._call_api([text])[0]

    def embed_batch(self, texts: List[str]) -> List[List[float]]:
        return self._call_api(texts)


embedding_service = EmbeddingService()
