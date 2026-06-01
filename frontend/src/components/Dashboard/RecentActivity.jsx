import React from 'react';

const RecentActivity = ({ activities }) => {
    // সিমুলেটেড ডাটা (পরে ব্যাকএন্ড থেকে আসবে)
    const defaultActivities = [
        {
            id: 1,
            type: 'assessment',
            title: 'সাপ্তাহিক মানসিক স্বাস্থ্য পরীক্ষা',
            score: 78,
            date: '২ ঘণ্টা আগে',
            icon: '📝',
            color: 'purple'
        },
        {
            id: 2,
            type: 'meditation',
            title: 'মেডিটেশন সেশন',
            duration: '১৫ মিনিট',
            date: 'গতকাল',
            icon: '🧘',
            color: 'blue'
        },
        {
            id: 3,
            type: 'report',
            title: 'সাপ্তাহিক রিপোর্ট জেনারেট',
            date: 'গতকাল',
            icon: '📊',
            color: 'green'
        },
        {
            id: 4,
            type: 'tip',
            title: 'দৈনিক স্বাস্থ্য টিপস',
            date: '৩ দিন আগে',
            icon: '💡',
            color: 'orange'
        }
    ];
    
    const activityList = activities || defaultActivities;
    
    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">সাম্প্রতিক কার্যকলাপ</h3>
                <button className="text-purple-600 text-sm hover:underline">সব দেখুন →</button>
            </div>
            
            <div className="space-y-4">
                {activityList.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition">
                        <div className={`w-10 h-10 bg-${activity.color}-100 rounded-lg flex items-center justify-center text-xl`}>
                            {activity.icon}
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-gray-800">{activity.title}</p>
                            <div className="flex items-center gap-3 text-sm text-gray-500">
                                {activity.score && <span>স্কোর: {activity.score}%</span>}
                                {activity.duration && <span>{activity.duration}</span>}
                                <span>{activity.date}</span>
                            </div>
                        </div>
                        <button className="text-gray-400 hover:text-purple-600">→</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentActivity;