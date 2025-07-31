import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { BookOpen, Library, User, LogOut } from 'lucide-react';

interface StudentNavbarProps {
  currentView: string;
  onViewChange: (view: 'available' | 'my-books') => void;
}

export const StudentNavbar: React.FC<StudentNavbarProps> = ({ currentView, onViewChange }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-accent to-accent-muted rounded-lg flex items-center justify-center">
              <Library className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Library Portal</h1>
              <p className="text-xs text-muted-foreground">Student Dashboard</p>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="flex items-center gap-2">
            <Button
              variant={currentView === 'available' ? 'student' : 'ghost'}
              onClick={() => onViewChange('available')}
              className="gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Available Books
            </Button>
            <Button
              variant={currentView === 'my-books' ? 'student' : 'ghost'}
              onClick={() => onViewChange('my-books')}
              className="gap-2"
            >
              <Library className="w-4 h-4" />
              My Books
            </Button>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-accent to-accent-muted rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-accent-foreground" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">Student</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};