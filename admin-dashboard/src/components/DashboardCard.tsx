interface DashboardCardProps {
  label: string;
  value: string | number;
  helper?: string;
}

export function DashboardCard({ label, value, helper }: DashboardCardProps) {
  return (
    <section className="dashboard-card">
      <p>{label}</p>
      <strong>{value}</strong>
      {helper ? <span>{helper}</span> : null}
    </section>
  );
}

