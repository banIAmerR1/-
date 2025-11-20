import { Heart } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-red-900 py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <img src="/r1.webp" alt="R1 Movies" className="h-8 w-8 object-contain" />
            <span className="text-red-600 font-bold text-xl">R1 Movies</span>
          </div>

          <div className="text-center md:text-left">
            <p className="text-gray-400 text-sm">
              © {currentYear} R1 Movies. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs mt-1 flex items-center justify-center md:justify-start space-x-1">
              <span>Created with</span>
              <Heart size={14} className="text-red-600 fill-current" />
              <span>by Mohammad Adnan Bnai Amer</span>
            </p>
          </div>

          <div className="flex space-x-6 text-sm text-gray-400">
            <button className="hover:text-red-600 transition">About</button>
            <button className="hover:text-red-600 transition">Contact</button>
            <button className="hover:text-red-600 transition">Privacy</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
