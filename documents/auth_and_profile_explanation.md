# Mentora Authentication এবং Profile Management গাইড

এই মডিউলে ইউজার রেজিস্ট্রেশন, লগইন (পাসওয়ার্ড ও গুগল সাইন-ইন), ওটিপি ভেরিফিকেশন এবং ইউজার প্রোফাইল ম্যানেজমেন্টের কাজ করা হয়।

---

## ব্যাকএন্ড ফাইলসমূহ (Backend Files)

### 📂 backend/auth/routes/[auth.py](file:///home/sakib/Documents/GitHub/Mentora---An-AI-Based-Mental-Health-Self-Awareness/backend/auth/routes/auth.py)
* **কাজ:** ইমেইল-পাসওয়ার্ড দিয়ে সাইনআপ/লগইন এবং গুগল ওয়ান-ট্যাপ লগইন হ্যান্ডেল করা।
* **কীভাবে কাজ করে:** 
  - `POST /api/auth/signup`: নতুন ইউজার অ্যাকাউন্ট তৈরি করে।
  - `POST /api/auth/login`: ইউজারের ক্রেডেনশিয়াল যাচাই করে JWT টোকেন ইস্যু করে।
  - `POST /api/auth/google`: গুগলের ইমেইল ও নাম ব্যবহার করে সরাসরি ওয়ান-ট্যাপ সাইন-ইন নিশ্চিত করে। ইমেইলটি ডাটাবেজে না থাকলে ইনস্ট্যান্টলি ফ্রি ইউজার হিসেবে সাইনআপ হয়ে যায়।

### 📂 backend/auth/routes/[auth_otp.py](file:///home/sakib/Documents/GitHub/Mentora---An-AI-Based-Mental-Health-Self-Awareness/backend/auth/routes/auth_otp.py)
* **কাজ:** ওটিপি (OTP) ও দ্বি-স্তর ভেরিফিকেশন (2FA)।
* **কীভাবে কাজ করে:** পাসওয়ার্ড রিসেট বা মেইল ভেরিফিকেশনের জন্য ওটিপি জেনারেট, সেন্ড এবং ওটিপি ও ইমেইলের ম্যাপিং ভেরিফাই করে।

### 📂 backend/auth/routes/[verification.py](file:///home/sakib/Documents/GitHub/Mentora---An-AI-Based-Mental-Health-Self-Awareness/backend/auth/routes/verification.py)
* **কাজ:** অ্যাকাউন্ট একটিভেশন এবং ইমেইল ভেরিফিকেশন লিংক প্রসেস করা।

### 📂 backend/auth/dependencies/auth.py
* **কাজ:** সিকিউরিটি ডিপেন্ডেন্সি।
* **কীভাবে কাজ করে:** [get_current_user](file:///home/sakib/Documents/GitHub/Mentora---An-AI-Based-Mental-Health-Self-Awareness/backend/auth/dependencies/auth.py) ফাংশনটি যেকোনো সুরক্ষিত API এন্ডপয়েন্টে রিকোয়েস্ট করা ইউজারের হেডার থেকে JWT টোকেন যাচাই করে ডাটাবেজ থেকে ইউজারের কারেন্ট অবজেক্ট ফেরত দেয়।

---

## ফ্রন্টএন্ড ফাইলসমূহ (Frontend Files)

### 📂 frontend/src/pages/[LoginPage.jsx](file:///home/sakib/Documents/GitHub/Mentora---An-AI-Based-Mental-Health-Self-Awareness/frontend/src/pages/LoginPage.jsx)
* **কাজ:** সাইন-ইন ইন্টারফেস।
* **কীভাবে কাজ করে:** ইমেইল ও পাসওয়ার্ড ইনপুট নেয়, ফর্ম ভ্যালিডেশন করে এবং গুগলের মাধ্যমে লগইন করার অপশন দেখায়। সফল লগইনে এটি ব্রাউজারের `localStorage`-এ টোকেন সেভ করে এবং ড্যাশবোর্ডে রিডাইরেক্ট করে।

### 📂 frontend/src/pages/[SignupPage.jsx](file:///home/sakib/Documents/GitHub/Mentora---An-AI-Based-Mental-Health-Self-Awareness/frontend/src/pages/SignupPage.jsx)
* **কাজ:** নতুন ইউজার রেজিস্ট্রেশন ইন্টারফেস।
* **কীভাবে কাজ করে:** ইউজারের নাম, ইমেইল, পাসওয়ার্ড ইনপুট নিয়ে ব্যাকএন্ডের `/auth/signup`-এ ডেটা পাঠায়।

### 📂 frontend/src/pages/[Profile.jsx](file:///home/sakib/Documents/GitHub/Mentora---An-AI-Based-Mental-Health-Self-Awareness/frontend/src/pages/Profile.jsx)
* **কাজ:** ইউজারের প্রোফাইল ইনফরমেশন দেখা ও এডিট করা।
* **কীভাবে কাজ করে:** ইউজারের নাম, ইমেইল, মোবাইল নম্বর এবং সাবস্ক্রিপশন স্ট্যাটাস (ফ্রি বনাম প্রিমিয়াম) দেখায় এবং তথ্য আপডেট করার সুযোগ দেয়।
