
import { Linkedin, Instagram, Mail, Phone, MapPin } from "lucide-react";
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
              Africa's leading rewards and benefits platform, helping businesses strengthen engagement and retention.
            </p>
            <div className="flex gap-4">
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
              <li><Link to="/company-inquiry" className="text-kneutral-300 hover:text-kneutral-400 transition-colors">For Employers</Link></li>
              <li><Link to="/vendor-application" className="text-kneutral-300 hover:text-kneutral-400 transition-colors">For Partners</Link></li>
              <li><Link to="/pricing" className="text-kneutral-300 hover:text-kneutral-400 transition-colors">Pricing</Link></li>
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
