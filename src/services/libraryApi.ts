import { Book, Student, IssuedBook, BookFormData, IssueBookFormData } from '@/types/library';

// Mock data for demo
const mockBooks: Book[] = [
  {
    id: '1',
    title: 'Introduction to Computer Science',
    author: 'John Smith',
    isbn: '978-0123456789',
    category: 'Computer Science',
    totalCopies: 5,
    availableCopies: 3,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    title: 'Data Structures and Algorithms',
    author: 'Jane Doe',
    isbn: '978-9876543210',
    category: 'Computer Science',
    totalCopies: 4,
    availableCopies: 2,
    createdAt: '2024-01-16'
  },
  {
    id: '3',
    title: 'Physics Fundamentals',
    author: 'Albert Newton',
    isbn: '978-1234567890',
    category: 'Physics',
    totalCopies: 6,
    availableCopies: 0,
    createdAt: '2024-01-17'
  },
  {
    id: '4',
    title: 'Modern Mathematics',
    author: 'Euler Gauss',
    isbn: '978-0987654321',
    category: 'Mathematics',
    totalCopies: 3,
    availableCopies: 1,
    createdAt: '2024-01-18'
  }
];

const mockStudents: Student[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@student.edu',
    registrationNumber: 'CS2023001',
    department: 'Computer Science',
    createdAt: '2024-01-10'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@student.edu',
    registrationNumber: 'PH2023002',
    department: 'Physics',
    createdAt: '2024-01-11'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@student.edu',
    registrationNumber: 'MT2023003',
    department: 'Mathematics',
    createdAt: '2024-01-12'
  }
];

let mockIssuedBooks: IssuedBook[] = [
  {
    id: '1',
    bookId: '1',
    studentId: '1',
    issueDate: '2024-01-20',
    returnDate: '2024-01-27',
    status: 'issued'
  },
  {
    id: '2',
    bookId: '2',
    studentId: '1',
    issueDate: '2024-01-18',
    returnDate: '2024-01-25',
    actualReturnDate: '2024-01-24',
    status: 'returned'
  },
  {
    id: '3',
    bookId: '3',
    studentId: '2',
    issueDate: '2024-01-15',
    returnDate: '2024-01-22',
    status: 'overdue'
  }
];

// Helper function to simulate API delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Books API
export const booksApi = {
  getAll: async (): Promise<Book[]> => {
    await delay();
    return [...mockBooks];
  },

  getById: async (id: string): Promise<Book | null> => {
    await delay();
    return mockBooks.find(book => book.id === id) || null;
  },

  create: async (bookData: BookFormData): Promise<Book> => {
    await delay();
    const newBook: Book = {
      ...bookData,
      id: Date.now().toString(),
      availableCopies: bookData.totalCopies,
      createdAt: new Date().toISOString().split('T')[0]
    };
    mockBooks.push(newBook);
    return newBook;
  },

  update: async (id: string, bookData: BookFormData): Promise<Book> => {
    await delay();
    const index = mockBooks.findIndex(book => book.id === id);
    if (index === -1) throw new Error('Book not found');
    
    const updatedBook: Book = {
      ...bookData,
      id,
      availableCopies: bookData.totalCopies - (mockBooks[index].totalCopies - mockBooks[index].availableCopies),
      createdAt: mockBooks[index].createdAt
    };
    mockBooks[index] = updatedBook;
    return updatedBook;
  },

  delete: async (id: string): Promise<void> => {
    await delay();
    const index = mockBooks.findIndex(book => book.id === id);
    if (index === -1) throw new Error('Book not found');
    mockBooks.splice(index, 1);
  }
};

// Students API
export const studentsApi = {
  getAll: async (): Promise<Student[]> => {
    await delay();
    return [...mockStudents];
  }
};

// Issued Books API
export const issuedBooksApi = {
  getAll: async (): Promise<IssuedBook[]> => {
    await delay();
    return mockIssuedBooks.map(issued => ({
      ...issued,
      book: mockBooks.find(book => book.id === issued.bookId),
      student: mockStudents.find(student => student.id === issued.studentId)
    }));
  },

  getByStudentId: async (studentId: string): Promise<IssuedBook[]> => {
    await delay();
    return mockIssuedBooks
      .filter(issued => issued.studentId === studentId)
      .map(issued => ({
        ...issued,
        book: mockBooks.find(book => book.id === issued.bookId),
        student: mockStudents.find(student => student.id === issued.studentId)
      }));
  },

  issue: async (issueData: IssueBookFormData): Promise<IssuedBook> => {
    await delay();
    
    // Check if book is available
    const book = mockBooks.find(b => b.id === issueData.bookId);
    if (!book || book.availableCopies <= 0) {
      throw new Error('Book not available');
    }

    // Check if student has less than 3 books
    const studentBookCount = mockIssuedBooks.filter(
      issued => issued.studentId === issueData.studentId && issued.status === 'issued'
    ).length;
    
    if (studentBookCount >= 3) {
      throw new Error('Student cannot borrow more than 3 books');
    }

    // Create issued book record
    const newIssued: IssuedBook = {
      id: Date.now().toString(),
      ...issueData,
      issueDate: new Date().toISOString().split('T')[0],
      status: 'issued'
    };

    mockIssuedBooks.push(newIssued);

    // Update book availability
    book.availableCopies -= 1;

    return {
      ...newIssued,
      book,
      student: mockStudents.find(student => student.id === issueData.studentId)
    };
  },

  return: async (issuedBookId: string): Promise<IssuedBook> => {
    await delay();
    
    const issued = mockIssuedBooks.find(i => i.id === issuedBookId);
    if (!issued) throw new Error('Issued book not found');

    // Update issued book status
    issued.status = 'returned';
    issued.actualReturnDate = new Date().toISOString().split('T')[0];

    // Update book availability
    const book = mockBooks.find(b => b.id === issued.bookId);
    if (book) {
      book.availableCopies += 1;
    }

    return {
      ...issued,
      book,
      student: mockStudents.find(student => student.id === issued.studentId)
    };
  }
};

// Update overdue status (would normally be done by a background job)
export const updateOverdueStatus = () => {
  const today = new Date().toISOString().split('T')[0];
  mockIssuedBooks.forEach(issued => {
    if (issued.status === 'issued' && issued.returnDate < today) {
      issued.status = 'overdue';
    }
  });
};

// Call this on app initialization
updateOverdueStatus();