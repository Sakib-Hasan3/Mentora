import aiohttp
import asyncio
from typing import Optional

class TextAgent:
    def __init__(self, ollama_url: str = "http://localhost:11434"):
        self.ollama_url = ollama_url
        self.model = "tinyllama:latest"
    
    async def process(self, text: str, context: Optional[str] = None) -> str:
        prompt = f"""তুমি "মেন্টাল সাথী" - একটি বন্ধুত্বপূর্ণ মানসিক স্বাস্থ্য সহায়ক চ্যাটবট।
ব্যবহারকারী বলেছেন: "{text}"
{'প্রসঙ্গ: ' + context if context else ''}
বাংলায় সংক্ষিপ্ত, সহানুভূতিশীল উত্তর দিন:"""
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{self.ollama_url}/api/generate",
                    json={
                        "model": self.model,
                        "prompt": prompt,
                        "stream": False,
                        "options": {"temperature": 0.7, "num_predict": 150}
                    },
                    timeout=aiohttp.ClientTimeout(total=30)
                ) as response:
                    if response.status == 200:
                        data = await response.json()
                        return data.get("response", "আমি আপনার কথা শুনছি। 💚")
        except Exception as e:
            print(f"TextAgent error: {e}")
        
        return self._fallback_response(text)
    
    def _fallback_response(self, text: str) -> str:
        text_lower = text.lower()
        if 'উদ্বেগ' in text_lower or 'চিন্তা' in text_lower:
            return "গভীর শ্বাস নিন। ৫ মিনিট মেডিটেশন করুন। 🧘"
        elif 'ঘুম' in text_lower:
            return "নিয়মিত সময়ে ঘুমান। ঘুমের আগে মোবাইল বন্ধ রাখুন। 😴"
        elif 'একা' in text_lower:
            return "আপনি একা নন। বন্ধুর সাথে কথা বলুন। হেল্পলাইন: ১৬২৬৩ 💚"
        else:
            return "আমি আপনার কথা শুনছি। আরও বলুন, আমি সাহায্য করতে চাই। 💚"

text_agent = TextAgent()