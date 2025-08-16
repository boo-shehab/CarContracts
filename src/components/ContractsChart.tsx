import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import axios from "../services/axios";

export default function ContractsChart({ date, type }: any) {
    const [data, setData] = useState([]);
    useEffect(() => {
  if (!date || !type) return;

  axios
    .get(
      `/dashboard/contracts?period=${type}&start=${date
        .toISOString()
        .split("T")[0]}`
    )
    .then((response) => {
      const rawData = response.data.data; 
      let chartData: any = [];

      if (type === "year") {
        // API returns: { "1": 120, "2": 80, ... }
        const months = [
          "يناير",
          "فبراير",
          "مارس",
          "ابريل",
          "مايو",
          "يونيو",
          "يوليو",
          "اغسطس",
          "سبتمبر",
          "اكتوبر",
          "نوفمبر",
          "ديسمبر",
        ];

        chartData = months.map((month, index) => ({
          time: month,
          value: rawData[index + 1] ?? 0, // month numbers are 1–12
        }));
      } 
      else if (type === "month") {
        // API returns: { "1": 50, "2": 40, ... } (days of month)
        const daysInMonth = new Date(
          date.getFullYear(),
          date.getMonth() + 1,
          0
        ).getDate();

        chartData = Array.from({ length: daysInMonth }, (_, i) => ({
          time: `${i + 1}`,
          value: rawData[i + 1] ?? 0,
        }));
      } 
      else if (type === "week") {
        // API returns: { "1": 20, "2": 30, ... } (1 = Saturday)
        const days = ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"];

        chartData = days.map((day, index) => ({
          time: day,
          value: rawData[index + 1] ?? 0,
        }));
      } 
      else if (type === "day") {
        // API returns: { "9:00 Am": 10, "10:00 Am": 5, ... }
        chartData = Object.entries(rawData).map(([key, value]) => ({
          time: key,
          value,
        }));
      }

      setData(chartData);
    })
    .catch((error) => {
      console.error(error);
    });
}, [date, type]);

  return (
    <div className="bg-white p-4 rounded-2xl shadow">
      <h2 className="font-bold mb-4">العقود</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#3B82F6" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
