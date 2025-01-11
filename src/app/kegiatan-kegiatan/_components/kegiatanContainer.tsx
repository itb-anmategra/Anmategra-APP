import * as React from "react";

export type KegiatanContainer = {
  title: string;
  description: string;
  date: string;
  role: string;
  status: string;
}

export function KegiatanContainer() {
  const activities: KegiatanContainer[] = [
    {
      title: "OSKM",
      description: "Acara pusat ITB",
      date: "28/10/2024",
      role: "Panitia",
      status: "Upcoming",
    },
    {
      title: "OSKM",
      description: "Acara pusat ITB",
      date: "28/10/2024",
      role: "Panitia",
      status: "Upcoming",
    },
  ];

  return (
    <div className="p-6">
      <div className="text-purple-600 mb-4 font-medium"></div>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 rounded-lg border bg-white shadow-sm"
          >
            <div className="w-12 h-12 rounded bg-gray-300"></div>
            <div className="flex-1 mx-4">
              <h3 className="font-medium text-gray-900">{activity.title}</h3>
              <p className="text-sm text-gray-500">{activity.description}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-900">{activity.date}</p>
              <p className="text-xs text-gray-500">{activity.role}</p>
            </div>
            <div className="flex items-center gap-1 text-yellow-600">
              <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
              <p className="text-sm">{activity.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
