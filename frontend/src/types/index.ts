export interface DesignSettings {
  presetName: string;
  themeColor: string;
  fontFamily: string;
  footerText: string;
  outputFolderUrl: string;
}

export const DEFAULT_DESIGN_SETTINGS: DesignSettings = {
  presetName: 'Default',
  themeColor: '#bebebe',
  fontFamily: 'Noto Sans JP',
  footerText: '',
  outputFolderUrl: '',
};

export interface SlideData {
  type: string;
  [key: string]: any;
}
