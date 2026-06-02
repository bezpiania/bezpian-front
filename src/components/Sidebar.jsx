import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSidebarCounts } from '../hooks/useSidebarCounts.js';

const Sidebar = () => {
  const navigate = useNavigate();

  let user = null;
  try { user = JSON.parse(localStorage.getItem('user') || 'null'); } catch {}

  const role      = localStorage.getItem('workspaceRole') || user?.workspaceRole || 'admin';
  const isAdmin   = !role || role === 'admin' || role === 'owner';
  const wsId      = localStorage.getItem('workspaceId');

  const { data: counts } = useSidebarCounts(wsId);
  const chatbots      = counts?.chatbots      ?? null;
  const conversations = counts?.conversations ?? null;
  const leads         = counts?.leads         ?? null;
  const quotes        = counts?.quotes        ?? null;

  const userName    = user?.name  || 'Usuario';
  const userEmail   = user?.email || '';
  const userInitial = (userName[0] || 'U').toUpperCase();

  const handleLogout = () => {
    ['user', 'accessToken', 'refreshToken', 'workspaceId', 'workspaceRole'].forEach(k => localStorage.removeItem(k));
    navigate('/login');
  };

  const navClass = ({ isActive }) => 'app-nav-item' + (isActive ? ' active' : '');

  const Badge = ({ count }) => {
    if (count === null || count === undefined) return null;
    return <span className="badge">{count > 99 ? '99+' : count}</span>;
  };

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
          <div className="app-store-name">Workspace</div>
          <div className="app-store-meta">
            {chatbots !== null ? `${chatbots} chatbot${chatbots !== 1 ? 's' : ''}` : 'Cargando...'}
          </div>
        </div>
      </div>

      <div className="app-nav-section">
        <div className="app-nav-label">Operación</div>
        <NavLink to="/dashboard" className={navClass} end>
          <svg><use href="#i-home" /></svg>Inicio
        </NavLink>
        {isAdmin && (
          <NavLink to="/chatbots" className={navClass}>
            <svg><use href="#i-bot" /></svg>Chatbots
            <Badge count={chatbots} />
          </NavLink>
        )}
        <NavLink to="/conversaciones" className={navClass}>
          <svg><use href="#i-chat" /></svg>Conversaciones
          <Badge count={conversations} />
        </NavLink>
        <NavLink to="/leads" className={navClass}>
          <svg><use href="#i-lead" /></svg>Leads
          <Badge count={leads} />
        </NavLink>
        <NavLink to="/cotizaciones" className={navClass}>
          <svg><use href="#i-quote" /></svg>Cotizaciones
          <Badge count={quotes} />
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
