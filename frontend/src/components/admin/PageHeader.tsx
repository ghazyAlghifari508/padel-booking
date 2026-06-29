export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <span className="text-[13px] uppercase tracking-[0.16em] text-muted">
          Admin court ops
        </span>
        <h1 className="mt-3 text-[38px] font-normal leading-tight tracking-[-0.03em] text-foreground">{title}</h1>
        {subtitle && <p className="mt-2 text-sm text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
