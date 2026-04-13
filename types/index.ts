export interface Student {
  id: string;
  name: string;
  class: string;
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  description: string;
}

export interface Submission {
  studentId: string;
  assignmentId: string;
  submitted: boolean;
  submittedAt?: string;
  note?: string;
}

export interface AppData {
  students: Student[];
  assignments: Assignment[];
  submissions: Submission[];
}
