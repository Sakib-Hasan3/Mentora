# Mentora Dashboard এবং CMS গাইড

ইউজারের নিজের মানসিক স্বাস্থ্যের রিয়েল-টাইম গ্রাফ, সাম্প্রতিক কার্যকলাপ এবং অ্যাডমিনদের কনটেন্ট ম্যানেজমেন্টের জন্য ড্যাশবোর্ড মডিউলটি ডিজাইন করা হয়েছে।

---

## ব্যাকএন্ড ফাইলসমূহ (Backend Files)

### 📂 backend/dashboard/routes/[dashboard.py](file:///home/sakib/Documents/GitHub/Mentora---An-AI-Based-Mental-Health-Self-Awareness/backend/dashboard/routes/dashboard.py)
* **কাজ:** ইউজারের পার্সোনাল ড্যাশবোর্ড ডাটা প্রোভাইড করা।
* **কীভাবে কাজ করে:** 
  - `GET /api/dashboard/stats`: ইউজারের শেষ মানসিক স্বাস্থ্য পরীক্ষার স্কোর, স্ট্রেস লেভেল, মেডিটেশন সেশনের সংখ্যা এবং আগের মাসের তুলনায় পারফরমেন্সের হার হিসেব করে।
  - `GET /api/dashboard/chart-data`: গ্রাফ তৈরি করার জন্য শেষ ৭টি মানসিক স্বাস্থ্য পরীক্ষার স্কোর এবং তারিখ প্রোভাইড করে।
  - `GET /api/dashboard/recent-activity`: সাম্প্রতিক পরীক্ষা ও চ্যাটের তথ্য ক্রমানুসারে সাজিয়ে পাঠায়।

### 📂 backend/cms/routes/
* **কাজ:** অ্যাডমিন প্যানেল থেকে মানসিক স্বাস্থ্য বিষয়ক বই, আর্টিকেল ও ভিডিও নিয়ন্ত্রণ করা।
* **কীভাবে কাজ করে:** নতুন কনটেন্ট তৈরি, এডিট ও ডিলিট করার এপিআই এন্ডপয়েন্ট হ্যান্ডেল করে (শুধুমাত্র অ্যাডমিন রোলধারীদের জন্য)।

---

## ফ্রন্টএন্ড ফাইলসমূহ (Frontend Files)

### 📂 frontend/src/pages/[Dashboard.jsx](file:///home/sakib/Documents/GitHub/Mentora---An-AI-Based-Mental-Health-Self-Awareness/frontend/src/pages/Dashboard.jsx) ও [DashboardPage.jsx](file:///home/sakib/Documents/GitHub/Mentora---An-AI-Based-Mental-Health-Self-Awareness/frontend/src/pages/DashboardPage.jsx)
* **কাজ:** মেন্টোরার প্রধান ইউজার ড্যাশবোর্ড ইন্টারফেস।
* **কীভাবে কাজ করে:**
  - এটি লগইন করার পর মূল স্ক্রিন যেখানে ইউজার তাদের মেন্টাল স্কোরের ভিজ্যুয়াল চার্ট দেখতে পান।
  - এতে কুইক নেভিগেশন কার্ড রয়েছে (যেমন: কুইজ টেস্ট দেওয়া, RAG চ্যাটবট অ্যাক্সেস, রিল্যাক্সেশন মিউজিক)।
  - ইউজারের সাম্প্রতিক মেজাজ (Mood) ও কার্যক্রমের গ্রাফিকাল ও চার্ট ভিউ এখানে রেন্ডার করা হয়।

### 📂 frontend/src/pages/[AdminDashboard.jsx](file:///home/sakib/Documents/GitHub/Mentora---An-AI-Based-Mental-Health-Self-Awareness/frontend/src/pages/AdminDashboard.jsx) ও [AdminLogin.jsx](file:///home/sakib/Documents/GitHub/Mentora---An-AI-Based-Mental-Health-Self-Awareness/frontend/src/pages/AdminLogin.jsx)
* **কাজ:** অ্যাডমিন প্যানেলের ম্যানেজমেন্ট ইন্টারফেস।
* **কীভাবে কাজ করে:** অ্যাডমিন লগইন করার পর এই ড্যাশবোর্ড থেকে ইউজারদের তালিকা দেখা, নতুন সাইকোলজিস্ট অ্যাড করা এবং আর্টিকেল/রিসোর্স আপলোড করার কাজ সম্পন্ন করতে পারেন।
