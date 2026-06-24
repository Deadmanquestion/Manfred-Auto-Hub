type Status =
  | "pending"
  | "interview"
  | "approved"
  | "rejected"
  | "cancelled"
  | "completed"
  | "paid"
  | "unpaid"
  | "refunded"
  | "active"
  | "inactive";

interface StatusBadgeProps {
  status: Status;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return <span className={`status-badge status-badge--${status}`}>{status}</span>;
}
