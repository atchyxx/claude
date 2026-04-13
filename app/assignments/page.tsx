"use client";

import { useEffect, useState } from "react";
import { Assignment } from "@/types";
import { loadData, addAssignment, deleteAssignment } from "@/lib/storage";

const SUBJECTS = ["国語", "算数", "理科", "社会", "英語", "体育", "音楽", "図工", "その他"];

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("算数");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setAssignments(loadData().assignments);
  }, []);

  const handleAdd = () => {
    if (!title.trim()) {
      setError("タイトルを入力してください");
      return;
    }
    if (!dueDate) {
      setError("提出期限を入力してください");
      return;
    }
    const assignment: Assignment = {
      id: `a${Date.now()}`,
      title: title.trim(),
      subject,
      dueDate,
      description: description.trim(),
    };
    addAssignment(assignment);
    setAssignments(loadData().assignments);
    setTitle("");
    setSubject("算数");
    setDueDate("");
    setDescription("");
    setShowForm(false);
    setError("");
  };

  const handleDelete = (id: string, assignmentTitle: string) => {
    if (!confirm(`「${assignmentTitle}」を削除しますか？\n提出記録もすべて削除されます。`)) return;
    deleteAssignment(id);
    setAssignments(loadData().assignments);
  };

  const isOverdue = (dateStr: string) => new Date(dateStr) < new Date();

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">課題管理</h1>
          <p className="text-slate-500 text-sm mt-1">宿題・課題の追加・削除ができます</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          + 課題を追加
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
          <h2 className="font-semibold text-slate-700 mb-4">新しい課題を追加</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                タイトル <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="例：算数プリント5枚"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">科目</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                提出期限 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={dueDate}
                min={todayStr}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">説明（任意）</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="例：教科書P.34の問題"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleAdd}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              追加する
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setError("");
                setTitle("");
                setSubject("算数");
                setDueDate("");
                setDescription("");
              }}
              className="border border-slate-300 text-slate-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              キャンセル
            </button>
          </div>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {assignments.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <p className="text-lg">課題がありません</p>
            <p className="text-sm mt-1">「課題を追加」ボタンから登録してください</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-6 py-3 font-semibold text-slate-600">タイトル</th>
                <th className="text-left px-6 py-3 font-semibold text-slate-600">科目</th>
                <th className="text-left px-6 py-3 font-semibold text-slate-600">提出期限</th>
                <th className="text-left px-6 py-3 font-semibold text-slate-600">説明</th>
                <th className="text-right px-6 py-3 font-semibold text-slate-600">操作</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((a, i) => (
                <tr
                  key={a.id}
                  className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${i === assignments.length - 1 ? "border-0" : ""}`}
                >
                  <td className="px-6 py-4 font-medium text-slate-800">{a.title}</td>
                  <td className="px-6 py-4">
                    <span className="bg-indigo-50 text-indigo-700 text-xs px-2 py-0.5 rounded-full">
                      {a.subject}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        isOverdue(a.dueDate)
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {isOverdue(a.dueDate) ? "⚠️ " : ""}
                      {a.dueDate}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{a.description || "—"}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(a.id, a.title)}
                      className="text-red-500 hover:text-red-700 text-xs font-medium hover:underline"
                    >
                      削除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
