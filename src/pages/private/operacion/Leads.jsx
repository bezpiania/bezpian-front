import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import AppLayout from '../../../components/AppLayout.jsx';
import { useGetLeads } from '../../../hooks/useLead.js';

const COLORS = ['var(--voltage)', '#1B2C5C', '#EC4899', '#8B5CF6', '#2DBE60', '#FF6B6B', '#4ECDC4', '#45B7D1'];
const STATUS_CONFIG = {
  new: { label: 'Nuevo', tone: 'muted' },
  contacted: { label: 'Contactado', tone: 'amber' },
  qualified: { label: 'Calificado', tone: 'voltage' },
  won: { label: 'Ganado', tone: 'green' },
  lost: { label: 'Perdido', tone: 'red' },
};

const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const getColorForInitials = (index) => COLORS[index % COLORS.length];

const formatDate = (date) => {
  if (!date) return '—';
  const d = new Date(date);
  const now = new Date();
  const diffTime = Math.abs(now - d);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return `Hoy ${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`;
  if (diffDays === 1) return `Ayer ${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`;
  return `${diffDays} días`;
};

const BotPill = ({ bot }) => {
  if (!bot) return <span className="pill muted">Sin origen</span>;
  return bot.tone === 'magma' ? (
    <span className="pill" style={{ background: '#FF4D1F', color: 'var(--bone)' }}>{bot.label}</span>
  ) : (
    <span className={'pill ' + bot.tone}>{bot.label}</span>
  );
};

const Leads = () => {
  const { workspaceId } = useParams();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { data: leadsResponse, isLoading } = useGetLeads(workspaceId, workspaceId);
  const leads = leadsResponse?.data || [];

  const filteredLeads = useMemo(() => {
    let result = leads;
    if (search) {
      result = result.filter(l =>
        l.name?.toLowerCase().includes(search.toLowerCase()) ||
        l.email?.toLowerCase().includes(search.toLowerCase()) ||
        l.phone?.includes(search)
      );
    }
    if (statusFilter) {
      result = result.filter(l => l.status === statusFilter);
    }
    return result;
  }, [leads, search, statusFilter]);

  const pipeline = useMemo(() => {
    const counts = { new: 0, contacted: 0, qualified: 0, won: 0, lost: 0 };
    leads.forEach(l => counts[l.status]++);

    return [
      { key: 'new', label: 'Nuevos', count: counts.new, border: 'var(--rule)', bg: 'var(--bone)' },
      { key: 'contacted', label: 'Contactados', count: counts.contacted, border: 'var(--rule)', bg: 'var(--bone)' },
      { key: 'qualified', label: 'Calificados', count: counts.qualified, border: 'var(--carbon)', bg: 'var(--voltage)' },
      { key: 'won', label: 'Ganados', count: counts.won, border: 'var(--green)', bg: 'var(--bone)' },
      { key: 'lost', label: 'Perdidos', count: counts.lost, border: 'var(--magma)', bg: 'var(--bone)', dim: true },
    ];
  }, [leads]);

  return (
    <AppLayout>
      <div className="page-head with-halo">
        <div>
          <div className="page-eyebrow">
            <span>Leads</span>
            <span className="dot"></span>
            <span>{leads.length} totales · {pipeline[0].count} nuevos</span>
          </div>
          <h1 className="page-title">
            CRM <span className="hl">liviano</span><br />para tu equipo.
          </h1>
          <p className="page-sub">
            Los clientes que mostraron interés. Mueve por el embudo, agrega notas, exporta cuando quieras.
          </p>
        </div>
        <div className="page-actions">
          <button className="btn btn-ghost btn-sm">
            <svg><use href="#i-download" /></svg>Exportar CSV
          </button>
        </div>
      </div>

      <div className="page-body">
        {/* Pipeline */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1, background: 'var(--rule-strong)', border: '1px solid var(--rule-strong)', borderRadius: 10, overflow: 'hidden', marginBottom: 24 }}>
          {pipeline.map((p) => (
            <div key={p.key} style={{ background: p.bg, padding: 14, cursor: 'pointer', borderBottom: `3px solid ${p.border}`, opacity: p.dim ? 0.75 : 1 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.6, marginBottom: 4 }}>
                {p.label}
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 24, letterSpacing: '-0.03em' }}>
                {p.count}
              </div>
            </div>
          ))}
        </div>

        <div className="filter-bar">
          <div className="search">
            <svg><use href="#i-search" /></svg>
            <input
              placeholder="Buscar por nombre, email o teléfono…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="filter-chip">Todos los estados <svg><use href="#i-chevron-down" /></svg></button>
          <button className="filter-chip"><svg><use href="#i-bot" /></svg>Todos los bots<svg><use href="#i-chevron-down" /></svg></button>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: 36 }}><input type="checkbox" style={{ cursor: 'pointer' }} /></th>
              <th>Lead</th>
              <th>Contacto</th>
              <th>Origen</th>
              <th>Estado</th>
              <th>Capturado</th>
              <th style={{ width: 48 }}></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: 20, opacity: 0.6 }}>Cargando leads...</td></tr>
            ) : filteredLeads.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: 20, opacity: 0.6 }}>No hay leads</td></tr>
            ) : (
              filteredLeads.map((l, idx) => {
                const statusConfig = STATUS_CONFIG[l.status] || { label: l.status, tone: 'muted' };
                const color = getColorForInitials(idx);
                const initials = getInitials(l.name);

                return (
                  <tr key={l._id}>
                    <td><input type="checkbox" /></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, background: color, color: 'var(--bone)', borderRadius: '50%', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12 }}>
                          {initials}
                        </div>
                        <div>
                          <div className="td-strong">{l.name || '—'}</div>
                          <div style={{ fontStyle: 'italic', fontSize: 12, opacity: 0.6, marginTop: 1 }}>{l.company || '—'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="td-mono">
                      {l.email || '—'}<br />
                      <span style={{ opacity: 0.6 }}>{l.phone || '—'}</span>
                    </td>
                    <td><BotPill bot={l.botInfo} /></td>
                    <td><span className={'pill ' + statusConfig.tone}>{statusConfig.label}</span></td>
                    <td className="td-mono">{formatDate(l.createdAt)}</td>
                    <td>
                      <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', opacity: 0.5, padding: 4 }}>
                        <svg style={{ width: 16, height: 16 }}><use href="#i-dots" /></svg>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
};

export default Leads;
