import { useMemo, useState } from "react";
import { AdminButton } from "./components/AdminButton";
import { DashboardCard } from "./components/DashboardCard";
import { Sidebar } from "./components/Sidebar";
import { StatusBadge } from "./components/StatusBadge";
import { Topbar } from "./components/Topbar";
import type { AdminView } from "./types/views";

type BookingStatus = "pending" | "approved" | "rejected" | "cancelled" | "completed";
type ApplicationStatus = "pending" | "interview" | "approved" | "rejected";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface Car {
  id: string;
  customerId: string;
  year: number;
  make: string;
  model: string;
  plate: string;
  color: string;
  notes: string;
}

interface LiftBay {
  id: string;
  name: string;
  location: string;
  hourlyRate: number;
  maxWeight: number;
  status: "active" | "inactive";
}

interface LiftBooking {
  id: string;
  reference: string;
  customerId: string;
  carId: string;
  liftId: string;
  packageName: string;
  dateTime: string;
  status: BookingStatus;
  estimatedPrice: number;
  notes: string;
}

interface ServiceBooking {
  id: string;
  reference: string;
  customerId: string;
  carId: string;
  serviceType: string;
  dateTime: string;
  status: BookingStatus;
  estimatedPrice: number;
  assignedMechanic: string;
  notes: string;
}

interface JobApplication {
  id: string;
  reference: string;
  applicantName: string;
  age: number;
  phone: string;
  email: string;
  role: string;
  availability: string;
  experience: string;
  reason: string;
  emergencyContact: string;
  guardianConsent: boolean;
  status: ApplicationStatus;
  adminNotes: string;
}

const customers: Customer[] = [
  { id: "cust-1", name: "Maya Tan", email: "maya@example.com", phone: "+65 8123 4567" },
  { id: "cust-2", name: "Daniel Lim", email: "daniel@example.com", phone: "+65 8765 4321" },
  { id: "cust-3", name: "Aisha Rahman", email: "aisha@example.com", phone: "+65 9001 2200" }
];

const initialCars: Car[] = [
  {
    id: "car-1",
    customerId: "cust-1",
    year: 2019,
    make: "Toyota",
    model: "Corolla Altis",
    plate: "SMA 4821K",
    color: "Pearl white",
    notes: "Oil change due soon"
  },
  {
    id: "car-2",
    customerId: "cust-2",
    year: 2021,
    make: "Honda",
    model: "Civic",
    plate: "SLB 1198P",
    color: "Graphite gray",
    notes: "Customer interested in lift rental"
  },
  {
    id: "car-3",
    customerId: "cust-3",
    year: 2018,
    make: "Mazda",
    model: "3",
    plate: "SKQ 7782M",
    color: "Soul red",
    notes: "Brake noise at low speed"
  }
];

const initialLifts: LiftBay[] = [
  { id: "lift-1", name: "Lift Bay 1", location: "Front workshop", hourlyRate: 28, maxWeight: 2800, status: "active" },
  { id: "lift-2", name: "Lift Bay 2", location: "Rear workshop", hourlyRate: 24, maxWeight: 2400, status: "active" },
  { id: "lift-3", name: "Alignment Bay", location: "Precision zone", hourlyRate: 36, maxWeight: 2600, status: "active" },
  { id: "lift-4", name: "Washing Bay", location: "Detailing corner", hourlyRate: 18, maxWeight: 2200, status: "inactive" }
];

const initialLiftBookings: LiftBooking[] = [
  {
    id: "lift-booking-1",
    reference: "MAH-LIFT-330201",
    customerId: "cust-2",
    carId: "car-2",
    liftId: "lift-1",
    packageName: "Lift + Tools",
    dateTime: "Today, 2:00 PM - 4:00 PM",
    status: "pending",
    estimatedPrice: 68,
    notes: "Wants tool rental and wheel inspection."
  },
  {
    id: "lift-booking-2",
    reference: "MAH-LIFT-330202",
    customerId: "cust-1",
    carId: "car-1",
    liftId: "lift-3",
    packageName: "Assisted DIY",
    dateTime: "Today, 5:00 PM - 7:00 PM",
    status: "approved",
    estimatedPrice: 95,
    notes: "Needs quick guidance for underbody check."
  }
];

