import type { AdminView } from "../types/views";

interface SidebarProps {
  activeView: AdminView;
  onChangeView: (view: AdminView) => void;
}

const items: Array<{ label: string; view: AdminView }> = [
  { label: "Overview", view: "overview" },
  { label: "Lift Bookings", view: "liftBookings" },
  { label: "Service Bookings", view: "serviceBookings" },
  { label: "Job Applications", view: "applications" },
  { label: "Lifts / Bays", view: "lifts" },
  { label: "Customers / Cars", view: "cars" }
];

export function Sidebar({ activeView, onChangeView }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div>
        <p className="sidebar__eyebrow">Manfred Auto Hub</p>
        <h1>Workshop Admin</h1>
      </div>
      <nav>
        {items.map((item) => (
          <button
            className={item.view === activeView ? "sidebar__item sidebar__item--active" : "sidebar__item"}
            key={item.view}
            onClick={() => onChangeView(item.view)}
            type="button"
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
