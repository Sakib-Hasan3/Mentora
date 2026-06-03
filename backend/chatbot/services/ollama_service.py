import aiohttp
import re
import asyncio
from typing import Optional, List, Dict

class OllamaService:
    def __init__(self, base_url: str = "http://localhost:11434"):
        self.base_url = base_url
        self.model = "tinyllama:latest"
    
    async def generate_response(self, message: str, conversation_history: Optional[List[Dict]] = None) -> str:
        # ভাষা ডিটেক্ট করুন
        language = self.detect_language(message)
        
        # Banglish ইনপুটে বাংলা প্রম্পট ব্যবহার করুন
        if language == "banglish":
            prompt = f"""তুমি "মেন্টাল সাথী" - একটি বন্ধুত্বপূর্ণ মানসিক স্বাস্থ্য সহায়ক চ্যাটবট।
ব্যবহারকারী বাংলাতে (ইংরেজি অক্ষরে) লিখেছে: "{message}"
তোমাকে অবশ্যই বাংলা ভাষায় উত্তর দিতে হবে (বাংলা অক্ষরে)।
উত্তর হবে সংক্ষিপ্ত (১-২ বাক্য), সহানুভূতিশীল এবং সাহায্যকারী।
বাংলা উত্তর দিন:"""
        
        elif language == "bengali":
            prompt = f"""তুমি "মেন্টাল সাথী" - একটি বন্ধুত্বপূর্ণ মানসিক স্বাস্থ্য সহায়ক চ্যাটবট।
ব্যবহারকারী বাংলায় বলেছেন: "{message}"
বাংলায় সংক্ষিপ্ত (১-২ বাক্য), সহানুভূতিশীল উত্তর দিন:"""
        
        else:
            prompt = f"""You are "Mental Sathi" - a friendly mental health support chatbot.
User said: "{message}"
Give a brief, empathetic response in English:"""
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{self.base_url}/api/generate",
                    json={
                        "model": self.model,
                        "prompt": prompt,
                        "stream": False,
                        "options": {
                            "temperature": 0.8,
                            "num_predict": 120,
                            "top_p": 0.9
                        }
                    },
                    timeout=aiohttp.ClientTimeout(total=20)
                ) as response:
                    if response.status == 200:
                        data = await response.json()
                        result = data.get("response", "")
                        if result and len(result) > 3:
                            return result.strip()
                        else:
                            return self.get_fallback_response(message, "banglish")
                    else:
                        return self.get_fallback_response(message, "banglish")
        except asyncio.TimeoutError:
            return self.get_fallback_response(message, "banglish")
        except Exception as e:
            print(f"Ollama error: {e}")
            return self.get_fallback_response(message, "banglish")
    
    def detect_language(self, text: str) -> str:
        """বাংলা ইউনিকোড, Banglish বা ইংরেজি ডিটেক্ট করে"""
        bengali_range = re.compile(r'[\u0980-\u09FF]')
        
        # চেক করুন বাংলা ইউনিকোড আছে কিনা
        if bengali_range.search(text):
            return "bengali"
        
        # Banglish ডিটেক্ট করার জন্য বাংলা শব্দের তালিকা (ইংরেজি অক্ষরে)
        banglish_keywords = [
            'ami', 'tumi', 'se', 'amra', 'tomra', 'tara', 'kemon', 'kemon acho', 'ache',
            'ki', 'kotha', 'kothay', 'kivabe', 'keno', 'kobe', 'eikhane', 'oikhane',
            'bhalo', 'kharap', 'mon', 'bhalo lagche', 'kharap lagche', 'lagche',
            'dhur', 'allah', 'inshallah', 'alhamdulillah', 'mashallah', 'subhanallah',
            'ki korbo', 'ki kora jay', 'upay', 'upay ki', 'sahajjo', 'dorkar',
            'valo', 'valo lagche', 'valo nei', 'stress', 'tension', 'chinta', 'udveg',
            'ghum', 'nidra', 'ekla', 'ekaki', 'bose', 'thaka', 'jao', 'eso', 'dekhi'
        ]
        
        # Banglish শব্দ চেক করুন (ইংরেজি অক্ষরে লেখা বাংলা)
        words = text.lower().split()
        for word in words:
            # Banglish কীবোর্ড প্যাটার্ন চেক
            if word in banglish_keywords:
                return "banglish"
            # বাংলা শব্দের ইংরেজি ট্রান্সলিটারেশন চেক (যেমন: "kemon" "acho" "lagche")
            if re.match(r'^[a-z]+$', word) and len(word) > 2:
                for kw in banglish_keywords:
                    if kw in word or word in kw:
                        return "banglish"
        
        return "english"
    
    def get_fallback_response(self, message: str, language: str) -> str:
        """Ollama না থাকলে বাংলায় ফallback উত্তর"""
        msg = message.lower()
        
        # Banglish বা বাংলা ইনপুটে বাংলা উত্তর দিন
        keywords_responses = {
            # Banglish keywords
            'udweg': 'গভীর শ্বাস নিন। ৫ মিনিট মেডিটেশন করুন। 🧘',
            'chinta': 'চিন্তাগুলো লিখে রাখুন। এতে মন শান্ত হয়। 📝',
            'tension': 'টেনশন কমানোর জন্য একটু হাঁটাহাঁটি করুন। 🚶',
            'ghum': 'নিয়মিত সময়ে ঘুমান। ঘুমের আগে মোবাইল বন্ধ রাখুন। 😴',
            'nidra': 'ঘুমানোর আগে হালকা গান শুনতে পারেন। 🎵',
            'ekla': 'আপনি একা নন। বন্ধুর সাথে কথা বলুন। 💚',
            'stress': 'স্ট্রেস কমানোর জন্য গভীর শ্বাস নিন। 🧘',
            'bhalo nei': 'আমি বুঝি। আপনি কি বিষয়ে খারাপ অনুভব করছেন?',
            'kharap lagche': 'আমি আপনার কথা শুনছি। আরও বলুন, আমি সাহায্য করতে চাই। 💚',
            'mon kharap': 'মন খারাপ থাকলে কারো সাথে কথা বলা ভালো। 🤝',
            'ki korbo': 'প্রথমে গভীর শ্বাস নিন। তারপর একবার ভাবুন। 💭',
            'sahajjo dorkar': 'আমি এখানে আছি। আপনি কীভাবে সাহায্য চান? 🤗',
            'valo lagche na': 'আপনার অনুভূতি বুঝতে পারি। আপনি শক্তিশালী। 💪',
            
            # Bengali keywords
            'উদ্বেগ': 'গভীর শ্বাস নিন। ৫ মিনিট মেডিটেশন করুন। 🧘',
            'চিন্তা': 'চিন্তাগুলো লিখে রাখুন। এতে মন শান্ত হয়। 📝',
            'টেনশন': 'টেনশন কমানোর জন্য একটু হাঁটাহাঁটি করুন। 🚶',
            'ঘুম': 'নিয়মিত সময়ে ঘুমান। ঘুমের আগে মোবাইল বন্ধ রাখুন। 😴',
            'একা': 'আপনি একা নন। বন্ধুর সাথে কথা বলুন। 💚',
            'স্ট্রেস': 'স্ট্রেস কমানোর জন্য গভীর শ্বাস নিন। 🧘',
            'খারাপ লাগছে': 'আমি আপনার কথা শুনছি। আরও বলুন, আমি সাহায্য করতে চাই। 💚',
            'মন খারাপ': 'মন খারাপ থাকলে কারো সাথে কথা বলা ভালো। 🤝'
        }
        
        for key, response in keywords_responses.items():
            if key in msg:
                return response
        
        # ডিফল্ট বাংলা উত্তর
        return "আমি আপনার কথা শুনছি। আপনি কীভাবে অনুভব করছেন? আমি এখানে সাহায্য করতে আছি। 💚"
    
    async def check_health(self) -> bool:
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(f"{self.base_url}/api/tags", timeout=aiohttp.ClientTimeout(total=5)) as response:
                    return response.status == 200
        except:
            return False

ollama_service = OllamaService()
