# Mentora Mental Health Assessment গাইড

ইউজারদের মানসিক স্বাস্থ্যের অবস্থা ও ঝুঁকির মাত্রা নির্ণয় করতে দুই ধরনের পরীক্ষা ব্যবস্থা রয়েছে:
১. **সাধারণ অ্যাসেসমেন্ট (Standard Assessment):** ১০টি নির্দিষ্ট বহু নির্বাচনী প্রশ্নের কুইজ টেস্ট।
২. **এমএল অ্যাসেসমেন্ট (ML Quick Assessment):** পারিবারিক ইতিহাস, লিঙ্গ, চাকরি ও চিকিৎসা সংক্রান্ত তথ্যের ওপর ভিত্তি করে মেশিন লার্নিং (ML) ঝুঁকি বিশ্লেষণ।

---

## ব্যাকএন্ড ফাইলসমূহ (Backend Files)

### 📂 backend/assessment/routes/[assessment.py](file:///home/sakib/Documents/GitHub/Mentora---An-AI-Based-Mental-Health-Self-Awareness/backend/assessment/routes/assessment.py)
* **কাজ:** ১০টি প্রশ্নের সাধারণ কুইজ ও স্কোরিং প্রসেস করা।
* **কীভাবে কাজ করে:** 
  - `GET /api/assessment/questions`: প্রশ্ন ও তাদের বিকল্পগুলোর তালিকা প্রদান করে।
  - `POST /api/assessment/submit`: ইউজারদের উত্তর নিয়ে একটি স্কোর হিসাব করে (সর্বোচ্চ ১০০)। স্কোরের ভিত্তিতে লেভেল (স্বাভাবিক, হালকা, মাঝারি, গুরুতর) এবং স্বয়ংক্রিয় পরামর্শ (Advice) নির্ধারণ করে MongoDB-র `assessments` কালেকশনে সেভ করে।

### 📂 backend/ml_assessment/routes/[ml_predict.py](file:///home/sakib/Documents/GitHub/Mentora---An-AI-Based-Mental-Health-Self-Awareness/backend/ml_assessment/routes/ml_predict.py)
* **কাজ:** HuggingFace ও ডাইনামিক রুলস ব্যবহার করে মানসিক ঝুঁকি প্রডিক্ট করা।
* **কীভাবে কাজ করে:** 
  - এটি ইউজারের ফ্যামিলি হিস্ট্রি (60% গুরুত্ব), কেয়ার অপশনস (29%), সেলফ-এমপ্লয়েড (5.5%) এবং লিঙ্গ (5.2%) ডাটা নেয়।
  - এর ওপর ভিত্তি করে একটি রিস্ক স্কোর বের করে।
  - ঝুঁকি ৫০% এর বেশি হলে HuggingFace-এর `facebook/bart-large-mnli` মডেল ব্যবহার করে ওটি একটি সহানুভূতিশীল পরামর্শ তৈরি করে ফেরত পাঠায়। এপিআই কাজ না করলে লোকাল ফ্যালব্যাক পরামর্শ দেয়।

---

## ফ্রন্টএন্ড ফাইলসমূহ (Frontend Files)

### 📂 frontend/src/pages/[Assessment.jsx](file:///home/sakib/Documents/GitHub/Mentora---An-AI-Based-Mental-Health-Self-Awareness/frontend/src/pages/Assessment.jsx) ও [AssessmentPage.jsx](file:///home/sakib/Documents/GitHub/Mentora---An-AI-Based-Mental-Health-Self-Awareness/frontend/src/pages/AssessmentPage.jsx)
* **কাজ:** ১০টি প্রশ্নের কুইজ দেওয়ার ইন্টারফেস।
* **কীভাবে কাজ করে:** ইউজারকে এক এক করে প্রশ্ন দেখায় এবং রেসপন্স রিসিভ করে ব্যাকএন্ডের `/assessment/submit` এন্ডপয়েন্টে পাঠায়। সবশেষে ফলাফল ও পরামর্শ অ্যানিমেটেড কার্ডে প্রদর্শন করে।

### 📂 frontend/src/pages/[QuickAssessment.jsx](file:///home/sakib/Documents/GitHub/Mentora---An-AI-Based-Mental-Health-Self-Awareness/frontend/src/pages/QuickAssessment.jsx)
* **কাজ:** মেশিন লার্নিং কুইক টেস্টের ফর্ম ও ফলাফল দেখার স্ক্রিন।
* **কীভাবে কাজ করে:** ৩-৪টি কুইক ড্রপডাউন ইনপুট নেয় এবং সাবমিট করার পর ব্যাকএন্ডের `/ml-assessment/predict` এপিআই থেকে প্রাপ্ত অ্যানালাইসিস রিপোর্ট (ঝুঁকির শতকরা হার, বিশেষজ্ঞের পরামর্শ) দেখায়।