const initialServiceBookings: ServiceBooking[] = [
  {
    id: "service-1",
    reference: "MAH-SVC-440201",
    customerId: "cust-3",
    carId: "car-3",
    serviceType: "Brake inspection",
    dateTime: "Today, 10:30 AM",
    status: "pending",
    estimatedPrice: 60,
    assignedMechanic: "Unassigned",
    notes: "Brake noise at low speed."
  },
  {
    id: "service-2",
    reference: "MAH-SVC-440202",
    customerId: "cust-1",
    carId: "car-1",
    serviceType: "Oil change",
    dateTime: "Tomorrow, 9:00 AM",
    status: "approved",
    estimatedPrice: 80,
    assignedMechanic: "Ah Wei",
    notes: "Use standard oil package."
  }
];

const initialApplications: JobApplication[] = [
  {
    id: "app-1",
    reference: "MAH-JOB-550201",
    applicantName: "Nur Hakim",
    age: 17,
    phone: "+65 8111 2222",
    email: "hakim@example.com",
    role: "Apprentice mechanic",
    availability: "Mon, Wed, Sat - after school and weekends",
    experience: "Helps with family car washing and basic tools.",
    reason: "Wants to learn real workshop discipline.",
    emergencyContact: "Mother, +65 8999 1111",
    guardianConsent: true,
    status: "pending",
    adminNotes: ""
  },
  {
    id: "app-2",
    reference: "MAH-JOB-550202",
    applicantName: "Chloe Ng",
    age: 20,
    phone: "+65 8222 3333",
    email: "chloe@example.com",
    role: "Content creator",
    availability: "Tue, Thu, Sun afternoons",
    experience: "Shoots short-form videos for school club.",
    reason: "Interested in car culture content.",
    emergencyContact: "Brother, +65 8333 4444",
    guardianConsent: false,
    status: "interview",
    adminNotes: "Ask for portfolio links."
  }
];

const viewTitles: Record<AdminView, { title: string; subtitle: string }> = {
  overview: {
    title: "Dashboard Overview",
    subtitle: "Mock workshop operations for today's Manfred Auto Hub activity."
  },
  liftBookings: {
    title: "Lift Bookings",
    subtitle: "Approve, reject, or complete lift rental requests."
  },
  serviceBookings: {
    title: "Service Bookings",
    subtitle: "Track workshop service jobs and assign mechanic placeholders."
  },
  applications: {
    title: "Job Applications",
    subtitle: "Review applicants, update status, and add admin notes."
  },
  lifts: {
    title: "Lifts / Bays Management",
    subtitle: "Manage bay availability and workshop rental pricing."
  },
  cars: {
    title: "Customers / Cars",
    subtitle: "View customer contact details and saved vehicle profiles."
  }
};

const mechanics = ["Unassigned", "Ah Wei", "Sarah", "Ravi", "Workshop team"];

function getCustomerName(customerId: string) {
  return customers.find((customer) => customer.id === customerId)?.name ?? "Unknown customer";
}

function getCustomer(customerId: string) {
  return customers.find((customer) => customer.id === customerId);
}

function getCarLabel(cars: Car[], carId: string) {
  const car = cars.find((item) => item.id === carId);
  return car ? `${car.year} ${car.make} ${car.model} (${car.plate})` : "Unknown vehicle";
}

function getLiftName(lifts: LiftBay[], liftId: string) {
  return lifts.find((lift) => lift.id === liftId)?.name ?? "Unknown bay";
}

