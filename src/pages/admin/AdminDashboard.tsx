import { useState } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { BooksManagement } from '@/components/admin/BooksManagement';
import { IssueReturnPanel } from '@/components/admin/IssueReturnPanel';
import { IssuedBooksHistory } from '@/components/admin/IssuedBooksHistory';
import { SidebarProvider } from '@/components/ui/sidebar';

type AdminView = 'books' | 'issue-return' | 'history';

const AdminDashboard = () => {
  const [currentView, setCurrentView] = useState<AdminView>('books');

  const renderContent = () => {
    switch (currentView) {
      case 'books':
        return <BooksManagement />;
      case 'issue-return':
        return <IssueReturnPanel />;
      case 'history':
        return <IssuedBooksHistory />;
      default:
        return <BooksManagement />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar currentView={currentView} onViewChange={setCurrentView} />
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;