export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
  createdAt: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  registrationNumber: string;
  department: string;
  createdAt: string;
}

export interface IssuedBook {
  id: string;
  bookId: string;
  studentId: string;
  issueDate: string;
  returnDate: string;
  actualReturnDate?: string;
  status: 'issued' | 'returned' | 'overdue';
  book?: Book;
  student?: Student;
}

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'student';
  name: string;
  email?: string;
}

export type BookFormData = Omit<Book, 'id' | 'createdAt' | 'availableCopies'>;
export type IssueBookFormData = {
  bookId: string;
  studentId: string;
  returnDate: string;
};