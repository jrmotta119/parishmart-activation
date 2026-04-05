interface BadgeProps {
  children: React.ReactNode;
  variant?: 'accent' | 'muted' | 'success' | 'danger';
  className?: string;
}

const variantStyles: Record<string, string> = {
  accent: 'bg-[var(--parish-accent)] text-white',
  muted: 'bg-gray-100 text-gray-600',
  success: 'bg-emerald-100 text-emerald-700',
  danger: 'bg-red-100 text-red-600',
};

export function Badge({ children, variant = 'accent', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
