"use client";

import { useEffect, useState } from "react";
import { AppData } from "@/types";
import { loadData, toggleSubmission } from "@/lib/storage";

export default function SubmissionsPage() {
  const [data, setData] = useState<AppData | null>(null);
  const [filterAssignment, setFilterAssignment] = useState<string>("all");

  useEffect(() => {
    setData(loadData());
  }, []);

  const handleToggle = (studentId: string, assignmentId: string) => {
    toggleSubmission(studentId, assignmentId);
    setData(loadData());
  };

  if (!data) return null;

  const { students, assignments, submissions } = data;

  const filteredAssignments =
    filterAssignment === "all" ? assignments : assignments.filter((a) => a.id === filterAssignment);

  const getSubmission = (studentId: string, assignmentId: string) =>
    submissions.find((s) => s.studentId === studentId && s.assignmentId === assignmentId);

  const isOverdue = (dateStr: string) => new Date(dateStr) < new Date();

  if (students.length === 0 || assignments.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">提出チェック</h1>
          <p className="text-slate-500 text-sm mt-1">生徒と課題を登録するとチェックできます</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400">
          <p className="text-lg">データがありません</p>
          <p className="text-sm mt-1">
            「生徒管理」と「課題管理」でそれぞれ登録してください
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">提出チェック</h1>
          <p className="text-slate-500 text-sm mt-1">クリックして提出済みにマーク</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <label className="text-sm text-slate-600 font-medium">課題で絞り込み:</label>
          <select
            value={filterAssignment}
            onChange={(e) => setFilterAssignment(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="all">すべて表示</option>
            {assignments.map((a) => (
              <option key={a.id} value={a.id}>
                {a.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 凡例 */}
      <div className="flex gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="w-5 h-5 rounded bg-green-500 inline-block" />
          提出済み
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-5 h-5 rounded bg-slate-200 inline-block" />
          未提出
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-5 h-5 rounded bg-red-100 border border-red-300 inline-block" />
          期限切れ・未提出
        </span>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-4 py-3 font-semibold text-slate-600 min-w-32 sticky left-0 bg-slate-50 z-10">
                生徒名
              </th>
              {filteredAssignments.map((a) => (
                <th key={a.id} className="px-3 py-3 font-semibold text-slate-600 text-center min-w-28">
                  <div>{a.title}</div>
                  <div
                    className={`text-xs font-normal mt-0.5 ${isOverdue(a.dueDate) ? "text-red-500" : "text-slate-400"}`}
                  >
                    {isOverdue(a.dueDate) ? "⚠️ " : ""}
                    {a.dueDate}
                  </div>
                  <div className="text-xs font-normal text-indigo-400">{a.subject}</div>
                </th>
              ))}
              <th className="px-4 py-3 font-semibold text-slate-600 text-center min-w-20">
                提出率
              </th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => {
              const studentSubmissions = filteredAssignments.map((a) =>
                getSubmission(student.id, a.id)
              );
              const submittedCount = studentSubmissions.filter((s) => s?.submitted).length;
              const rate =
                filteredAssignments.length > 0
                  ? Math.round((submittedCount / filteredAssignments.length) * 100)
                  : 0;

              return (
                <tr key={student.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 sticky left-0 bg-white hover:bg-slate-50 z-10">
                    <div className="font-medium text-slate-800">{student.name}</div>
                    <div className="text-xs text-slate-400">{student.class}</div>
                  </td>
                  {filteredAssignments.map((a) => {
                    const sub = getSubmission(student.id, a.id);
                    const submitted = sub?.submitted ?? false;
                    const overdue = isOverdue(a.dueDate) && !submitted;

                    return (
                      <td key={a.id} className="px-3 py-3 text-center">
                        <button
                          onClick={() => handleToggle(student.id, a.id)}
                          title={
                            submitted
                              ? `提出済み${sub?.submittedAt ? `（${sub.submittedAt}）` : ""}\nクリックで取り消し`
                              : "クリックして提出済みにする"
                          }
                          className={`w-10 h-10 rounded-lg font-bold text-lg transition-all hover:scale-110 active:scale-95 ${
                            submitted
                              ? "bg-green-500 text-white shadow-sm hover:bg-green-600"
                              : overdue
                              ? "bg-red-50 border-2 border-red-300 text-red-400 hover:bg-red-100"
                              : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                          }`}
                        >
                          {submitted ? "✓" : "—"}
                        </button>
                        {submitted && sub?.submittedAt && (
                          <div className="text-xs text-slate-400 mt-0.5">{sub.submittedAt}</div>
                        )}
                      </td>
                    );
                  })}
                  <td className="px-4 py-3 text-center">
                    <div
                      className={`text-sm font-bold ${
                        rate === 100 ? "text-green-600" : rate >= 50 ? "text-indigo-600" : "text-red-500"
                      }`}
                    >
                      {rate}%
                    </div>
                    <div className="text-xs text-slate-400">
                      {submittedCount}/{filteredAssignments.length}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-slate-50 border-t border-slate-200">
              <td className="px-4 py-3 font-semibold text-slate-600 text-sm sticky left-0 bg-slate-50 z-10">
                提出数
              </td>
              {filteredAssignments.map((a) => {
                const count = students.filter(
                  (s) => getSubmission(s.id, a.id)?.submitted
                ).length;
                const rate = students.length > 0 ? Math.round((count / students.length) * 100) : 0;
                return (
                  <td key={a.id} className="px-3 py-3 text-center">
                    <div
                      className={`text-sm font-bold ${
                        rate === 100 ? "text-green-600" : rate >= 50 ? "text-indigo-600" : "text-red-500"
                      }`}
                    >
                      {count}/{students.length}
                    </div>
                    <div className="text-xs text-slate-400">{rate}%</div>
                  </td>
                );
              })}
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
