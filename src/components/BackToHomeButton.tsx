
import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BackToHomeButtonProps {
  className?: string;
}

const BackToHomeButton: React.FC<BackToHomeButtonProps> = ({ className = '' }) => {
  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <Link to="/">
        <Button className="bg-[#da7756] hover:bg-[#bd5d3a] rounded-full shadow-lg" size="icon">
          <Home className="h-5 w-5" />
          <span className="sr-only">Back to Home</span>
        </Button>
      </Link>
    </div>
  );
};

export default BackToHomeButton;
