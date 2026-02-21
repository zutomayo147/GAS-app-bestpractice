import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import readmeContent from '../../../README.md?raw';

export function ReadmeViewer() {
  return (
    <div className="w-full mt-12 mb-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-10">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-600 text-xs font-black">ℹ️</span>
        <h2 className="text-xl font-bold text-gray-800">使い方 (README)</h2>
      </div>
      <div className="prose prose-sm sm:prose-base prose-blue max-w-none text-gray-700 prose-headings:font-bold prose-h1:text-3xl prose-h1:border-b prose-h1:pb-3 prose-h1:mb-6 prose-h2:text-2xl prose-h2:border-b prose-h2:pb-2 prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {readmeContent}
        </ReactMarkdown>
      </div>
    </div>
  );
}
