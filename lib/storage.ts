import { AppData, Student, Assignment, Submission } from "@/types";

const STORAGE_KEY = "submission-check-app";

const defaultData: AppData = {
  students: [
    { id: "s1", name: "田中 太郎", class: "3年1組" },
    { id: "s2", name: "鈴木 花子", class: "3年1組" },
    { id: "s3", name: "佐藤 次郎", class: "3年1組" },
  ],
  assignments: [
    {
      id: "a1",
      title: "算数プリント",
      subject: "算数",
      dueDate: "2026-04-15",
      description: "教科書P.34の問題",
    },
    {
      id: "a2",
      title: "日記",
      subject: "国語",
      dueDate: "2026-04-14",
      description: "春休みの思い出を書く",
    },
  ],
  submissions: [
    { studentId: "s1", assignmentId: "a1", submitted: true, submittedAt: "2026-04-13" },
    { studentId: "s2", assignmentId: "a1", submitted: false },
    { studentId: "s3", assignmentId: "a1", submitted: false },
    { studentId: "s1", assignmentId: "a2", submitted: true, submittedAt: "2026-04-12" },
    { studentId: "s2", assignmentId: "a2", submitted: true, submittedAt: "2026-04-13" },
    { studentId: "s3", assignmentId: "a2", submitted: false },
  ],
};

export function loadData(): AppData {
  if (typeof window === "undefined") return defaultData;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    saveData(defaultData);
    return defaultData;
  }
  return JSON.parse(raw) as AppData;
}

export function saveData(data: AppData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function addStudent(student: Student): void {
  const data = loadData();
  data.students.push(student);
  // 新しい生徒に既存の全課題の未提出レコードを追加
  data.assignments.forEach((a) => {
    const exists = data.submissions.find(
      (s) => s.studentId === student.id && s.assignmentId === a.id
    );
    if (!exists) {
      data.submissions.push({ studentId: student.id, assignmentId: a.id, submitted: false });
    }
  });
  saveData(data);
}

export function deleteStudent(studentId: string): void {
  const data = loadData();
  data.students = data.students.filter((s) => s.id !== studentId);
  data.submissions = data.submissions.filter((s) => s.studentId !== studentId);
  saveData(data);
}

export function addAssignment(assignment: Assignment): void {
  const data = loadData();
  data.assignments.push(assignment);
  // 全生徒に未提出レコードを追加
  data.students.forEach((s) => {
    data.submissions.push({ studentId: s.id, assignmentId: assignment.id, submitted: false });
  });
  saveData(data);
}

export function deleteAssignment(assignmentId: string): void {
  const data = loadData();
  data.assignments = data.assignments.filter((a) => a.id !== assignmentId);
  data.submissions = data.submissions.filter((s) => s.assignmentId !== assignmentId);
  saveData(data);
}

export function toggleSubmission(studentId: string, assignmentId: string): void {
  const data = loadData();
  const idx = data.submissions.findIndex(
    (s) => s.studentId === studentId && s.assignmentId === assignmentId
  );
  if (idx === -1) {
    data.submissions.push({
      studentId,
      assignmentId,
      submitted: true,
      submittedAt: new Date().toISOString().split("T")[0],
    });
  } else {
    const current = data.submissions[idx];
    data.submissions[idx] = {
      ...current,
      submitted: !current.submitted,
      submittedAt: !current.submitted ? new Date().toISOString().split("T")[0] : undefined,
    };
  }
  saveData(data);
}

export function updateNote(studentId: string, assignmentId: string, note: string): void {
  const data = loadData();
  const idx = data.submissions.findIndex(
    (s) => s.studentId === studentId && s.assignmentId === assignmentId
  );
  if (idx !== -1) {
    data.submissions[idx].note = note;
    saveData(data);
  }
}
