import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import UsuariosPage from "./pages/UsuariosPage";
import ClientesPage from "./pages/ClientesPage";
import HabitacionesPage from "./pages/HabitacionesPage";
import DisponibilidadPage from "./pages/DisponibilidadPage";
import "./App.css";

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" />
    <rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" />
  </svg>
);
const UsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const ClientsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const RoomsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 10h18"/><path d="M3 14h18"/><rect x="3" y="6" width="18" height="12" rx="2"/>
    <path d="M7 6v12"/><path d="M17 6v12"/>
  </svg>
);
const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const BedIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/>
  </svg>
);
const GuestIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
  </svg>
);
const TrendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
  </svg>
);

function Home() {
  const today = new Date().toLocaleDateString("es-EC", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="home">
      <div className="home-hero">
        <div className="home-hero-text">
          <h2>Bienvenido al panel</h2>
          <p>Vista general del estado operativo de Hotelware UPS.</p>
        </div>
        <div className="home-hero-date">
          <span>Hoy</span>
          <strong style={{ textTransform: "capitalize" }}>{today}</strong>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-card-icon amber"><BedIcon /></div>
          <div className="stat-card-body">
            <span className="stat-label">Habitaciones ocupadas</span>
            <span className="stat-value">96 / 120</span>
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: "80%" }} />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon emerald"><GuestIcon /></div>
          <div className="stat-card-body">
            <span className="stat-label">Huéspedes registrados</span>
            <span className="stat-value">142</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon rose"><TrendIcon /></div>
          <div className="stat-card-body">
            <span className="stat-label">Ocupación</span>
            <span className="stat-value">80%</span>
          </div>
        </div>
      </div>

      <div className="section-label">Módulos del sistema</div>

      <div className="modules-grid">
        <Link to="/usuarios" className="module-card module-card--users">
          <div className="module-card-icon"><UsersIcon /></div>
          <div className="module-card-content">
            <div className="module-card-title">Usuarios</div>
            <p>Personal, roles y permisos de acceso al sistema.</p>
            <span className="module-card-link">Ir al módulo <ArrowIcon /></span>
          </div>
        </Link>

        <Link to="/clientes" className="module-card module-card--clients">
          <div className="module-card-icon"><ClientsIcon /></div>
          <div className="module-card-content">
            <div className="module-card-title">Clientes</div>
            <p>Registro de huéspedes e historial de estancias.</p>
            <span className="module-card-link">Ir al módulo <ArrowIcon /></span>
          </div>
        </Link>

        <Link to="/habitaciones" className="module-card module-card--rooms">
          <div className="module-card-icon"><RoomsIcon /></div>
          <div className="module-card-content">
            <div className="module-card-title">Habitaciones</div>
            <p>Estado, tipos y tarifas del inventario hotelero.</p>
            <span className="module-card-link">Ir al módulo <ArrowIcon /></span>
          </div>
        </Link>

        <Link to="/disponibilidad" className="module-card module-card--calendar">
          <div className="module-card-icon"><CalendarIcon /></div>
          <div className="module-card-content">
            <div className="module-card-title">Disponibilidad</div>
            <p>Consulta de habitaciones libres por fecha y tipo.</p>
            <span className="module-card-link">Ir al módulo <ArrowIcon /></span>
          </div>
        </Link>
      </div>
    </div>
  );
}

function NavLinks() {
  const { pathname } = useLocation();
  const cls = (path) => `nav-link${pathname === path ? " active" : ""}`;
  const module = (path) => {
    if (path === "/") return "home";
    if (path === "/usuarios") return "usuarios";
    if (path === "/clientes") return "clientes";
    if (path === "/habitaciones") return "habitaciones";
    return "disponibilidad";
  };

  return (
    <>
      <div className="sidebar-nav-label">Navegación</div>
      <nav className="sidebar-menu">
        <Link to="/" className={cls("/")} data-module={module("/")}><HomeIcon /><span>Panel</span></Link>
        <Link to="/usuarios" className={cls("/usuarios")} data-module={module("/usuarios")}><UsersIcon /><span>Usuarios</span></Link>
        <Link to="/clientes" className={cls("/clientes")} data-module={module("/clientes")}><ClientsIcon /><span>Clientes</span></Link>
        <Link to="/habitaciones" className={cls("/habitaciones")} data-module={module("/habitaciones")}><RoomsIcon /><span>Habitaciones</span></Link>
        <Link to="/disponibilidad" className={cls("/disponibilidad")} data-module={module("/disponibilidad")}><CalendarIcon /><span>Disponibilidad</span></Link>
      </nav>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <aside className="sidebar">
          <div className="sidebar-brand">
            <Link to="/" className="sidebar-logo">
              <div className="sidebar-logo-mark">HW</div>
              <div>
                <div className="sidebar-logo-name">Hotelware UPS</div>
                <div className="sidebar-logo-tag">Gestión hotelera</div>
              </div>
            </Link>
          </div>

          <NavLinks />

          <div className="sidebar-footer">
            <div className="avatar">AD</div>
            <div className="user-info">
              <span className="user-name">Administrador</span>
              <span className="user-role">Soporte</span>
            </div>
          </div>
        </aside>

        <div className="main">
          <div className="main-topbar">
            <div className="system-status">
              <span className="status-dot" />
              Backend conectado
            </div>
          </div>

          <main className="page">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/usuarios" element={<UsuariosPage />} />
              <Route path="/clientes" element={<ClientesPage />} />
              <Route path="/habitaciones" element={<HabitacionesPage />} />
              <Route path="/disponibilidad" element={<DisponibilidadPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