export function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeView, setActiveView] = useState<AdminView>("overview");
  const [email, setEmail] = useState("owner@manfred.test");
  const [password, setPassword] = useState("password");
  const [loginError, setLoginError] = useState("");
  const [notice, setNotice] = useState("");
  const [cars] = useState<Car[]>(initialCars);
  const [lifts, setLifts] = useState<LiftBay[]>(initialLifts);
  const [liftBookings, setLiftBookings] = useState<LiftBooking[]>(initialLiftBookings);
  const [serviceBookings, setServiceBookings] = useState<ServiceBooking[]>(initialServiceBookings);
  const [applications, setApplications] = useState<JobApplication[]>(initialApplications);

  const metrics = useMemo(() => {
    const todayLiftBookings = liftBookings.filter((booking) => booking.dateTime.startsWith("Today")).length;
    const estimatedDailyRevenue = [
      ...liftBookings.filter((booking) => booking.dateTime.startsWith("Today")),
      ...serviceBookings.filter((booking) => booking.dateTime.startsWith("Today"))
    ]
      .filter((booking) => booking.status !== "rejected" && booking.status !== "cancelled")
      .reduce((total, booking) => total + booking.estimatedPrice, 0);

    return {
      todayLiftBookings,
      pendingLiftBookings: liftBookings.filter((booking) => booking.status === "pending").length,
      pendingServiceBookings: serviceBookings.filter((booking) => booking.status === "pending").length,
      newApplications: applications.filter((application) => application.status === "pending").length,
      estimatedDailyRevenue
    };
  }, [applications, liftBookings, serviceBookings]);

  function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginError("");

    if (!email.trim() || !password.trim()) {
      setLoginError("Enter an admin email and password.");
      return;
    }

    setIsLoggedIn(true);
  }

  function updateLiftBookingStatus(id: string, status: BookingStatus) {
    setLiftBookings((currentBookings) =>
      currentBookings.map((booking) => (booking.id === id ? { ...booking, status } : booking))
    );
    setNotice(`Lift booking marked ${status}.`);
  }

  function updateServiceBookingStatus(id: string, status: BookingStatus) {
    setServiceBookings((currentBookings) =>
      currentBookings.map((booking) => (booking.id === id ? { ...booking, status } : booking))
    );
    setNotice(`Service booking marked ${status}.`);
  }

  function updateServiceMechanic(id: string, assignedMechanic: string) {
    setServiceBookings((currentBookings) =>
      currentBookings.map((booking) =>
        booking.id === id ? { ...booking, assignedMechanic } : booking
      )
    );
    setNotice("Mechanic placeholder updated.");
  }

  function updateApplicationStatus(id: string, status: ApplicationStatus) {
    setApplications((currentApplications) =>
      currentApplications.map((application) =>
        application.id === id ? { ...application, status } : application
      )
    );
    setNotice(`Application marked ${status}.`);
  }

  function updateApplicationNotes(id: string, adminNotes: string) {
    setApplications((currentApplications) =>
      currentApplications.map((application) =>
        application.id === id ? { ...application, adminNotes } : application
      )
    );
  }

  function toggleLiftStatus(id: string) {
    setLifts((currentLifts) =>
      currentLifts.map((lift) =>
        lift.id === id
          ? { ...lift, status: lift.status === "active" ? "inactive" : "active" }
          : lift
      )
    );
    setNotice("Bay availability updated.");
  }

  if (!isLoggedIn) {
    return (
      <main className="login-shell">
        <section className="login-card">
          <p className="eyebrow">Manfred Auto Hub</p>
          <h1>Workshop Admin</h1>
          <p>Mock owner dashboard for bookings, bays, customers, and job applications.</p>
          <form onSubmit={handleLogin}>
            <label>
              Admin email
              <input
                autoComplete="email"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="owner@manfred.test"
                type="email"
                value={email}
              />
            </label>
            <label>
              Password
              <input
                autoComplete="current-password"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Any password for mock mode"
                type="password"
                value={password}
              />
            </label>
            {loginError ? <p className="error-text">{loginError}</p> : null}
            <AdminButton type="submit">Enter dashboard</AdminButton>
          </form>
          <p className="mock-note">Mock mode: no Supabase connection is used.</p>
        </section>
      </main>
    );
  }

  const title = viewTitles[activeView];

  return (
    <div className="admin-layout">
      <Sidebar activeView={activeView} onChangeView={setActiveView} />
      <main className="admin-main">
        <Topbar
          adminEmail={email}
          onRefresh={() => setNotice("Mock dashboard refreshed.")}
          onSignOut={() => setIsLoggedIn(false)}
          subtitle={title.subtitle}
          title={title.title}
        />
        {notice ? <p className="notice-text">{notice}</p> : null}
        {activeView === "overview"
          ? renderOverview({
              metrics,
              liftBookings,
              serviceBookings,
              applications,
              cars,
              lifts,
              setActiveView
            })
          : null}
        {activeView === "liftBookings"
          ? renderLiftBookings({ bookings: liftBookings, cars, lifts, onStatusChange: updateLiftBookingStatus })
          : null}
        {activeView === "serviceBookings"
          ? renderServiceBookings({
              bookings: serviceBookings,
              cars,
              onStatusChange: updateServiceBookingStatus,
              onMechanicChange: updateServiceMechanic
            })
          : null}
        {activeView === "applications"
          ? renderApplications({
              applications,
              onStatusChange: updateApplicationStatus,
              onNotesChange: updateApplicationNotes
            })
          : null}
        {activeView === "lifts" ? renderLifts({ lifts, onToggle: toggleLiftStatus }) : null}
        {activeView === "cars" ? renderCustomersCars({ cars }) : null}
      </main>
    </div>
  );
}

