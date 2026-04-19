import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ReviewSectionProps {
  title: string;
  emoji: string;
  children: React.ReactNode;
  className?: string;
}

export function ReviewSection({ title, emoji, children, className = '' }: ReviewSectionProps) {
  return (
    <Card className={`border-l-4 border-l-purple-500 ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <span className="text-lg">{emoji}</span>
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  );
}

interface ReviewListProps {
  items: string[];
  prefix: string;
  className?: string;
}

export function ReviewList({ items, prefix, className = '' }: ReviewListProps) {
  if (!items || items.length === 0) return null;

  return (
    <ol className={`space-y-2 ${className}`}>
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
          <span className="text-base shrink-0">{prefix}</span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  );
}

interface ReviewCalloutProps {
  text: string;
  emoji: string;
}

export function ReviewCallout({ text, emoji }: ReviewCalloutProps) {
  return (
    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex items-start gap-3">
      <span className="text-xl shrink-0">{emoji}</span>
      <p className="text-sm text-gray-800 italic">&ldquo;{text}&rdquo;</p>
    </div>
  );
}

interface ReviewBadgeProps {
  label: string;
  emoji: string;
  variant?: 'default' | 'success' | 'warning' | 'info';
}

export function ReviewBadge({ label, emoji, variant = 'default' }: ReviewBadgeProps) {
  const colors = {
    default: 'bg-gray-100 text-gray-800 border-gray-200',
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200',
  };

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium ${colors[variant]}`}>
      <span>{emoji}</span>
      <span>{label}</span>
    </div>
  );
}
