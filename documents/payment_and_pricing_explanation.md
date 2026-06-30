# Mentora Payment Gateway এবং Subscription গাইড

ইউজারদের ফ্রিমিয়াম প্ল্যান থেকে প্রিমিয়াম ফিচারে (যেমন: RAG চ্যাটবট) আপগ্রেড করতে SSLCommerz পেমেন্ট গেটওয়ে ব্যবহার করা হয়েছে। লোকাল ডেভেলপমেন্ট সহজ করতে এতে একটি **Mock Mode** রয়েছে।

---

## ব্যাকএন্ড ফাইলসমূহ (Backend Files)

### 📂 backend/payment/[routes.py](file:///home/sakib/Documents/GitHub/Mentora---An-AI-Based-Mental-Health-Self-Awareness/backend/payment/routes.py)
* **কাজ:** পেমেন্ট ইনিশিয়ালাইজেশন এবং গেটওয়ে হ্যান্ডশেকিং।
* **কীভাবে কাজ করে:** 
  - `POST /api/payment/initiate`: ইউজার কোন প্ল্যান (মাসিক BDT ২৯৯ নাকি বার্ষিক BDT ২৪৯৯) সিলেক্ট করেছে তা রিসিভ করে একটি ইউনিক ট্রানজেকশন আইডি (`tran_id`) তৈরি করে।
  - **Mock Payment Mode (লোকাল টেস্টের জন্য):** যদি `.env` ফাইলে `PAYMENT_MOCK_MODE=True` সেট থাকে, তবে এটি SSLCommerz সার্ভিস কল না করে সরাসরি ইউজারের ডাটাবেজ স্ট্যাটাস `paid` এবং `premium` করে দেয় এবং ফ্রন্টএন্ডের সাকসেস পেজে পাঠিয়ে দেয়।
  - **SSLCommerz API Call:** মক মোড অফ থাকলে এটি SSLCommerz-এর স্যান্ডবক্স বা প্রোডাকশন লিংকে রিকোয়েস্ট পাঠায় এবং গেটওয়ে পেমেন্ট পেজের ইউআরএল নিয়ে ফ্রন্টএন্ডে পাঠায়।
  - `/payment/success`, `/payment/fail`, `/payment/cancel`: পেমেন্টের ফলাফল অনুযায়ী ট্রানজেকশন আপডেট এবং ইউজার সাবস্ক্রিপশন মডিফাই করে।

---

## ফ্রন্টএন্ড ফাইলসমূহ (Frontend Files)

### 📂 frontend/src/pages/[PricingPage.jsx](file:///home/sakib/Documents/GitHub/Mentora---An-AI-Based-Mental-Health-Self-Awareness/frontend/src/pages/PricingPage.jsx)
* **কাজ:** সাবস্ক্রিপশন প্রাইসিং প্ল্যান দেখার পেজ।
* **কীভাবে কাজ করে:** প্রিমিয়াম ফিচারের সুবিধাসমূহ (যেমন: এআই চ্যাটবট, আনলিমিটেড রিপোর্ট) সুন্দর কার্ড ফরম্যাটে প্রদর্শন করে। ইউজার প্ল্যানে ক্লিক করলে ব্যাকএন্ডের ইনিশিয়েট পেমেন্ট এন্ডপয়েন্টে হিট করে।

### 📂 frontend/src/pages/[PaymentSuccess.jsx](file:///home/sakib/Documents/GitHub/Mentora---An-AI-Based-Mental-Health-Self-Awareness/frontend/src/pages/PaymentSuccess.jsx), [PaymentFail.jsx](file:///home/sakib/Documents/GitHub/Mentora---An-AI-Based-Mental-Health-Self-Awareness/frontend/src/pages/PaymentFail.jsx) ও [PaymentCancel.jsx](file:///home/sakib/Documents/GitHub/Mentora---An-AI-Based-Mental-Health-Self-Awareness/frontend/src/pages/PaymentCancel.jsx)
* **কাজ:** পেমেন্টের ফলাফল অনুযায়ী ইউজারকে কনফার্মেশন মেসেজ দেখানো।
* **কীভাবে কাজ করে:** পেমেন্ট সফল হলে অভিনন্দন মেসেজ দেখায় এবং ড্যাশবোর্ড বা প্রোফাইলে রিডাইরেক্ট করে।
