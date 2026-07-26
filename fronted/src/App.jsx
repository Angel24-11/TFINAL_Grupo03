import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import UsuariosPage from "./pages/UsuariosPage";
import ClientesPage from "./pages/ClientesPage";
import HabitacionesPage from "./pages/HabitacionesPage";
import DisponibilidadPage from "./pages/DisponibilidadPage";
import "./App.css";

// SVG Icons (Linear/Stripe style)
const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="9" rx="1" />
    <rect x="14" y="3" width="7" height="5" rx="1" />
    <rect x="14" y="12" width="7" height="9" rx="1" />
    <rect x="3" y="16" width="7" height="5" rx="1" />
  </svg>
);

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const ClientsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const RoomsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 10h18" />
    <path d="M3 14h18" />
    <rect x="3" y="6" width="18" height="12" rx="2" />
    <path d="M7 6v12" />
    <path d="M17 6v12" />
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

function Home() {
  return (
    <section id="center">
      <div className="dashboard-header-simple">
        <h2>Panel de Control</h2>
        <p>Vista general del estado operativo de Hotelware UPS.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Habitaciones Ocupadas</span>
          <span className="stat-value">96 / 120</span>
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: "80%" }}></div>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-label">Huéspedes Registrados</span>
          <span className="stat-value">142</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Porcentaje de Ocupación</span>
          <span className="stat-value">80%</span>
        </div>
      </div>

      <div className="section-title-simple">Acceso directo a módulos</div>
      
      <div className="modules-grid">
        <Link to="/usuarios" className="module-card">
          <div className="module-card-header">
            <span className="module-card-title">Usuarios</span>
            <UsersIcon />
          </div>
          <p>Administración de personal, asignación de roles y accesos.</p>
          <span className="module-card-action">Abrir módulo <ExternalLinkIcon /></span>
        </Link>

        <Link to="/clientes" className="module-card">
          <div className="module-card-header">
            <span className="module-card-title">Clientes</span>
            <ClientsIcon />
          </div>
          <p>Registro de huéspedes y consulta de historial de estancias.</p>
          <span className="module-card-action">Abrir módulo <ExternalLinkIcon /></span>
        </Link>

        <Link to="/habitaciones" className="module-card">
          <div className="module-card-header">
            <span className="module-card-title">Habitaciones</span>
            <RoomsIcon />
          </div>
          <p>Control del estado, tipo y tarifas de habitaciones.</p>
          <span className="module-card-action">Abrir módulo <ExternalLinkIcon /></span>
        </Link>

        <Link to="/disponibilidad" className="module-card">
          <div className="module-card-header">
            <span className="module-card-title">Disponibilidad</span>
            <CalendarIcon />
          </div>
          <p>Búsqueda y consulta de disponibilidad de habitaciones por fecha.</p>
          <span className="module-card-action">Abrir módulo <ExternalLinkIcon /></span>
        </Link>
      </div>
    </section>
  );
}

function NavLinks() {
  const location = useLocation();
  const getActiveClass = (path) => (location.pathname === path ? "nav-link active" : "nav-link");

  return (
    <nav className="sidebar-menu">
      <Link to="/" className={getActiveClass("/")}>
        <HomeIcon /> <span>Panel</span>
      </Link>
      <Link to="/usuarios" className={getActiveClass("/usuarios")}>
        <UsersIcon /> <span>Usuarios</span>
      </Link>
      <Link to="/clientes" className={getActiveClass("/clientes")}>
        <ClientsIcon /> <span>Clientes</span>
      </Link>
      <Link to="/habitaciones" className={getActiveClass("/habitaciones")}>
        <RoomsIcon /> <span>Habitaciones</span>
      </Link>
      <Link to="/disponibilidad" className={getActiveClass("/disponibilidad")}>
        <CalendarIcon /> <span>Disponibilidad</span>
      </Link>
    </nav>
  );
}

function HeaderTitle() {
  const location = useLocation();
  const getTitle = () => {
    switch (location.pathname) {
      case "/usuarios":
        return "Usuarios";
      case "/clientes":
        return "Clientes";
      case "/habitaciones":
        return "Habitaciones";
      case "/disponibilidad":
        return "Disponibilidad";
      default:
        return "Panel de Control";
    }
  };
  return <div className="header-title">{getTitle()}</div>;
}

function App() {
  return (
    <BrowserRouter>
      <div className="dashboard-container">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-brand">
            <Link to="/" className="sidebar-logo">
              <span className="sidebar-logo-text">Hotelware <span style={{ color: "var(--accent)" }}>UPS</span></span>
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

        {/* Main Workspace area */}
        <div className="main-workspace">
          <header className="top-header">
            <HeaderTitle />
            <div className="header-actions">
              <div className="system-status">
                <span className="status-dot"></span>
                Backend Conectado
              </div>
            </div>
          </header>

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
