"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppData } from "@/types";
import { loadData } from "@/lib/storage";

export default function DashboardPage() {
  const [data, setData] = useState<AppData | null>(null);

  useEffect(() => {
    setData(loadData());
  }, []);

  if (!data) return null;

  const { students, assignments, submissions } = data;

  const totalPairs = students.length * assignments.length;
  const submittedCount = submissions.filter((s) => s.submitted).length;
  const pendingCount = totalPairs - submittedCount;
  const submissionRate = totalPairs > 0 ? Math.round((submittedCount / totalPairs) * 100) : 0;

  const assignmentStats = assignments.map((a) => {
    const total = students.length;
    const submitted = submissions.filter((s) => s.assignmentId === a.id && s.submitted).length;
    const overdue = new Date(a.dueDate) < new Date() && submitted < total;
    return { ...a, total, submitted, pending: total - submitted, overdue };
  });

  const studentStats = students.map((s) => {
    const total = assignments.length;
    const submitted = submissions.filter((sub) => sub.studentId === s.id && sub.submitted).length;
    return { ...s, total, submitted, pending: total - submitted };
  });

  const urgentAssignments = assignmentStats.filter((a) => a.overdue && a.pending > 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 mb-1">ダッシュボード</h1>
        <p className="text-slate-500 text-sm">提出状況の概要</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="生徒数" value={students.length} unit="人" color="blue" />
        <StatCard label="課題数" value={assignments.length} unit="件" color="purple" />
        <StatCard label="提出済み" value={submittedCount} unit="件" color="green" />
        <StatCard label="未提出" value={pendingCount} unit="件" color="red" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-slate-700">全体の提出率</h2>
          <span className="text-2xl font-bold text-indigo-600">{submissionRate}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-4">
          <div
            className="bg-indigo-500 h-4 rounded-full transition-all"
            style={{ width: `${submissionRate}%` }}
          />
        </div>
        <p className="text-xs text-slate-400 mt-2">
          {submittedCount} / {totalPairs} 件提出済み
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-700 mb-4">
            ⚠️ 要注意の課題
            {urgentAssignments.length > 0 && (
              <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                {urgentAssignments.length}件
              </span>
            )}
          </h2>
          {urgentAssignments.length === 0 ? (
            <p className="text-slate-400 text-sm">期限切れの未提出課題はありません</p>
          ) : (
            <ul className="space-y-2">
              {urgentAssignments.map((a) => (
                <li
                  key={a.id}
                  className="flex items-center justify-between text-sm bg-red-50 rounded-lg px-3 py-2"
                >
                  <div>
                    <span className="font-medium text-slate-800">{a.title}</span>
                    <span className="ml-2 text-xs text-slate-500">{a.subject}</span>
                  </div>
                  <span className="text-red-600 font-semibold">{a.pending}人 未提出</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-700 mb-4">課題別の提出状況</h2>
          {assignmentStats.length === 0 ? (
            <p className="text-slate-400 text-sm">課題がありません</p>
          ) : (
            <ul className="space-y-3">
              {assignmentStats.map((a) => (
                <li key={a.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-700">{a.title}</span>
                    <span className="text-slate-500">
                      {a.submitted}/{a.total}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${a.pending === 0 ? "bg-green-500" : "bg-indigo-400"}`}
                      style={{ width: a.total > 0 ? `${(a.submitted / a.total) * 100}%` : "0%" }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-700">生徒別の提出状況</h2>
          <Link href="/submissions" className="text-sm text-indigo-600 hover:underline">
            詳細を見る →
          </Link>
        </div>
        {studentStats.length === 0 ? (
          <p className="text-slate-400 text-sm">生徒がいません</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {studentStats.map((s) => (
              <div key={s.id} className="border border-slate-100 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm text-slate-800">{s.name}</span>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      s.pending === 0
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {s.pending === 0 ? "全提出" : `${s.pending}件未提出`}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{s.class}</p>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                  <div
                    className={`h-1.5 rounded-full ${s.pending === 0 ? "bg-green-500" : "bg-indigo-400"}`}
                    style={{ width: s.total > 0 ? `${(s.submitted / s.total) * 100}%` : "0%" }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  unit,
  color,
}: {
  label: string;
  value: number;
  unit: string;
  color: "blue" | "purple" | "green" | "red";
}) {
  const colors = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    purple: "bg-purple-50 text-purple-700 border-purple-100",
    green: "bg-green-50 text-green-700 border-green-100",
    red: "bg-red-50 text-red-700 border-red-100",
  };
  return (
    <div className={`rounded-xl border p-4 ${colors[color]}`}>
      <p className="text-xs font-medium opacity-70 mb-1">{label}</p>
      <p className="text-3xl font-bold">
        {value}
        <span className="text-sm font-medium ml-1">{unit}</span>
      </p>
    </div>
  );
}