function renderOverview(props: {
  metrics: {
    todayLiftBookings: number;
    pendingLiftBookings: number;
    pendingServiceBookings: number;
    newApplications: number;
    estimatedDailyRevenue: number;
  };
  liftBookings: LiftBooking[];
  serviceBookings: ServiceBooking[];
  applications: JobApplication[];
  cars: Car[];
  lifts: LiftBay[];
  setActiveView: (view: AdminView) => void;
}) {
  return (
    <section className="stack">
      <div className="dashboard-grid">
        <DashboardCard helper="Lift rentals booked today" label="Today's lift bookings" value={props.metrics.todayLiftBookings} />
        <DashboardCard helper="Needs owner approval" label="Pending lift approvals" value={props.metrics.pendingLiftBookings} />
        <DashboardCard helper="Repair requests waiting" label="Pending service bookings" value={props.metrics.pendingServiceBookings} />
        <DashboardCard helper="Fresh applicant queue" label="New job applications" value={props.metrics.newApplications} />
        <DashboardCard helper="Mock estimate only, no payment" label="Estimated daily revenue" value={`$${props.metrics.estimatedDailyRevenue}`} />
      </div>
      <section className="panel hero-panel">
        <div>
          <p className="eyebrow">Owner command center</p>
          <h3>Keep the workshop moving without losing the family-shop feel.</h3>
          <p>Review approvals, assign service jobs, check bay availability, and follow up with new applicants.</p>
        </div>
        <div className="quick-actions">
          <AdminButton variant="secondary" onClick={() => props.setActiveView("liftBookings")}>
            Review lift queue
          </AdminButton>
          <AdminButton variant="secondary" onClick={() => props.setActiveView("serviceBookings")}>
            Service jobs
          </AdminButton>
          <AdminButton variant="secondary" onClick={() => props.setActiveView("applications")}>
            Applications
          </AdminButton>
        </div>
      </section>
      <div className="overview-grid">
        <section className="panel">
          <h3>Today's workshop snapshot</h3>
          <div className="mini-list">
            <span>{props.lifts.filter((lift) => lift.status === "active").length} active bays</span>
            <span>{props.cars.length} customer vehicles</span>
            <span>{props.serviceBookings.length} service jobs in queue</span>
            <span>{props.applications.length} applicant records</span>
          </div>
        </section>
        <section className="panel">
          <h3>Next lift request</h3>
          {props.liftBookings[0] ? (
            <p>
              <strong>{props.liftBookings[0].reference}</strong>
              <br />
              {getCustomerName(props.liftBookings[0].customerId)} wants {props.liftBookings[0].packageName}.
            </p>
          ) : (
            <p>No lift requests yet.</p>
          )}
        </section>
      </div>
    </section>
  );
}

