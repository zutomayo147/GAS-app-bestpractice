import { Copy } from 'lucide-react';

interface SlideEditorProps {
  jsonInput: string;
  setJsonInput: (value: string) => void;
  isLoading: boolean;
}

export function SlideEditor({ jsonInput, setJsonInput, isLoading }: SlideEditorProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(jsonInput);
  };

  return (
    <div className="flex-grow flex flex-col bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-700/50">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-800/80 border-b border-gray-700/50">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="ml-4 text-xs font-medium text-gray-400 tracking-widest uppercase">input.json</span>
        </div>
        <button 
          onClick={handleCopy}
          className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-all"
          title="コピー"
        >
          <Copy size={14} />
        </button>
      </div>
      
      {/* Editor Content */}
      <div className="relative flex-grow flex flex-col p-2">
        {isLoading && (
          <div className="absolute inset-0 z-10 bg-gray-900/40 backdrop-blur-[1px] flex items-center justify-center">
            <div className="flex items-center gap-2 text-gray-400 animate-pulse">
              <div className="w-2 h-2 rounded-full bg-orange-500" />
              <span className="text-sm font-mono italic">Wait for processing...</span>
            </div>
          </div>
        )}
        
        <textarea
          className="w-full flex-grow p-4 bg-transparent text-green-400 font-mono text-sm leading-relaxed focus:outline-none resize-none scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
          placeholder="ここにJSONを入力してください..."
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          spellCheck={false}
        />
      </div>
    </div>
  );
}
