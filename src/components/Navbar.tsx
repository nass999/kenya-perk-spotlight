
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <header className="fixed w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center">
          <a href="/" className="flex items-center gap-2">
            <span className="font-bold text-2xl text-gradient">Africarewards<span className="text-kneutral-500">network</span></span>
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-kneutral-700 hover:text-kneutral-500 font-medium transition-colors">Features</a>
          <a href="#partners" className="text-kneutral-700 hover:text-kneutral-500 font-medium transition-colors">Partners</a>
          <a href="#testimonials" className="text-kneutral-700 hover:text-kneutral-500 font-medium transition-colors">Testimonials</a>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Button variant="outline" className="border-kneutral-500 text-kneutral-500 hover:bg-kneutral-50">
            Log In
          </Button>
          <Button className="bg-kneutral-500 hover:bg-kneutral-600">
            Contact Sales
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-700" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full">
          <nav className="flex flex-col p-4 gap-4">
            <a 
              href="#features" 
              className="text-kneutral-700 hover:text-kneutral-500 font-medium py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </a>
            <a 
              href="#partners" 
              className="text-kneutral-700 hover:text-kneutral-500 font-medium py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Partners
            </a>
            <a 
              href="#testimonials" 
              className="text-kneutral-700 hover:text-kneutral-500 font-medium py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Testimonials
            </a>
            <div className="flex flex-col gap-2 pt-2">
              <Button variant="outline" className="border-kneutral-500 text-kneutral-500 w-full">
                Log In
              </Button>
              <Button className="bg-kneutral-500 hover:bg-kneutral-600 w-full">
                Contact Sales
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
