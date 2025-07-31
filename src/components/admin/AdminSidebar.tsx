import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger } from '@/components/ui/sidebar';
import { BookOpen, RefreshCw, History, LogOut, User } from 'lucide-react';

interface AdminSidebarProps {
  currentView: string;
  onViewChange: (view: 'books' | 'issue-return' | 'history') => void;
}

const menuItems = [
  { id: 'books', label: 'Books Management', icon: BookOpen },
  { id: 'issue-return', label: 'Issue & Return', icon: RefreshCw },
  { id: 'history', label: 'History', icon: History },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ currentView, onViewChange }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <Sidebar className="w-64 border-r border-border bg-card/50">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary-glow rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold">{user?.name}</h3>
            <p className="text-sm text-muted-foreground">Administrator</p>
          </div>
        </div>
      </div>

      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onViewChange(item.id as any)}
                    className={`w-full justify-start gap-3 h-12 ${
                      currentView === item.id 
                        ? 'bg-primary text-primary-foreground hover:bg-primary-glow' 
                        : 'hover:bg-muted'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <div className="p-4 border-t border-border">
        <Button 
          variant="outline" 
          className="w-full justify-start gap-3" 
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>
    </Sidebar>
  );
};