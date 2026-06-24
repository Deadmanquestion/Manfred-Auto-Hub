import { AdminButton } from "./AdminButton";

interface TopbarProps {
  title: string;
  subtitle: string;
  adminEmail?: string;
  onRefresh: () => void;
  onSignOut: () => void;
}

export function Topbar({ title, subtitle, adminEmail, onRefresh, onSignOut }: TopbarProps) {
  return (
    <header className="topbar">
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      <div className="topbar__actions">
        {adminEmail ? <span>{adminEmail}</span> : null}
        <AdminButton variant="secondary" onClick={onRefresh}>
          Refresh
        </AdminButton>
        <AdminButton variant="ghost" onClick={onSignOut}>
          Sign out
        </AdminButton>
      </div>
    </header>
  );
}

