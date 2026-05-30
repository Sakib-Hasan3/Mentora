import React from 'react';

const steps = [
    {
        number: '01',
        icon: '📝',
        title: 'মুড লিখে রাখুন',
        description: 'কয়েক সেকেন্ডেই জার্নাল-স্টাইল এন্ট্রিতে কীভাবে অনুভব করছেন তা লিখে ফেলুন।'
    },
    {
        number: '02',
        icon: '🧠',
        title: 'AI সারাংশ তৈরি করুন',
        description: 'সিস্টেমটি আবেগের ধরনগুলো সংক্ষেপ করে এবং সবচেয়ে গুরুত্বপূর্ণ বিষয়গুলো সামনে আনে।'
    },
    {
        number: '03',
        icon: '💚',
        title: 'ব্যক্তিগত গাইডেন্স নিন',
        description: 'আপনার জন্য উপযোগী পরামর্শ স্বাস্থ্যকর রুটিন আর আরও শান্ত অভ্যাস তৈরি করতে সাহায্য করে।'
    },
    {
        number: '04',
        icon: '📈',
        title: 'অগ্রগতি ট্র্যাক করুন',
        description: 'ড্যাশবোর্ডে উন্নতি স্পষ্টভাবে দেখা যায় এবং প্রয়োজনে care team-এর সাথে শেয়ার করাও সহজ।'
    }
];

const HowItWorks = () => {
    return (
        <section className="content-section soft-section">
            <div className="container">
                <div className="section-heading reveal">
                    <span className="section-kicker">কীভাবে কাজ করে</span>
                    <h2>স্ট্যাটিক ব্রোশিউরের মতো নয়, বরং একটি পরিষ্কার SaaS workflow</h2>
                    <p>
                        প্রথম ইন্টারঅ্যাকশন থেকেই অভিজ্ঞতাটি যেন দ্রুত, নির্দেশিত, আর পরিমাপযোগ্য মনে হয় সেভাবেই সাজানো।
                    </p>
                </div>

                <div className="steps-grid">
                    {steps.map((step) => (
                        <article key={step.number} className="step-card reveal">
                            <div className="step-number">{step.number}</div>
                            <div className="step-icon">{step.icon}</div>
                            <h3>{step.title}</h3>
                            <p>{step.description}</p>
                        </article>
                    ))}
                </div>

                <div className="cta-band reveal" id="demo">
                    <div>
                        <span className="section-kicker">প্রোডাক্ট প্রিভিউ</span>
                        <h3>ড্যাশবোর্ড, AI insight, আর সহায়তা এক ফ্লোতে দেখে নিন</h3>
                    </div>
                    <a className="btn btn-primary" href="#footer">
                        ডেমো বুক করুন
                    </a>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;