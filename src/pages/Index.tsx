import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, Shield, GraduationCap, Library } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary to-accent rounded-3xl mb-6 shadow-lg">
            <Library className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Library Management System
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            A comprehensive digital solution for managing library resources, book circulation, 
            and student services with modern, intuitive interfaces.
          </p>
        </div>

        {/* Login Options */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Admin Login Card */}
          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-primary to-primary-glow rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl">Administrator</CardTitle>
              <CardDescription className="text-base">
                Manage books, track circulation, and oversee library operations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Books & Inventory Management</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>Issue & Return Processing</span>
                </div>
                <div className="flex items-center gap-2">
                  <Library className="w-4 h-4" />
                  <span>Circulation History & Reports</span>
                </div>
              </div>
              <Link to="/admin/login" className="block">
                <Button variant="admin" size="lg" className="w-full mt-6">
                  Admin Login
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Student Login Card */}
          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-accent to-accent-muted rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-8 h-8 text-accent-foreground" />
              </div>
              <CardTitle className="text-2xl">Student</CardTitle>
              <CardDescription className="text-base">
                Browse available books and manage your personal library account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Browse Available Books</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>Request Book Borrowing</span>
                </div>
                <div className="flex items-center gap-2">
                  <Library className="w-4 h-4" />
                  <span>Track Borrowed Books</span>
                </div>
              </div>
              <Link to="/student/login" className="block">
                <Button variant="student" size="lg" className="w-full mt-6">
                  Student Login
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-muted-foreground">
          <p>Demo System - Use provided credentials to explore features</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
