import React from "react";
import { Timeline } from "antd";
import "antd/dist/reset.css"; // Ant Design styles

const activitiesData = [
  {
    dateGroup: "اليوم",
    activities: [
      "قمت بإنشاء عقد جديد المرقم ب 1234",
      "قمت بطباعة عقد بيع باسم محمد علي المرقم 346",
      "قمت بطباعة عقد بيع باسم محمد علي المرقم 346",
    ],
  },
  {
    dateGroup: "الأمس",
    activities: [
      "قمت بإنشاء عقد جديد المرقم ب 1234",
      "قمت بطباعة عقد بيع باسم محمد علي المرقم 346",
      "قمت بطباعة عقد بيع باسم محمد علي المرقم 346",
    ],
  },
  {
    dateGroup: "الأسبوع الماضي",
    activities: [
      "قمت بإنشاء عقد جديد المرقم ب 1234",
      "قمت بطباعة عقد بيع باسم محمد علي المرقم 346",
      "قمت بطباعة عقد بيع باسم محمد علي المرقم 346",
    ],
  },
];

export default function ActivitiesTimeline() {
  return (
    <div className="bg-white rounded-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-blue-600 font-bold text-lg mb-4">نشاطاتي</h2>

      {activitiesData.map((group, idx) => (
        <div key={idx} className="mb-6 timeline_container">
          <h3 className="font-bold text-gray-800 mb-2">{group.dateGroup}</h3>
          <Timeline
            mode="left"
            items={group.activities.map((text) => ({
              children: (
                  <span className="text-sm text-gray-800">{text}</span>
              ),
              label: (
                <span className="text-xs text-gray-400">9:00 AM</span>
              ),
            }))}
          />
        </div>
      ))}
    </div>
  );
}
