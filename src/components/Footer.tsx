
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-kneutral-800 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4">
              <a href="/" className="font-bold text-2xl">
                Africa<span className="text-black">rewards</span><span className="text-kneutral-400">network</span>
              </a>
            </div>
            <p className="text-kneutral-300 mb-6">
              Africa's leading employee discount platform, helping businesses attract and retain top talent.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-kneutral-300 hover:text-kneutral-400 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-kneutral-300 hover:text-kneutral-400 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-kneutral-300 hover:text-kneutral-400 transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-kneutral-300 hover:text-kneutral-400 transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Solutions</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-kneutral-300 hover:text-kneutral-400 transition-colors">For Employers</a></li>
              <li><a href="#" className="text-kneutral-300 hover:text-kneutral-400 transition-colors">For Partners</a></li>
              <li><a href="#" className="text-kneutral-300 hover:text-kneutral-400 transition-colors">SME Solutions</a></li>
              <li><a href="#" className="text-kneutral-300 hover:text-kneutral-400 transition-colors">Enterprise Solutions</a></li>
              <li><a href="#" className="text-kneutral-300 hover:text-kneutral-400 transition-colors">Case Studies</a></li>
              <li><a href="#" className="text-kneutral-300 hover:text-kneutral-400 transition-colors">API <span className="bg-kneutral-700 text-kneutral-300 text-xs px-2 py-1 rounded ml-2">Coming Soon</span></a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-kneutral-300 hover:text-kneutral-400 transition-colors">About Us</a></li>
              <li><a href="#" className="text-kneutral-300 hover:text-kneutral-400 transition-colors">Careers</a></li>
              <li><Link to="/pricing" className="text-kneutral-300 hover:text-kneutral-400 transition-colors">Pricing</Link></li>
              <li><a href="#" className="text-kneutral-300 hover:text-kneutral-400 transition-colors">Blog</a></li>
              <li><a href="#" className="text-kneutral-300 hover:text-kneutral-400 transition-colors">Press</a></li>
              <li><a href="#" className="text-kneutral-300 hover:text-kneutral-400 transition-colors">Partners</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <MapPin size={18} className="text-kneutral-400 shrink-0 mt-1" />
                <span className="text-kneutral-300">Westlands Business Park, Nairobi, Kenya</span>
              </li>
              <li className="flex gap-3">
                <Phone size={18} className="text-kneutral-400 shrink-0 mt-1" />
                <span className="text-kneutral-300">+254 700 123 456</span>
              </li>
              <li className="flex gap-3">
                <Mail size={18} className="text-kneutral-400 shrink-0 mt-1" />
                <span className="text-kneutral-300">info@africarewardsnetwork.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-kneutral-700 mt-12 pt-8 text-kneutral-400 text-sm">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              &copy; 2025 Africarewardsnetwork. All rights reserved.
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-kneutral-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-kneutral-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-kneutral-400 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