function renderLiftBookings(props: {
  bookings: LiftBooking[];
  cars: Car[];
  lifts: LiftBay[];
  onStatusChange: (id: string, status: BookingStatus) => void;
}) {
  return (
    <section className="card-grid">
      {props.bookings.map((booking) => (
        <article className="work-card" key={booking.id}>
          <div className="work-card__header">
            <div>
              <p className="eyebrow">{booking.reference}</p>
              <h3>{getLiftName(props.lifts, booking.liftId)} - {booking.packageName}</h3>
            </div>
            <StatusBadge status={booking.status} />
          </div>
          <dl className="detail-grid">
            <div><dt>Customer</dt><dd>{getCustomerName(booking.customerId)}</dd></div>
            <div><dt>Vehicle</dt><dd>{getCarLabel(props.cars, booking.carId)}</dd></div>
            <div><dt>Date / time</dt><dd>{booking.dateTime}</dd></div>
            <div><dt>Estimate</dt><dd>${booking.estimatedPrice}</dd></div>
          </dl>
          <p className="card-note">{booking.notes}</p>
          <div className="table-actions">
            <AdminButton disabled={booking.status === "approved"} variant="secondary" onClick={() => props.onStatusChange(booking.id, "approved")}>Approve</AdminButton>
            <AdminButton disabled={booking.status === "rejected"} variant="danger" onClick={() => props.onStatusChange(booking.id, "rejected")}>Reject</AdminButton>
            <AdminButton disabled={booking.status === "completed"} onClick={() => props.onStatusChange(booking.id, "completed")}>Mark completed</AdminButton>
          </div>
        </article>
      ))}
    </section>
  );
}

function renderServiceBookings(props: {
  bookings: ServiceBooking[];
  cars: Car[];
  onStatusChange: (id: string, status: BookingStatus) => void;
  onMechanicChange: (id: string, mechanic: string) => void;
}) {
  return (
    <section className="card-grid">
      {props.bookings.map((booking) => (
        <article className="work-card" key={booking.id}>
          <div className="work-card__header">
            <div>
              <p className="eyebrow">{booking.reference}</p>
              <h3>{booking.serviceType}</h3>
            </div>
            <StatusBadge status={booking.status} />
          </div>
          <dl className="detail-grid">
            <div><dt>Customer</dt><dd>{getCustomerName(booking.customerId)}</dd></div>
            <div><dt>Vehicle</dt><dd>{getCarLabel(props.cars, booking.carId)}</dd></div>
            <div><dt>Date / time</dt><dd>{booking.dateTime}</dd></div>
            <div><dt>Estimate</dt><dd>${booking.estimatedPrice}</dd></div>
          </dl>
          <label>
            Assign mechanic placeholder
            <select value={booking.assignedMechanic} onChange={(event) => props.onMechanicChange(booking.id, event.target.value)}>
              {mechanics.map((mechanic) => <option key={mechanic}>{mechanic}</option>)}
            </select>
          </label>
          <p className="card-note">{booking.notes}</p>
          <div className="table-actions">
            <AdminButton disabled={booking.status === "pending"} variant="secondary" onClick={() => props.onStatusChange(booking.id, "pending")}>Pending</AdminButton>
            <AdminButton disabled={booking.status === "approved"} variant="secondary" onClick={() => props.onStatusChange(booking.id, "approved")}>Approve</AdminButton>
            <AdminButton disabled={booking.status === "completed"} onClick={() => props.onStatusChange(booking.id, "completed")}>Completed</AdminButton>
          </div>
        </article>
      ))}
    </section>
  );
}

