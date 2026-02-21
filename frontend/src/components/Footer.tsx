export function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 bg-gray-50/50 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-500">
            © 2026 AI Presentation Tool. Built with precision. • Created by Katsunori Yamashita
          </div>
          
          <div className="flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#" className="hover:text-primary transition-colors">プライバシーポリシー</a>
            <a href="#" className="hover:text-primary transition-colors">利用規約</a>
            <a href="#" className="hover:text-primary transition-colors">お問い合わせ</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
