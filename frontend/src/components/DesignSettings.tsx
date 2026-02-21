import { Palette, Type, Folder, Wand2, Image as ImageIcon, Layout, Save, Trash2, ExternalLink, Zap } from 'lucide-react';
import type { DesignSettings } from '../types';
import { Accordion } from './ui/Accordion';
import { PRESETS } from '../constants/presets';
import { triggerComingSoon } from '../utils/toast';


interface DesignSettingsProps {
  settings: DesignSettings;
  setSettings: (settings: DesignSettings) => void;
  onGenerate: () => void;
  isLoading: boolean;
  resultUrl: string | null;
  errorMsg: string | null;
}



export function DesignSettingsPanel({
  settings,
  setSettings,
  onGenerate,
  isLoading,
  resultUrl,
  errorMsg
}: DesignSettingsProps) {
  
  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = PRESETS.find(p => p.name === e.target.value);
    if (selected) {
      setSettings({
        ...settings,
        presetName: selected.name,
        themeColor: selected.color,
        fontFamily: selected.font
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 relative">
      
      {/* プリセット保存カード */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 shrink-0">
        <label className="block text-sm font-bold text-gray-700 mb-2">保存済みプリセット</label>
        <div className="flex gap-3">
          <div className="relative flex-grow">
            <select 
              className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-gray-50/50"
              value={settings.presetName}
              onChange={handlePresetChange}
            >
              {PRESETS.map(p => (
                <option key={p.name} value={p.name}>{p.name}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <Layout size={16} />
            </div>
          </div>
          <button 
            type="button"
            onClick={triggerComingSoon}
            className="flex items-center justify-center p-3 border border-gray-200 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-100 transition-colors shadow-sm cursor-not-allowed opacity-70" 
            title="保存 (アップデート予定)"
          >
            <Save size={20} />
          </button>
          <button 
            type="button"
            onClick={triggerComingSoon}
            className="flex items-center justify-center p-3 border border-gray-200 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-100 transition-colors shadow-sm cursor-not-allowed opacity-70" 
            title="削除 (アップデート予定)"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {/* 基本設定カード */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 shrink-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* プライマリカラー */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Palette size={16} className="text-primary" />
              <label className="text-sm font-bold text-gray-700">プライマリカラー</label>
            </div>
            <div className="flex items-center gap-2 p-1 border border-gray-200 rounded-xl bg-gray-50/50">
              <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                <input 
                  type="color" 
                  value={settings.themeColor}
                  onChange={(e) => setSettings({...settings, themeColor: e.target.value})}
                  className="absolute inset-0 w-[150%] h-[150%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
                />
              </div>
              <input 
                type="text" 
                value={settings.themeColor}
                onChange={(e) => setSettings({...settings, themeColor: e.target.value})}
                className="flex-grow bg-transparent border-none px-2 py-2 text-sm font-mono focus:ring-0 outline-none uppercase"
              />
            </div>
          </div>

          {/* フォント */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Type size={16} className="text-primary" />
              <label className="text-sm font-bold text-gray-700">フォント</label>
            </div>
            <div className="relative">
              <select 
                className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-gray-50/50"
                value={settings.fontFamily}
                onChange={(e) => setSettings({...settings, fontFamily: e.target.value})}
              >
                <option value="Noto Sans JP">Noto Sans JP</option>
                <option value="BIZ UDPGothic">BIZ UDPGothic</option>
                <option value="M PLUS Rounded 1c">M PLUS Rounded 1c</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <Layout size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* フッターテキスト */}
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-2">
            <Type size={16} className="text-primary" />
            <label className="text-sm font-bold text-gray-700">フッターテキスト</label>
          </div>
          <input 
            type="text" 
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-gray-50/50"
            value={settings.footerText}
            onChange={(e) => setSettings({...settings, footerText: e.target.value})}
            placeholder="© AI Creative Agency Inc. All Rights Reserved."
          />
        </div>

        {/* 保存先フォルダURL */}
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-2">
            <Folder size={16} className="text-primary" />
            <label className="text-sm font-bold text-gray-700">保存先フォルダURL</label>
          </div>
          <div className="flex gap-2">
            <input 
              type="text" 
              className="flex-grow border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-gray-50/50"
              value={settings.outputFolderUrl}
              onChange={(e) => setSettings({...settings, outputFolderUrl: e.target.value})}
              placeholder="https://drive.google.com/..."
            />
            <button 
              type="button"
              onClick={triggerComingSoon}
              className="flex items-center justify-center px-4 border border-gray-200 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-100 transition-colors shadow-sm cursor-not-allowed opacity-70" 
              title="フォルダを開く (アップデート予定)"
            >
              <ExternalLink size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Accordions */}
      <div className="space-y-1">
        <Accordion title="装飾設定" icon={<Wand2 size={18} />} disabled onClick={triggerComingSoon}>
          <p className="text-sm text-gray-500">（装飾設定の内容がここに入ります）</p>
        </Accordion>
        <Accordion title="ロゴ設定" icon={<ImageIcon size={18} />} disabled onClick={triggerComingSoon}>
           <p className="text-sm text-gray-500">（ロゴ設定の内容がここに入ります）</p>
        </Accordion>
        <Accordion title="背景設定" icon={<ImageIcon size={18} />} disabled onClick={triggerComingSoon}>
           <p className="text-sm text-gray-500">（背景設定の内容がここに入ります）</p>
        </Accordion>
      </div>

      {/* Generate Button Wrapper */}
      <div className="mt-2 text-center shrink-0">
        <button 
          onClick={onGenerate}
          disabled={isLoading}
          className={`group relative overflow-hidden w-full py-4 gradient-button text-white font-black text-lg rounded-2xl shadow-xl shadow-orange-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>生成中...</span>
            </div>
          ) : (
            <>
              <Zap size={20} className="fill-white" />
              <span>プレゼンテーションを生成</span>
            </>
          )}
        </button>
        <p className="mt-3 text-xs text-gray-400 font-medium">
          推定生成時間: 約 30-45 秒
        </p>
      </div>

      {/* Messages */}
      {errorMsg && (
        <div className="p-4 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100 flex items-center gap-3">
          <span className="shrink-0 w-2 h-2 rounded-full bg-red-500" />
          {errorMsg}
        </div>
      )}
      
      {resultUrl && (
        <div className="p-4 bg-green-50 text-green-700 text-sm font-bold rounded-xl border border-green-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="shrink-0 w-2 h-2 rounded-full bg-green-500" />
            生成完了しました！
          </div>
          <a href={resultUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-primary hover:underline">
            スライドを開く <ExternalLink size={14} />
          </a>
        </div>
      )}

    </div>
  );
}
