# Mentora Notification System গাইড

এই মডিউলটি ইউজারের বিভিন্ন অ্যাক্টিভিটি (যেমন: কুইজ সাবমিট করা, ডাক্তারের অ্যাপয়েন্টমেন্ট বুকিং কনফার্ম হওয়া, ফোরামের পোস্টে কেউ কমেন্ট করা) ট্র্যাকিং করে ইউজারকে নোটিফিকেশন পাঠাতে সাহায্য করে।

---

## ব্যাকএন্ড ফাইলসমূহ (Backend Files)

### 📂 backend/notifications/services/[notification_service.py](file:///home/sakib/Documents/GitHub/Mentora---An-AI-Based-Mental-Health-Self-Awareness/backend/notifications/services/notification_service.py)
* **কাজ:** সিস্টেমের নোটিফিকেশনগুলো তৈরি এবং ডাটাবেজে স্টোর করা।
* **কীভাবে কাজ করে:** 
  - `create_notification`: ডাটাবেজের `notifications` কালেকশনে টাইটেল, মেসেজ (বাংলা ও ইংরেজি সংস্করণ), লিংক এবং টাইপ (যেমন: success, warning, error) সহ নতুন ডকুমেন্ট যুক্ত করে।
  - `notify_assessment_completed`: কুইজ দেওয়ার পর এটি কল হয় এবং ইউজারকে কুইজ স্কোর ও ফলাফলের লিংক পাঠায়।
  - `notify_booking_confirmed`: ডাক্তারের অ্যাপয়েন্টমেন্ট সফলভাবে বুক হলে বুকিংয়ের তারিখ ও সময়সহ নোটিফিকেশন তৈরি করে।
  - `notify_community_activity`: ইউজারের কমিউনিটি পোস্টে অন্য কেউ কমেন্ট করলে এটি তাকে নোটিফাই করে।

### 📂 backend/notifications/routes/
* **কাজ:** নোটিফিকেশন এপিআই রাউটার।
* **কীভাবে কাজ করে:** `GET /api/notifications` এপিআই এন্ডপয়েন্টের মাধ্যমে ইউজারের অপঠিত বা পঠিত সকল নোটিফিকেশন রিটার্ন করে। এছাড়া নোটিফিকেশন রিড হিসেবে মার্ক করার সুবিধাও প্রোভাইড করে।

---

## ফ্রন্টএন্ড ফাইলসমূহ (Frontend Files)

### 📂 frontend/src/pages/[NotificationsPage.jsx](file:///home/sakib/Documents/GitHub/Mentora---An-AI-Based-Mental-Health-Self-Awareness/frontend/src/pages/NotificationsPage.jsx)
* **কাজ:** নোটিফিকেশন প্যানেল দেখার ইন্টারফেস।
* **কীভাবে কাজ করে:**
  - হেডার আইকন বা ড্যাশবোর্ড থেকে নোটিফিকেশনে ক্লিক করলে এই পৃষ্ঠাটি লোড হয়।
  - নোটিফিকেশনগুলো সুন্দর আইকন এবং রঙ কোড (সবুজ, হলুদ বা লাল) সহ প্রদর্শিত হয়।
  - কোনো নোটিফিকেশনে ক্লিক করলে রিলেটেড ফিচার পেজে রিডাইরেক্ট করে (যেমন: বুকিং নোটিফিকেশনে ক্লিক করলে বুকিং লিস্টের পাতায় নিয়ে যায়)।
