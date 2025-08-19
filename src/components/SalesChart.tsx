import axios from "../services/axios";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function SalesChart({ date, type }: any) {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (!date || !type) return;

    axios
      .get(
        `/dashboard/installments?period=${type}&start=${date
          .toISOString()
          .split("T")[0]}`
      )
      .then((response) => {
        const rawData = response.data.data;
        let chartData: any[] = [];

        if (type === "year") {
          // { "1": 1000000, "2": 2500000, ... }
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
            value: rawData[index + 1] ?? 0,
          }));
        } else if (type === "month") {
          const daysInMonth = new Date(
            date.getFullYear(),
            date.getMonth() + 1,
            0
          ).getDate();

          chartData = Array.from({ length: daysInMonth }, (_, i) => ({
            time: `${i + 1}`,
            value: rawData[i + 1] ?? 0,
          }));
        } else if (type === "week") {
          const days = [
            "السبت",
            "الأحد",
            "الاثنين",
            "الثلاثاء",
            "الأربعاء",
            "الخميس",
            "الجمعة",
          ];

          chartData = days.map((day, index) => ({
            time: day,
            value: rawData[index + 1] ?? 0,
          }));
        } else if (type === "day") {
          // API returns { "9:00Am": 10000000, "10:00Am": 15000000, ... }
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
      <h2 className="font-bold mb-4">قيمة المبيعات</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid stroke="#ddd" />
          <XAxis dataKey="time" />
          <YAxis
            tickFormatter={(value) =>
              new Intl.NumberFormat("en-US").format(value)
            }
          />
          <Tooltip
            formatter={(value: any) =>
              new Intl.NumberFormat("en-US").format(value)
            }
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
