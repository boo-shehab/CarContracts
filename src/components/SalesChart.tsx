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
          // { "2025-8": 1000000, "2025-10": 2500000, ... }
          // create an array of the months like 2025-8 without the days of 12 month starting with the date
          const months = Array.from({ length: 12 }, (_, i) => {
            const month = new Date(date.getFullYear(), date.getMonth() + 1 + i);
            return month.toISOString().slice(0, 7);
          });          

          chartData = months.map((month) => ({
            time: month,
            value: rawData[month] ?? 0,
          }));
        } else if (type === "month") {
          const daysInMonth = Array.from({ length: 30 }, (_, i) => {
            const day = new Date(date);
            day.setDate(day.getDate() + i + 1);
            return day.toISOString().slice(0, 10);
          });          

          chartData = daysInMonth.map((day) => ({
            time: day,
            value: rawData[day] ?? 0,
          }));

        } else if (type === "week") {
          const days = Array.from({ length: 7 }, (_, i) => {
            const day = new Date(date);
            day.setDate(day.getDate() + i + 1);
            return day.toISOString().slice(0, 10);
          });

          chartData = days.map((day) => ({
            time: day,
            value: rawData[day] ?? 0,
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
