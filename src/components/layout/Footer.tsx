// components/layout/Footer.tsx
import React from 'react';
import { Keyboard, Github, Twitter, UserRoundCheckIcon } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t bg-white/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <UserRoundCheckIcon className="h-6 w-6 text-violet-600" />
              <span className="text-xl font-bold text-violet-600">Job Board</span>
            </div>
            <p className="text-sm text-gray-600">
              Get the latest job listings and find your dream job with us. We provide a platform for employers and job seekers to connect seamlessly.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="/profile" className="hover:text-violet-600 transition-colors">
                  Profile
                </a>
              </li>
              <li>
                <a href="/help" className="hover:text-violet-600 transition-colors">
                  Help & Support
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Connect With Us</h3>
            <div className="flex space-x-4">
              <a title='Visit Github Profile'
                href="https://github.com/ajs1109" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-violet-600 transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a title='Visit Twitter Profile'
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-violet-600 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} Job Board. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;