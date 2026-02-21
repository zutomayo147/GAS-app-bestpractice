import './index.css';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SlideEditor } from './components/SlideEditor';
import { DesignSettingsPanel } from './components/DesignSettings';
import { usePresentation } from './hooks/usePresentation';
import { ReadmeViewer } from './components/ReadmeViewer';
import { triggerComingSoon } from './utils/toast';
import { useEffect, useState } from 'react';

function App() {
  const [showGlobalToast, setShowGlobalToast] = useState(false);
  const [toastPos, setToastPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleShowToast = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.x !== undefined) {
        setToastPos({ x: customEvent.detail.x, y: customEvent.detail.y });
      } else {
        setToastPos({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
      }
      setShowGlobalToast(true);
      setTimeout(() => setShowGlobalToast(false), 3000);
    };
    window.addEventListener('show-coming-soon', handleShowToast);
    return () => window.removeEventListener('show-coming-soon', handleShowToast);
  }, []);
  const {
    jsonInput,
    setJsonInput,
    settings,
    setSettings,
    isLoading,
    resultUrl,
    errorMsg,
    handleGenerate,
  } = usePresentation();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-gray-900">
      <Header />
      
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          {/* Left Column: Slide Data Input */}
          <div className="flex flex-col h-[500px] lg:h-[calc(100vh-140px)] lg:min-h-[550px]">
             <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-200 text-gray-600 text-xs font-black">01</span>
                  <h2 className="text-lg font-bold text-gray-800">スライドデータ入力</h2>
                </div>
                <div 
                  className="text-xs font-bold text-orange-500 flex items-center gap-1 cursor-not-allowed opacity-70 grayscale"
                  onClick={triggerComingSoon}
                  title="アップデート予定"
                >
                  <span>② JSONフォーマットを確認</span>
                </div>
             </div>
             <SlideEditor 
               jsonInput={jsonInput} 
               setJsonInput={setJsonInput} 
               isLoading={isLoading} 
             />
          </div>

          {/* Right Column: Design Settings */}
          <div className="flex flex-col h-full lg:h-[calc(100vh-140px)] lg:min-h-[550px] overflow-y-auto lg:overflow-visible pb-2">
             <div className="flex items-center gap-3 mb-4 px-2">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-200 text-gray-600 text-xs font-black">02</span>
                <h2 className="text-lg font-bold text-gray-800">デザインカスタマイズ</h2>
             </div>
             <DesignSettingsPanel 
               settings={settings}
               setSettings={setSettings}
               onGenerate={handleGenerate}
               isLoading={isLoading}
               resultUrl={resultUrl}
               errorMsg={errorMsg}
             />
          </div>

        </div>

        {/* Readme Content */}
        <ReadmeViewer />
      </main>

      <Footer />

      {/* Global Coming Soon Toast Popup */}
      <div 
        className={`fixed bg-gray-800 text-white px-6 py-4 rounded-xl shadow-lg shadow-gray-800/20 flex items-center gap-3 transition-opacity duration-300 pointer-events-none z-50 ${
          showGlobalToast ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          left: toastPos.x + 15,
          top: toastPos.y + 15,
        }}
      >
        <span className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-white/20 text-xs font-bold">i</span>
        <span className="font-medium text-sm">この機能はアップデートで実装予定です</span>
      </div>
    </div>
  );
}

export default App;
