import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Book, BookFormData } from '@/types/library';
import { booksApi } from '@/services/libraryApi';
import { useToast } from '@/hooks/use-toast';

interface BookFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  book?: Book | null;
}

export const BookFormModal: React.FC<BookFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  book
}) => {
  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    author: '',
    isbn: '',
    category: '',
    totalCopies: 1
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        category: book.category,
        totalCopies: book.totalCopies
      });
    } else {
      setFormData({
        title: '',
        author: '',
        isbn: '',
        category: '',
        totalCopies: 1
      });
    }
  }, [book, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (book) {
        await booksApi.update(book.id, formData);
        toast({
          title: "Success",
          description: "Book updated successfully",
        });
      } else {
        await booksApi.create(formData);
        toast({
          title: "Success",
          description: "Book added successfully",
        });
      }
      onSave();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${book ? 'update' : 'add'} book`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof BookFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{book ? 'Edit Book' : 'Add New Book'}</DialogTitle>
          <DialogDescription>
            {book ? 'Update book information' : 'Enter the details for the new book'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter book title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">Author *</Label>
            <Input
              id="author"
              type="text"
              value={formData.author}
              onChange={(e) => handleChange('author', e.target.value)}
              placeholder="Enter author name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="isbn">ISBN *</Label>
            <Input
              id="isbn"
              type="text"
              value={formData.isbn}
              onChange={(e) => handleChange('isbn', e.target.value)}
              placeholder="978-XXXXXXXXXX"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Input
              id="category"
              type="text"
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              placeholder="e.g., Computer Science, Physics"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalCopies">Total Copies *</Label>
            <Input
              id="totalCopies"
              type="number"
              min="1"
              value={formData.totalCopies}
              onChange={(e) => handleChange('totalCopies', parseInt(e.target.value) || 1)}
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="admin"
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : (book ? 'Update' : 'Add')} Book
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};