
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Book, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar: React.FC = () => {
  return (
    <nav className="flex justify-between items-center py-4 px-6 bg-secondary sticky top-0 z-50 shadow-md">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" className="mr-2 lg:hidden">
          <Menu className="h-6 w-6" />
        </Button>
        <Link to="/" className="flex items-center gap-2">
          <Book className="h-6 w-6 text-emerald-500" />
          <h1 className="text-xl font-bold hidden sm:block">
            <span className="text-emerald-500">القرآن</span> الكريم
          </h1>
        </Link>
      </div>
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Search className="h-5 w-5" />
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
