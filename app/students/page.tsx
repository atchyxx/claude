"use client";

import { useEffect, useState } from "react";
import { Student } from "@/types";
import { loadData, addStudent, deleteStudent } from "@/lib/storage";

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [cls, setCls] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setStudents(loadData().students);
  }, []);

  const handleAdd = () => {
    if (!name.trim()) {
      setError("名前を入力してください");
      return;
    }
    const student: Student = {
      id: `s${Date.now()}`,
      name: name.trim(),
      class: cls.trim(),
    };
    addStudent(student);
    setStudents(loadData().students);
    setName("");
    setCls("");
    setShowForm(false);
    setError("");
  };

  const handleDelete = (id: string, studentName: string) => {
    if (!confirm(`「${studentName}」を削除しますか？\n提出記録もすべて削除されます。`)) return;
    deleteStudent(id);
    setStudents(loadData().students);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">生徒管理</h1>
          <p className="text-slate-500 text-sm mt-1">生徒の追加・削除ができます</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          + 生徒を追加
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
          <h2 className="font-semibold text-slate-700 mb-4">新しい生徒を追加</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                氏名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例：田中 太郎"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">クラス</label>
              <input
                type="text"
                value={cls}
                onChange={(e) => setCls(e.target.value)}
                placeholder="例：3年1組"
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
                setName("");
                setCls("");
              }}
              className="border border-slate-300 text-slate-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              キャンセル
            </button>
          </div>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {students.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <p className="text-lg">生徒がいません</p>
            <p className="text-sm mt-1">「生徒を追加」ボタンから登録してください</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-6 py-3 font-semibold text-slate-600">氏名</th>
                <th className="text-left px-6 py-3 font-semibold text-slate-600">クラス</th>
                <th className="text-right px-6 py-3 font-semibold text-slate-600">操作</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr
                  key={s.id}
                  className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${i === students.length - 1 ? "border-0" : ""}`}
                >
                  <td className="px-6 py-4 font-medium text-slate-800">{s.name}</td>
                  <td className="px-6 py-4 text-slate-500">{s.class || "—"}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(s.id, s.name)}
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
