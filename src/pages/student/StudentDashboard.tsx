import { useState } from 'react';
import { StudentNavbar } from '@/components/student/StudentNavbar';
import { AvailableBooks } from '@/components/student/AvailableBooks';
import { MyBooks } from '@/components/student/MyBooks';

type StudentView = 'available' | 'my-books';

const StudentDashboard = () => {
  const [currentView, setCurrentView] = useState<StudentView>('available');

  const renderContent = () => {
    switch (currentView) {
      case 'available':
        return <AvailableBooks />;
      case 'my-books':
        return <MyBooks />;
      default:
        return <AvailableBooks />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <StudentNavbar currentView={currentView} onViewChange={setCurrentView} />
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default StudentDashboard;