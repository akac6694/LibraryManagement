import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Library, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';
import { IssuedBook } from '@/types/library';
import { issuedBooksApi } from '@/services/libraryApi';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const MyBooks = () => {
  const [issuedBooks, setIssuedBooks] = useState<IssuedBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadMyBooks();
  }, []);

  const loadMyBooks = async () => {
    try {
      if (!user?.id) return;
      
      const data = await issuedBooksApi.getByStudentId(user.id);
      setIssuedBooks(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load your books",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (issuedBook: IssuedBook) => {
    const today = new Date().toISOString().split('T')[0];
    
    switch (issuedBook.status) {
      case 'returned':
        return <Badge className="bg-success text-success-foreground">Returned</Badge>;
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>;
      case 'issued':
        if (issuedBook.returnDate < today) {
          return <Badge variant="destructive">Overdue</Badge>;
        } else {
          const daysLeft = Math.ceil((new Date(issuedBook.returnDate).getTime() - new Date(today).getTime()) / (1000 * 60 * 60 * 24));
          if (daysLeft <= 2) {
            return <Badge className="bg-warning text-warning-foreground">Due Soon</Badge>;
          }
          return <Badge className="bg-success text-success-foreground">Active</Badge>;
        }
      default:
        return <Badge variant="outline">{issuedBook.status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getDaysUntilDue = (returnDate: string) => {
    const today = new Date();
    const dueDate = new Date(returnDate);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const currentlyBorrowed = issuedBooks.filter(book => book.status === 'issued');
  const overdueBooks = currentlyBorrowed.filter(book => {
    const today = new Date().toISOString().split('T')[0];
    return book.returnDate < today;
  });
  const returnedBooks = issuedBooks.filter(book => book.status === 'returned');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading your books...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Books</h1>
        <p className="text-muted-foreground">
          Track your borrowed books and return history
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Currently Borrowed</CardTitle>
            <Library className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentlyBorrowed.length}</div>
            <p className="text-xs text-muted-foreground">
              out of 3 allowed books
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Books</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{overdueBooks.length}</div>
            <p className="text-xs text-muted-foreground">
              requires immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Books Returned</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{returnedBooks.length}</div>
            <p className="text-xs text-muted-foreground">
              total books returned
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Currently Borrowed Books */}
      {currentlyBorrowed.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Library className="w-5 h-5" />
              Currently Borrowed Books
            </CardTitle>
            <CardDescription>
              Books you need to return
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Days Left</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentlyBorrowed.map((issued) => {
                  const daysLeft = getDaysUntilDue(issued.returnDate);
                  return (
                    <TableRow 
                      key={issued.id}
                      className={daysLeft < 0 ? 'bg-destructive-muted' : daysLeft <= 2 ? 'bg-warning-muted' : ''}
                    >
                      <TableCell>
                        <div>
                          <div className="font-medium">{issued.book?.title}</div>
                          <div className="text-sm text-muted-foreground">
                            by {issued.book?.author}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(issued.issueDate)}</TableCell>
                      <TableCell>{formatDate(issued.returnDate)}</TableCell>
                      <TableCell>
                        {daysLeft < 0 ? (
                          <span className="text-destructive font-semibold">
                            {Math.abs(daysLeft)} days overdue
                          </span>
                        ) : daysLeft === 0 ? (
                          <span className="text-warning font-semibold">Due today</span>
                        ) : (
                          <span className={daysLeft <= 2 ? 'text-warning font-semibold' : ''}>
                            {daysLeft} days left
                          </span>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(issued)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* All Books History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Complete History
          </CardTitle>
          <CardDescription>
            All your book borrowing history
          </CardDescription>
        </CardHeader>
        <CardContent>
          {issuedBooks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Library className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>You haven't borrowed any books yet</p>
              <p className="text-sm">Browse available books to get started!</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Return Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {issuedBooks.map((issued) => (
                  <TableRow key={issued.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{issued.book?.title}</div>
                        <div className="text-sm text-muted-foreground">
                          by {issued.book?.author}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(issued.issueDate)}</TableCell>
                    <TableCell>{formatDate(issued.returnDate)}</TableCell>
                    <TableCell>
                      {issued.actualReturnDate ? formatDate(issued.actualReturnDate) : '-'}
                    </TableCell>
                    <TableCell>{getStatusBadge(issued)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};