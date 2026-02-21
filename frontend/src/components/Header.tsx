import { Moon, User } from 'lucide-react';
import { triggerComingSoon } from '../utils/toast';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200">
            <span className="text-white text-2xl font-bold">✨</span>
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
            スライドジェネレーター Created by Yamashita
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <button 
            type="button"
            onClick={triggerComingSoon}
            className="p-2 text-gray-400 rounded-full transition-colors cursor-not-allowed opacity-70 hover:bg-gray-100"
            title="ダークモード (アップデート予定)"
          >
            <Moon size={20} />
          </button>
          
          <button 
            type="button"
            onClick={triggerComingSoon}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-400 bg-gray-50 transition-colors shadow-sm cursor-not-allowed opacity-70"
            title="マイページ (アップデート予定)"
          >
            <User size={18} />
            <span>マイページ</span>
          </button>
        </div>
      </div>
    </header>
  );
}
