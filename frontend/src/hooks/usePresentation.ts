import { useState } from 'react';
import type { DesignSettings } from '../types';
import { DEFAULT_DESIGN_SETTINGS } from '../types';
import { DEFAULT_JSON } from '../constants/presets';

interface UsePresentationReturn {
  jsonInput: string;
  setJsonInput: (value: string) => void;
  settings: DesignSettings;
  setSettings: (settings: DesignSettings) => void;
  isLoading: boolean;
  resultUrl: string | null;
  errorMsg: string | null;
  handleGenerate: () => void;
}

/**
 * プレゼンテーション生成に関するロジックをまとめたカスタムフック
 */
export function usePresentation(): UsePresentationReturn {
  const [jsonInput, setJsonInput] = useState(DEFAULT_JSON);
  const [settings, setSettings] = useState<DesignSettings>(DEFAULT_DESIGN_SETTINGS);
  const [isLoading, setIsLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGenerate = () => {
    setIsLoading(true);
    setErrorMsg(null);
    setResultUrl(null);

    try {
      // JSONのバリデーション
      JSON.parse(jsonInput);

      if (window.google && window.google.script) {
        // GAS環境での実行
        window.google.script.run
          .withSuccessHandler((url: string) => {
            setResultUrl(url);
            setIsLoading(false);
            window.open(url, '_blank');
          })
          .withFailureHandler((error: Error) => {
            setErrorMsg('エラーが発生しました: ' + error.message);
            setIsLoading(false);
          })
          .createPresentationFromFrontend(jsonInput, JSON.stringify(settings));
      } else {
        // ローカル開発用モック
        console.log('Generating slides with:', { json: JSON.parse(jsonInput), settings });
        setTimeout(() => {
          const url = 'https://docs.google.com/presentation/d/mock-presentation-id/edit';
          setResultUrl(url);
          setIsLoading(false);
          window.open(url, '_blank');
        }, 1500);
      }
    } catch {
      setErrorMsg('JSONの形式が正しくありません。確認してください。');
      setIsLoading(false);
    }
  };

  return {
    jsonInput,
    setJsonInput,
    settings,
    setSettings,
    isLoading,
    resultUrl,
    errorMsg,
    handleGenerate,
  };
}
