import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { authState } = useAuth();
  const navigate = useNavigate();
  
  const handleDashboardClick = () => {
    navigate('/dashboard');
  };
  
  return (
    <header className="fixed w-full bg-[#eeece2]/90 backdrop-blur-md z-50 border-b border-[#e6e4d2]">
      <div className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center">
          <a href="/" className="flex items-center gap-2">
            <span className="font-bold text-2xl text-gradient">Africa<span className="text-black">rewards</span><span className="text-[#da7756]">network</span></span>
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-[#3d3929] hover:text-[#da7756] font-medium transition-colors">Features</a>
          <a href="#partners" className="text-[#3d3929] hover:text-[#da7756] font-medium transition-colors">Partners</a>
          <Link to="/pricing" className="text-[#3d3929] hover:text-[#da7756] font-medium transition-colors">Pricing</Link>
          <a href="#testimonials" className="text-[#3d3929] hover:text-[#da7756] font-medium transition-colors">Testimonials</a>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {authState.user ? (
            <Button className="bg-[#da7756] hover:bg-[#bd5d3a]" onClick={handleDashboardClick}>
              Dashboard
            </Button>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" className="border-[#da7756] text-[#da7756] hover:bg-[#f8ece7]">
                  Log In
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-[#da7756] hover:bg-[#bd5d3a]">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-[#3d3929]" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#eeece2] border-t border-[#e6e4d2] absolute w-full">
          <nav className="flex flex-col p-4 gap-4">
            <a 
              href="#features" 
              className="text-[#3d3929] hover:text-[#da7756] font-medium py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </a>
            <a 
              href="#partners" 
              className="text-[#3d3929] hover:text-[#da7756] font-medium py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Partners
            </a>
            <Link
              to="/pricing"
              className="text-[#3d3929] hover:text-[#da7756] font-medium py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <a 
              href="#testimonials" 
              className="text-[#3d3929] hover:text-[#da7756] font-medium py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Testimonials
            </a>
            <div className="flex flex-col gap-2 pt-2">
              {authState.user ? (
                <Button 
                  className="bg-[#da7756] hover:bg-[#bd5d3a] w-full"
                  onClick={() => {
                    navigate('/dashboard');
                    setIsMenuOpen(false);
                  }}
                >
                  Dashboard
                </Button>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="border-[#da7756] text-[#da7756] w-full">
                      Log In
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button className="bg-[#da7756] hover:bg-[#bd5d3a] w-full">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
