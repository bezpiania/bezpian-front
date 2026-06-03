import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useSidebarCounts } from '../hooks/useSidebarCounts.js';
import { getActiveBot, clearActiveBot } from '../hooks/useActiveBot.js';
import api from '../apis/app.js';

const Sidebar = () => {
  const navigate = useNavigate();

  let user = null;
  try { user = JSON.parse(localStorage.getItem('user') || 'null'); } catch {}

  const role    = localStorage.getItem('workspaceRole') || user?.workspaceRole || 'admin';
  const isAdmin = !role || role === 'admin' || role === 'owner';
  const wsId    = localStorage.getItem('workspaceId');
  const bot     = getActiveBot();

  // Counts filtered by active bot
  const { data: counts } = useSidebarCounts(wsId, bot.id);
  const conversations = counts?.conversations ?? null;
  const leads         = counts?.leads         ?? null;
  const quotes        = counts?.quotes        ?? null;

  const { data: newOrders } = useQuery({
    queryKey: ['orders-new', wsId, bot.id],
    queryFn:  () => api.get(`/api/workspaces/${wsId}/orders?status=new${bot.id ? `&chatbotId=${bot.id}` : ''}`),
    enabled:  !!wsId,
    refetchInterval: 30000,
    select: d => d?.data?.orders?.length ?? 0,
  });

  const userName    = user?.name  || 'Usuario';
  const userEmail   = user?.email || '';
  const userInitial = (userName[0] || 'U').toUpperCase();

  const handleLogout = () => {
    ['user','accessToken','refreshToken','workspaceId','workspaceRole'].forEach(k => localStorage.removeItem(k));
    clearActiveBot();
    navigate('/login');
  };

  const handleChangBot = () => {
    clearActiveBot();
    navigate('/bots');
  };

  const navClass = ({ isActive }) => 'app-nav-item' + (isActive ? ' active' : '');
  const Badge = ({ count }) => {
    if (count === null || count === undefined) return null;
    return <span className="badge">{count > 99 ? '99+' : count}</span>;
  };

  return (
    <aside className="app-sidebar">
      {/* Brand */}
      <div className="app-brand">
        <div className="app-brand-mark">Z</div>
        <div className="app-brand-name">Zapien</div>
        <div className="pill-pro">PRO</div>
      </div>

      {/* Active bot selector */}
      <button
        onClick={handleChangBot}
        title="Cambiar de chatbot"
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'var(--bone-2)', border: '1px solid var(--rule)',
          borderRadius: 10, padding: '10px 12px', cursor: 'pointer',
          width: '100%', textAlign: 'left', transition: 'background 0.15s',
          marginBottom: 4,
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--bone-3)'}
        onMouseLeave={e => e.currentTarget.style.background = 'var(--bone-2)'}
      >
        <div style={{
          width: 32, height: 32, borderRadius: 8, flexShrink: 0,
          background: bot.color, display: 'grid', placeItems: 'center',
          fontSize: 16, boxShadow: `0 2px 6px ${bot.color}44`,
        }}>
          {bot.avatar}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {bot.name || 'Sin bot activo'}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, opacity: 0.5, letterSpacing: '0.06em', marginTop: 1 }}>
            Cambiar chatbot
          </div>
        </div>
        <svg style={{ width: 12, height: 12, opacity: 0.4, flexShrink: 0 }}><use href="#i-chevron-down" /></svg>
      </button>

      {/* Nav — Operación */}
      <div className="app-nav-section">
        <div className="app-nav-label">Operación</div>
        <NavLink to="/dashboard" className={navClass} end>
          <svg><use href="#i-home" /></svg>Inicio
        </NavLink>
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
        <NavLink to="/ventas" className={navClass}>
          <svg><use href="#i-money" /></svg>Ventas
          {newOrders > 0 && <Badge count={newOrders} />}
        </NavLink>
      </div>

      {/* Nav — Cuenta */}
      <div className="app-nav-section">
        <div className="app-nav-label">Cuenta</div>
        {isAdmin && (
          <>
            <NavLink to="/chatbots" className={navClass}>
              <svg><use href="#i-bot" /></svg>Mis chatbots
            </NavLink>
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

      {/* User */}
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
