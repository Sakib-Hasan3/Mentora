# Mentora Community Forum গাইড

কমিউনিটি ফোরামের লক্ষ্য হলো ইউজারদের নিজেদের অনুভূতি বেনামে বা সশরীরে একে অপরের সাথে ভাগ করে নেওয়ার সুবিধা দেওয়া। একই সাথে ভৌগলিক এলাকা (বিভাগ ও জেলা) ভিত্তিক আলোচনা ফিল্টারিং করার সুবিধাও রয়েছে।

---

## ব্যাকএন্ড ফাইলসমূহ (Backend Files)

### 📂 backend/community/routes/[community.py](file:///home/sakib/Documents/GitHub/Mentora---An-AI-Based-Mental-Health-Self-Awareness/backend/community/routes/community.py)
* **কাজ:** পোস্ট ও কমেন্টের যাবতীয় অপারেশন এবং এলাকা ভিত্তিক ফিল্টারিং পরিচালনা করা।
* **কীভাবে কাজ করে:** 
  - `GET /api/community/divisions`: বাংলাদেশের ৮টি বিভাগ ও তাদের জেলাগুলোর তালিকা প্রদান করে।
  - `POST /api/community/posts`: নতুন পোস্ট ক্রিয়েট করে। এতে `is_anonymous` ট্রু থাকলে পোস্টদাতার নাম গোপন রেখে বেনামী পোস্ট তৈরি করা হয়।
  - `GET /api/community/posts`: সব পোস্ট পেজিনেশনসহ রিটার্ন করে। বিভাগ ভিত্তিক ফিল্টারিং করা যায়।
  - `POST /api/community/posts/{post_id}/like`: পোস্টে লাইক ও আনলাইক টগল করে।
  - `POST /api/community/posts/{post_id}/comments`: পোস্টে কমেন্ট যোগ করে এবং পোস্টের মূল ইউজারকে নোটিফিকেশন পাঠায়।

---

## ফ্রন্টএন্ড ফাইলসমূহ (Frontend Files)

### 📂 frontend/src/pages/[CommunityPage.jsx](file:///home/sakib/Documents/GitHub/Mentora---An-AI-Based-Mental-Health-Self-Awareness/frontend/src/pages/CommunityPage.jsx)
* **কাজ:** কমিউনিটি স্ক্রিন এবং ফোরাম পোস্টের তালিকা।
* **কীভাবে কাজ করে:**
  - এটি ফোরামের মূল পেজ যেখানে সকল ইউজারদের পোস্ট ফিড আকারে দেখা যায়।
  - ইউজাররা বিভাগ (Division) সিলেক্ট করে তাদের এলাকার পোস্ট ফিল্টার করে দেখতে পারেন।
  - বেনামে (Anonymous) পোস্ট তৈরি করার জন্য একটি টগল সুইচ বিশিষ্ট পপআপ বক্স প্রদান করে।
  - লাইক বাটনে ক্লিক করলে রিয়েল-টাইমে লাইকের সংখ্যা পরিবর্তন হয় এবং কমেন্ট সেকশনে মন্তব্য করা যায়।
