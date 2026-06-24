import { AdminButton } from "./AdminButton";
import { StatusBadge } from "./StatusBadge";
import type { BookingStatus } from "../types/admin";

interface BookingTableRow {
  id: string;
  title: string;
  customer: string;
  car: string;
  date: string;
  status: BookingStatus;
  paymentStatus: "unpaid" | "paid" | "refunded";
  notes?: string | null;
}

interface BookingTableProps {
  rows: BookingTableRow[];
  emptyMessage: string;
  onStatusChange: (id: string, status: BookingStatus) => void;
}

const statuses: BookingStatus[] = [
  "pending",
  "approved",
  "rejected",
  "cancelled",
  "completed"
];

export function BookingTable({ rows, emptyMessage, onStatusChange }: BookingTableProps) {
  if (rows.length === 0) {
    return <p className="empty-state">{emptyMessage}</p>;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Booking</th>
            <th>Customer</th>
            <th>Car</th>
            <th>Date</th>
            <th>Status</th>
            <th>Payment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>
                <strong>{row.title}</strong>
                {row.notes ? <small>{row.notes}</small> : null}
              </td>
              <td>{row.customer}</td>
              <td>{row.car}</td>
              <td>{row.date}</td>
              <td>
                <StatusBadge status={row.status} />
              </td>
              <td>
                <StatusBadge status={row.paymentStatus} />
              </td>
              <td>
                <div className="table-actions">
                  {statuses.map((status) => (
                    <AdminButton
                      disabled={status === row.status}
                      key={status}
                      onClick={() => onStatusChange(row.id, status)}
                      variant={status === "rejected" ? "danger" : "secondary"}
                    >
                      {status}
                    </AdminButton>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

