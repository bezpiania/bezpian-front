import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  let user = null;
  try { user = JSON.parse(localStorage.getItem('user') || 'null'); } catch {}

  const role = localStorage.getItem('workspaceRole') || user?.workspaceRole || 'member';
  const isAdmin = role === 'admin' || role === 'owner';

  const userName    = user?.name  || 'Usuario';
  const userEmail   = user?.email || '';
  const userInitial = (userName[0] || 'U').toUpperCase();

  const handleLogout = () => {
    ['user', 'accessToken', 'refreshToken', 'workspaceId', 'workspaceRole'].forEach(k => localStorage.removeItem(k));
    navigate('/login');
  };

  const navClass = ({ isActive }) => 'app-nav-item' + (isActive ? ' active' : '');

  return (
    <aside className="app-sidebar">
      <div className="app-brand">
        <div className="app-brand-mark">Z</div>
        <div className="app-brand-name">Zapien</div>
        <div className="pill-pro">PRO</div>
      </div>

      <div className="app-store">
        <div className="app-store-status"></div>
        <div className="app-store-info">
          <div className="app-store-name">Tienda Acme</div>
          <div className="app-store-meta">En vivo · 3 chats</div>
        </div>
      </div>

      <div className="app-nav-section">
        <div className="app-nav-label">Operación</div>
        <NavLink to="/dashboard" className={navClass} end>
          <svg><use href="#i-home" /></svg>Inicio
        </NavLink>
        {isAdmin && (
          <NavLink to="/chatbots" className={navClass}>
            <svg><use href="#i-bot" /></svg>Chatbots<span className="badge">3</span>
          </NavLink>
        )}
        <NavLink to="/conversaciones" className={navClass}>
          <svg><use href="#i-chat" /></svg>Conversaciones<span className="badge">12</span>
        </NavLink>
        <NavLink to="/leads" className={navClass}>
          <svg><use href="#i-lead" /></svg>Leads<span className="badge">8</span>
        </NavLink>
        <NavLink to="/cotizaciones" className={navClass}>
          <svg><use href="#i-quote" /></svg>Cotizaciones<span className="badge">3</span>
        </NavLink>
        <NavLink to="/citas" className={navClass}>
          <svg><use href="#i-cal" /></svg>Agenda
        </NavLink>
      </div>

      <div className="app-nav-section">
        <div className="app-nav-label">Cuenta</div>
        {isAdmin && (
          <>
            <NavLink to="/equipo" className={navClass}>
              <svg><use href="#i-team" /></svg>Equipo
            </NavLink>
            <NavLink to="/plan" className={navClass}>
              <svg><use href="#i-card" /></svg>Plan
            </NavLink>
          </>
        )}
        <NavLink to="/perfil" className={navClass}>
          <svg><use href="#i-settings" /></svg>Configuración
        </NavLink>
      </div>

      <div className="app-user">
        <div className="app-user-avatar">{userInitial}</div>
        <div className="app-user-info">
          <div className="app-user-name">{userName}</div>
          <div className="app-user-email" style={{ fontSize: 10, opacity: 0.55 }}>
            {role === 'owner' ? 'Owner' : role === 'admin' ? 'Admin' : 'Operador'} · {userEmail}
          </div>
        </div>
        <button type="button" className="app-user-logout" onClick={handleLogout} title="Cerrar sesión">
          <svg><use href="#i-logout" /></svg>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
