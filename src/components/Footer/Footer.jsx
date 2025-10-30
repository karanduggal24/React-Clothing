import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer
      style={{ paddingTop: '50px', paddingBottom: '5px' }}
      className="bg-gray-900 text-gray-300 flex justify-center items-center text-center"
    >
      <div
        style={{ marginLeft:"auto",marginRight:"auto", paddingLeft: '24px', paddingRight: '24px', paddingTop: '10px', paddingBottom: '10px' }}
        className="container mx-auto "
      >
        {/* Main footer content using flex */}
        <div
          style={{ paddingBottom: '10px', marginLeft: '10px', marginRight: '50px' }}
          className="flex flex-col md:flex-row md:justify-center md:items-start gap-12 text-center md:text-center"
        >
          {/* About Section */}
          <div className="flex-1 flex flex-col items-center md:items-center">
            <h2 className="text-xl font-bold text-white mb-4">Clothing Store</h2>
            <p className="text-sm max-w-xs">
              A brief description of your company. Focusing on your mission and vision.
            </p>
          </div>

          {/* Quick Links Section */}
          <div className="flex-1 flex flex-col items-center md:items-center">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors duration-300">Home</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Services</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Contact</a></li>
            </ul>
          </div>

          {/* Contact Info Section */}
          <div className="flex-1 flex flex-col items-center md:items-center">
            <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li>Email: karanduggal@yourbrand.com</li>
              <li>Phone: (123) 456-7890</li>
              <li>Address: 123, Amritsar, Punjab, India</li>
            </ul>
          </div>

          {/* Social Media Section */}
          <div className="flex-1 flex flex-col items-center md:items-center">
            <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
            <div className="flex space-x-4 justify-center md:justify-start">
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
        <div className="border-t border-gray-700 text-center">
          <p style={{ marginTop: '10px', paddingTop: '10px' }} className="text-sm">
            &copy; {new Date().getFullYear()} Karan. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
