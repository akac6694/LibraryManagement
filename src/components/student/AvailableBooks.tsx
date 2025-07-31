import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Search, Filter, Plus } from 'lucide-react';
import { Book } from '@/types/library';
import { booksApi, issuedBooksApi } from '@/services/libraryApi';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const AvailableBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [studentBorrowedCount, setStudentBorrowedCount] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterBooks();
  }, [books, searchTerm, categoryFilter]);

  const loadData = async () => {
    try {
      const [booksData, issuedData] = await Promise.all([
        booksApi.getAll(),
        issuedBooksApi.getByStudentId(user?.id || '')
      ]);
      
      setBooks(booksData);
      
      // Count currently borrowed books
      const currentlyBorrowed = issuedData.filter(issued => issued.status === 'issued').length;
      setStudentBorrowedCount(currentlyBorrowed);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load books",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterBooks = () => {
    let filtered = books;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(book => book.category === categoryFilter);
    }

    setFilteredBooks(filtered);
  };

  const handleRequestBook = async (bookId: string) => {
    if (studentBorrowedCount >= 3) {
      toast({
        title: "Limit Reached",
        description: "You cannot borrow more than 3 books at a time",
        variant: "destructive",
      });
      return;
    }

    try {
      const returnDate = new Date();
      returnDate.setDate(returnDate.getDate() + 7);

      await issuedBooksApi.issue({
        bookId,
        studentId: user?.id || '',
        returnDate: returnDate.toISOString().split('T')[0]
      });

      toast({
        title: "Success",
        description: "Book request submitted successfully!",
      });

      await loadData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to request book",
        variant: "destructive",
      });
    }
  };

  const getAvailabilityBadge = (book: Book) => {
    if (book.availableCopies === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    } else if (book.availableCopies <= 2) {
      return <Badge className="bg-warning text-warning-foreground">Low Stock</Badge>;
    } else {
      return <Badge className="bg-success text-success-foreground">Available</Badge>;
    }
  };

  const categories = [...new Set(books.map(book => book.category))];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading books...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Available Books</h1>
        <p className="text-muted-foreground">
          Browse and request books from our collection • 
          <span className="ml-2 font-medium">
            You have borrowed {studentBorrowedCount}/3 books
          </span>
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by title or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book) => (
          <Card key={book.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg leading-tight">{book.title}</CardTitle>
                  <CardDescription className="mt-2">by {book.author}</CardDescription>
                </div>
                <div className="ml-4">
                  {getAvailabilityBadge(book)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Category:</span>
                  <Badge variant="outline">{book.category}</Badge>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">ISBN:</span>
                  <span className="font-mono text-xs">{book.isbn}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Available:</span>
                  <span className="font-semibold">
                    {book.availableCopies} of {book.totalCopies}
                  </span>
                </div>

                <Button
                  variant="student"
                  className="w-full mt-4"
                  disabled={book.availableCopies === 0 || studentBorrowedCount >= 3}
                  onClick={() => handleRequestBook(book.id)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {book.availableCopies === 0 
                    ? 'Out of Stock' 
                    : studentBorrowedCount >= 3 
                    ? 'Limit Reached'
                    : 'Request Book'
                  }
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No books found matching your search criteria</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};