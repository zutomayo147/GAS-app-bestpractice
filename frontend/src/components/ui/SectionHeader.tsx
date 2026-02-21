interface SectionHeaderProps {
  number: number;
  title: string;
}

export function SectionHeader({ number, title }: SectionHeaderProps) {
  return (
    <div className="bg-orange-500 text-white px-4 py-3 rounded-t-lg font-bold text-lg flex items-center">
      <span className="mr-2">{number}.</span>
      <span>{title}</span>
    </div>
  );
}
