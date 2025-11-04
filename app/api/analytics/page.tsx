"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useSession } from "next-auth/react";

export default function AnalyticsPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<any[]>([]);

  useEffect(() => {
    async function fetchStats() {
      const res = await fetch("/api/analytics-data");
      const data = await res.json();
      if (data.success) setStats(data.stats);
    }
    fetchStats();
  }, []);

  if (!session)
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>Please log in first.</p>
      </main>
    );

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100 p-10">
      <h1 className="text-3xl font-bold mb-6 text-blue-400">📊 Message Analytics</h1>

      <div className="bg-white/10 p-6 rounded-2xl shadow-xl border border-white/10">
        <h2 className="text-xl font-semibold mb-4">Messages Sent per Channel</h2>

        {stats.length === 0 ? (
          <p className="text-gray-400">No data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={stats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="channel" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </main>
  );
}
