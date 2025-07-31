import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BookOpen, UserCheck, RotateCcw, CheckCircle } from 'lucide-react';
import { Book, Student, IssuedBook, IssueBookFormData } from '@/types/library';
import { booksApi, studentsApi, issuedBooksApi } from '@/services/libraryApi';
import { useToast } from '@/hooks/use-toast';

export const IssueReturnPanel = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [issuedBooks, setIssuedBooks] = useState<IssuedBook[]>([]);
  const [issueForm, setIssueForm] = useState<IssueBookFormData>({
    bookId: '',
    studentId: '',
    returnDate: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isIssuing, setIsIssuing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
    
    // Set default return date (7 days from today)
    const returnDate = new Date();
    returnDate.setDate(returnDate.getDate() + 7);
    setIssueForm(prev => ({
      ...prev,
      returnDate: returnDate.toISOString().split('T')[0]
    }));
  }, []);

  const loadData = async () => {
    try {
      const [booksData, studentsData, issuedData] = await Promise.all([
        booksApi.getAll(),
        studentsApi.getAll(),
        issuedBooksApi.getAll()
      ]);
      
      setBooks(booksData);
      setStudents(studentsData);
      setIssuedBooks(issuedData.filter(issued => issued.status === 'issued'));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleIssueBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueForm.bookId || !issueForm.studentId) {
      toast({
        title: "Error",
        description: "Please select both book and student",
        variant: "destructive",
      });
      return;
    }

    setIsIssuing(true);
    try {
      await issuedBooksApi.issue(issueForm);
      toast({
        title: "Success",
        description: "Book issued successfully",
      });
      
      // Reset form
      setIssueForm({
        bookId: '',
        studentId: '',
        returnDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
      
      await loadData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to issue book",
        variant: "destructive",
      });
    } finally {
      setIsIssuing(false);
    }
  };

  const handleReturnBook = async (issuedBookId: string) => {
    try {
      await issuedBooksApi.return(issuedBookId);
      toast({
        title: "Success",
        description: "Book returned successfully",
      });
      await loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to return book",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (issuedBook: IssuedBook) => {
    const today = new Date().toISOString().split('T')[0];
    if (issuedBook.returnDate < today) {
      return <Badge variant="destructive">Overdue</Badge>;
    }
    return <Badge className="bg-warning text-warning-foreground">Issued</Badge>;
  };

  const availableBooks = books.filter(book => book.availableCopies > 0);

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Issue & Return Panel</h1>
        <p className="text-muted-foreground">Manage book circulation and returns</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Issue Book Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Issue Book
            </CardTitle>
            <CardDescription>
              Issue a book to a student
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleIssueBook} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Student</label>
                <Select
                  value={issueForm.studentId}
                  onValueChange={(value) => setIssueForm(prev => ({ ...prev, studentId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a student" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name} ({student.registrationNumber})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Select Book</label>
                <Select
                  value={issueForm.bookId}
                  onValueChange={(value) => setIssueForm(prev => ({ ...prev, bookId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a book" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableBooks.map((book) => (
                      <SelectItem key={book.id} value={book.id}>
                        {book.title} - {book.author} ({book.availableCopies} available)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Return Date</label>
                <input
                  type="date"
                  value={issueForm.returnDate}
                  onChange={(e) => setIssueForm(prev => ({ ...prev, returnDate: e.target.value }))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                />
              </div>

              <Button 
                type="submit" 
                variant="admin" 
                className="w-full" 
                disabled={isIssuing}
              >
                {isIssuing ? 'Issuing...' : 'Issue Book'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Current Issued Books */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RotateCcw className="w-5 h-5" />
              Currently Issued Books
            </CardTitle>
            <CardDescription>
              Books awaiting return ({issuedBooks.length} items)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {issuedBooks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No books currently issued</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {issuedBooks.map((issued) => (
                  <div key={issued.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{issued.book?.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {issued.student?.name} • Due: {issued.returnDate}
                      </p>
                      {getStatusBadge(issued)}
                    </div>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleReturnBook(issued.id)}
                    >
                      Return
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};