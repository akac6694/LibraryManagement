import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { History, Search, Filter } from 'lucide-react';
import { IssuedBook } from '@/types/library';
import { issuedBooksApi } from '@/services/libraryApi';
import { useToast } from '@/hooks/use-toast';

export const IssuedBooksHistory = () => {
  const [allIssuedBooks, setAllIssuedBooks] = useState<IssuedBook[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<IssuedBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    loadIssuedBooks();
  }, []);

  useEffect(() => {
    filterBooks();
  }, [allIssuedBooks, searchTerm, statusFilter]);

  const loadIssuedBooks = async () => {
    try {
      const data = await issuedBooksApi.getAll();
      setAllIssuedBooks(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load issued books history",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterBooks = () => {
    let filtered = allIssuedBooks;

    // Filter by search term (book title or student name)
    if (searchTerm) {
      filtered = filtered.filter(issued =>
        issued.book?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issued.student?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(issued => issued.status === statusFilter);
    }

    setFilteredBooks(filtered);
  };

  const getStatusBadge = (issuedBook: IssuedBook) => {
    switch (issuedBook.status) {
      case 'returned':
        return <Badge className="bg-success text-success-foreground">Returned</Badge>;
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>;
      case 'issued':
        return <Badge className="bg-warning text-warning-foreground">Issued</Badge>;
      default:
        return <Badge variant="outline">{issuedBook.status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getDaysOverdue = (returnDate: string, actualReturnDate?: string) => {
    const dueDate = new Date(returnDate);
    const returnedDate = actualReturnDate ? new Date(actualReturnDate) : new Date();
    const diffTime = returnedDate.getTime() - dueDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Issued Books History</h1>
        <p className="text-muted-foreground">Complete record of all book transactions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Transaction History ({filteredBooks.length} records)
          </CardTitle>
          <CardDescription>
            Track all book issues, returns, and overdue items
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by book title or student name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="issued">Currently Issued</SelectItem>
                <SelectItem value="returned">Returned</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-muted rounded-lg text-center">
              <div className="text-2xl font-bold">
                {allIssuedBooks.filter(b => b.status === 'issued').length}
              </div>
              <div className="text-sm text-muted-foreground">Currently Issued</div>
            </div>
            <div className="p-4 bg-success-muted rounded-lg text-center">
              <div className="text-2xl font-bold">
                {allIssuedBooks.filter(b => b.status === 'returned').length}
              </div>
              <div className="text-sm text-muted-foreground">Returned</div>
            </div>
            <div className="p-4 bg-destructive-muted rounded-lg text-center">
              <div className="text-2xl font-bold">
                {allIssuedBooks.filter(b => b.status === 'overdue').length}
              </div>
              <div className="text-sm text-muted-foreground">Overdue</div>
            </div>
            <div className="p-4 bg-accent-muted rounded-lg text-center">
              <div className="text-2xl font-bold">{allIssuedBooks.length}</div>
              <div className="text-sm text-muted-foreground">Total Transactions</div>
            </div>
          </div>

          {/* History Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Book</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Return Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Days Overdue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBooks.map((issued) => (
                <TableRow key={issued.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{issued.student?.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {issued.student?.registrationNumber}
                      </div>
                    </div>
                  </TableCell>
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
                  <TableCell>
                    {issued.status === 'overdue' || 
                     (issued.status === 'returned' && getDaysOverdue(issued.returnDate, issued.actualReturnDate) > 0) ? (
                      <Badge variant="destructive" className="text-xs">
                        {getDaysOverdue(issued.returnDate, issued.actualReturnDate)} days
                      </Badge>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredBooks.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <History className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No records found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};