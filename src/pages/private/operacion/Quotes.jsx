import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../../../components/AppLayout.jsx';
import Quote from '../../../services/Quote.js';

const STATUS_CONFIG = {
  draft: { label: 'Borrador', tone: 'muted' },
  sent: { label: 'Enviada', tone: 'amber' },
  viewed: { label: 'Vista', tone: 'amber' },
  accepted: { label: 'Aceptada', tone: 'green' },
  rejected: { label: 'Rechazada', tone: 'red' },
  expired: { label: 'Expirada', tone: 'muted' },
};

const formatCurrency = (amount) => {
  if (!amount) return '$0';
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (date) => {
  if (!date) return '—';
  const d = new Date(date);
  const now = new Date();
  const diffTime = Math.abs(now - d);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return `Hoy ${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`;
  if (diffDays === 1) return `Ayer ${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`;
  return `${diffDays} días`;
};

const Quotes = () => {
  const workspaceId = localStorage.getItem('workspaceId');
  const activeBotId = localStorage.getItem('activeBotId') || '';
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [quotes, setQuotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!workspaceId || !activeBotId) return;

    const fetchQuotes = async () => {
      try {
        setIsLoading(true);
        const response = await Quote.list(workspaceId, activeBotId);
        setQuotes(response?.data || response || []);
      } catch (error) {
        console.error('Error fetching quotes:', error);
        setQuotes([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuotes();
  }, [workspaceId, activeBotId]);

  const filteredQuotes = useMemo(() => {
    let result = quotes;
    if (statusFilter) result = result.filter(q => q.status === statusFilter);
    if (search) result = result.filter(q =>
      q.quoteNumber?.toString().includes(search) ||
      q.clientName?.toLowerCase().includes(search.toLowerCase()) ||
      q.clientEmail?.toLowerCase().includes(search.toLowerCase())
    );
    return result;
  }, [quotes, search, statusFilter]);

  const kpis = useMemo(() => {
    const stats = {
      pending: 0,
      pendingAmount: 0,
      accepted: 0,
      acceptedAmount: 0,
      total: quotes.length,
    };

    quotes.forEach(q => {
      if (q.status === 'accepted') {
        stats.accepted++;
        stats.acceptedAmount += q.total || 0;
      } else if (['draft', 'sent', 'viewed'].includes(q.status)) {
        stats.pending++;
        stats.pendingAmount += q.total || 0;
      }
    });

    const closureRate = stats.total > 0 ? Math.round((stats.accepted / stats.total) * 100) : 0;
    const avgTicket = stats.total > 0 ? Math.round(stats.acceptedAmount / stats.total / 1000) : 0;

    return { stats, closureRate, avgTicket };
  }, [quotes]);

  return (
    <AppLayout>
      <div className="page-head with-halo">
        <div>
          <div className="page-eyebrow">
            <span>Cotizaciones</span>
            <span className="dot"></span>
            <span>{quotes.length} totales · {formatCurrency(quotes.reduce((sum, q) => sum + (q.total || 0), 0))} en pipeline</span>
          </div>
          <h1 className="page-title">
            Lo que tus bots <span className="hl">cotizaron.</span>
          </h1>
          <p className="page-sub">
            Cada cotización tiene un PDF y un link público que puedes compartir con el cliente.
          </p>
        </div>
      </div>

      <div className="page-body">
        <div className="kpis">
          <div className="kpi">
            <div className="kpi-label">Pendientes</div>
            <div className="kpi-value">{kpis.stats.pending}</div>
            <div className="kpi-foot">{formatCurrency(kpis.stats.pendingAmount)} en juego</div>
          </div>
          <div className="kpi voltage">
            <div className="kpi-label">Aceptadas (mes)</div>
            <div className="kpi-value">{kpis.stats.accepted}</div>
            <div className="kpi-foot">{formatCurrency(kpis.stats.acceptedAmount)} cerrados</div>
          </div>
          <div className="kpi">
            <div className="kpi-label">Tasa de cierre</div>
            <div className="kpi-value">{kpis.closureRate}<span className="unit">%</span></div>
          </div>
          <div className="kpi">
            <div className="kpi-label">Ticket promedio</div>
            <div className="kpi-value">${kpis.avgTicket}<span className="unit">k</span></div>
          </div>
        </div>

        <div className="filter-bar">
          <div className="search">
            <svg><use href="#i-search" /></svg>
            <input
              placeholder="Buscar por número, cliente o producto…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className="filter-chip" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">Todos los estados</option>
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <option key={key} value={key}>{cfg.label}</option>
            ))}
          </select>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>N°</th>
              <th>Cliente</th>
              <th>Productos</th>
              <th>Monto</th>
              <th>Estado</th>
              <th>Creada</th>
              <th style={{ width: 48 }}></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: 20, opacity: 0.6 }}>Cargando cotizaciones...</td></tr>
            ) : filteredQuotes.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: 20, opacity: 0.6 }}>No hay cotizaciones</td></tr>
            ) : (
              filteredQuotes.map((q) => {
                const statusConfig = STATUS_CONFIG[q.status] || { label: q.status, tone: 'muted' };
                const items = q.items?.length ? q.items.map(i => `${i.quantity} ${i.name || i.description || 'Producto'}`).join(', ') : '—';

                return (
                  <tr key={q._id}>
                    <td className="td-mono">
                      <Link to={`/cotizaciones/${q._id}`} style={{ fontWeight: 700, borderBottom: '1px solid var(--rule-strong)' }}>
                        {q.quoteNumber || 'SIN N°'}
                      </Link>
                    </td>
                    <td>
                      <div className="td-strong">{q.clientName || '—'}</div>
                      <div style={{ fontStyle: 'italic', fontSize: 12, opacity: 0.6 }}>{q.clientEmail || '—'}</div>
                    </td>
                    <td>
                      <div className="td-strong">{items}</div>
                    </td>
                    <td className="td-mono" style={{ fontWeight: 600 }}>{formatCurrency(q.total)}</td>
                    <td><span className={'pill ' + statusConfig.tone}>{statusConfig.label}</span></td>
                    <td className="td-mono">{formatDate(q.createdAt)}</td>
                    <td>
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

export default Quotes;