function renderApplications(props: {
  applications: JobApplication[];
  onStatusChange: (id: string, status: ApplicationStatus) => void;
  onNotesChange: (id: string, notes: string) => void;
}) {
  return (
    <section className="card-grid">
      {props.applications.map((application) => (
        <article className="work-card" key={application.id}>
          <div className="work-card__header">
            <div>
              <p className="eyebrow">{application.reference}</p>
              <h3>{application.applicantName}</h3>
              <p>{application.role}</p>
            </div>
            <StatusBadge status={application.status} />
          </div>
          <dl className="detail-grid">
            <div><dt>Age</dt><dd>{application.age}</dd></div>
            <div><dt>Phone</dt><dd>{application.phone}</dd></div>
            <div><dt>Email</dt><dd>{application.email}</dd></div>
            <div><dt>Availability</dt><dd>{application.availability}</dd></div>
            <div><dt>Guardian consent</dt><dd>{application.guardianConsent ? "Yes" : "Not required"}</dd></div>
            <div><dt>Emergency contact</dt><dd>{application.emergencyContact}</dd></div>
          </dl>
          <p className="card-note"><strong>Experience:</strong> {application.experience}</p>
          <p className="card-note"><strong>Reason:</strong> {application.reason}</p>
          <label>
            Admin notes placeholder
            <textarea
              onChange={(event) => props.onNotesChange(application.id, event.target.value)}
              placeholder="Interview timing, attitude, parent follow-up..."
              value={application.adminNotes}
            />
          </label>
          <div className="table-actions">
            <AdminButton disabled={application.status === "interview"} variant="secondary" onClick={() => props.onStatusChange(application.id, "interview")}>Mark interview</AdminButton>
            <AdminButton disabled={application.status === "approved"} onClick={() => props.onStatusChange(application.id, "approved")}>Approve</AdminButton>
            <AdminButton disabled={application.status === "rejected"} variant="danger" onClick={() => props.onStatusChange(application.id, "rejected")}>Reject</AdminButton>
          </div>
        </article>
      ))}
    </section>
  );
}

function renderLifts(props: {
  lifts: LiftBay[];
  onToggle: (id: string) => void;
}) {
  return (
    <section className="card-grid">
      {props.lifts.map((lift) => (
        <article className="work-card" key={lift.id}>
          <div className="work-card__header">
            <div>
              <p className="eyebrow">{lift.location}</p>
              <h3>{lift.name}</h3>
            </div>
            <StatusBadge status={lift.status} />
          </div>
          <dl className="detail-grid">
            <div><dt>Hourly rate</dt><dd>${lift.hourlyRate}/hr</dd></div>
            <div><dt>Max weight</dt><dd>{lift.maxWeight} kg</dd></div>
          </dl>
          <AdminButton variant="secondary" onClick={() => props.onToggle(lift.id)}>
            {lift.status === "active" ? "Mark unavailable" : "Mark active"}
          </AdminButton>
        </article>
      ))}
    </section>
  );
}

function renderCustomersCars(props: { cars: Car[] }) {
  return (
    <section className="card-grid">
      {props.cars.map((car) => {
        const customer = getCustomer(car.customerId);
        return (
          <article className="work-card" key={car.id}>
            <div className="work-card__header">
              <div>
                <p className="eyebrow">{car.plate}</p>
                <h3>{car.year} {car.make} {car.model}</h3>
              </div>
              <span className="customer-pill">{car.color}</span>
            </div>
            <dl className="detail-grid">
              <div><dt>Owner</dt><dd>{customer?.name ?? "Unknown"}</dd></div>
              <div><dt>Email</dt><dd>{customer?.email ?? "Unknown"}</dd></div>
              <div><dt>Phone</dt><dd>{customer?.phone ?? "Unknown"}</dd></div>
              <div><dt>Notes</dt><dd>{car.notes}</dd></div>
            </dl>
          </article>
        );
      })}
    </section>
  );
}
