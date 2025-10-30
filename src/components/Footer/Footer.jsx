import React from 'react';
// Importing icons from Font Awesome
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer style={{paddingTop:"50px",paddingBottom:"5px"}} className="bg-gray-900 text-gray-300">
      <div className=" container mx-auto px-6 py-10">
        {/* Main footer content grid */}
        <div style={{paddingBottom:"40px", marginLeft:"50px", marginRight:"50px"  }} className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* About Section */}
          <div className="md:col-span-1">
            <h2 className="text-xl font-bold text-white mb-4">Clothing Store</h2>
            <p className="text-sm">
              A brief description of your company. Focusing on your mission and vision.
            </p>
          </div>

          {/* Quick Links Section */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors duration-300">Home</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Services</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Contact</a></li>
            </ul>
          </div>

          {/* Contact Info Section */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li>Email: karanduggal@yourbrand.com</li>
              <li>Phone: (123) 456-7890</li>
              <li>Address: 123,Amritsar, Punjab,India</li>
            </ul>
          </div>

          {/* Social Media Section */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <FaFacebookF size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <FaLinkedinIn size={20} />
              </a>
            </div>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="mt-8 border-t border-gray-700 pt-6 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Karan. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;