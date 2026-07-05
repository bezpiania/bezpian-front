import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Spin, message } from 'antd';
import AppLayout from '../../../components/AppLayout.jsx';
import Conversations from '../../../services/Conversations.js';

const BotPill = ({ botId, emoji = '🤖', color = 'voltage' }) => {
  const label = `${emoji} ${botId || 'Bot'}`;

  if (color === 'magma') {
    return <span className="pill" style={{ background: '#FF4D1F', color: 'var(--bone)' }}>{label}</span>;
  }
  return <span className={'pill ' + color}>{label}</span>;
};

const OutcomePill = ({ outcome }) => {
  const outcomeColors = {
    'lead': 'voltage',
    'quote': 'green',
    'appointment': 'voltage',
    'info': 'muted',
    'spam': 'red',
    'none': 'muted',
  };

  const labels = {
    'lead': 'Lead',
    'quote': 'Cotización',
    'appointment': 'Cita',
    'info': 'Info',
    'spam': 'Spam',
    'none': 'Sin resultado',
  };

  const tone = outcomeColors[outcome?.toLowerCase()] || 'muted';
  const label = labels[outcome?.toLowerCase()] || outcome || 'Sin resultado';

  return <span className={'pill ' + tone}>{label}</span>;
};

const StatusPill = ({ status }) => {
  const statusColors = {
    'active': 'amber',
    'closed': 'green',
    'spam': 'red',
  };

  const labels = {
    'active': 'Abierta',
    'closed': 'Cerrada',
    'spam': 'Spam',
  };

  const tone = statusColors[status?.toLowerCase()] || 'muted';
  const label = labels[status?.toLowerCase()] || status || 'Desconocido';

  return <span className={'pill ' + tone}>{label}</span>;
};

const getTimeAgo = (date) => {
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes} min`;
  if (hours < 24) return `${hours} h`;
  return `${days} d`;
};

const ConversationsPage = () => {
  const activeBotId = localStorage.getItem('activeBotId') || '';
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    outcome: '',
    page: 1,
    limit: 10,
  });
  const [total, setTotal] = useState(0);
  const [activeCount, setActiveCount] = useState(0);

  useEffect(() => {
    fetchConversations();
  }, [filters, activeBotId]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const workspaceId = localStorage.getItem('workspaceId');
      const response = await Conversations.listByBot(workspaceId, activeBotId, filters);

      if (response?.data) {
        setConversations(response.data);
        setTotal(response.total || response.data.length);
        setActiveCount(response.data.filter(c => c.status === 'active').length);
      } else {
        setConversations([]);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      message.error('Error al obtener conversaciones');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setFilters({ ...filters, search: e.target.value, page: 1 });
  };

  const handleStatusFilter = (status) => {
    setFilters({ ...filters, status: status || '', page: 1 });
  };

  const handleOutcomeFilter = (outcome) => {
    setFilters({ ...filters, outcome: outcome || '', page: 1 });
  };

  const handlePrevPage = () => {
    if (filters.page > 1) {
      setFilters({ ...filters, page: filters.page - 1 });
    }
  };

  const handleNextPage = () => {
    const maxPages = Math.ceil(total / filters.limit);
    if (filters.page < maxPages) {
      setFilters({ ...filters, page: filters.page + 1 });
    }
  };

  const maxPages = Math.ceil(total / filters.limit) || 1;
  const startIndex = (filters.page - 1) * filters.limit;
  const endIndex = Math.min(startIndex + filters.limit, total);

  return (
    <AppLayout>
      <div className="page-head with-halo">
        <div>
          <div className="page-eyebrow">
            <span>Conversaciones</span>
            <span className="dot"></span>
            <span>{total} en total · {activeCount} abiertas</span>
          </div>
          <h1 className="page-title">
            Cada <span className="hl">chat</span><br />que tuvo tu bot.
          </h1>
          <p className="page-sub">
            Lee, busca, filtra. Si algo se vuelve un lead o cotización, lo encuentras acá primero.
          </p>
        </div>
      </div>

      <div className="page-body">
        <div className="filter-bar">
          <div className="search">
            <svg><use href="#i-search" /></svg>
            <input
              placeholder="Buscar por nombre, email o contenido del chat…"
              value={filters.search}
              onChange={handleSearch}
            />
          </div>
          <button
            className="filter-chip"
            onClick={() => handleOutcomeFilter(filters.outcome ? '' : 'lead')}
          >
            <svg><use href="#i-target" /></svg>
            {filters.outcome ? filters.outcome : 'Outcome'}
            <svg><use href="#i-chevron-down" /></svg>
          </button>
          <button
            className="filter-chip"
            onClick={() => handleStatusFilter(filters.status ? '' : 'active')}
          >
            <svg><use href="#i-filter" /></svg>
            {filters.status ? (filters.status === 'active' ? 'Abierta' : 'Cerrada') : 'Estado'}
            <svg><use href="#i-chevron-down" /></svg>
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Spin />
          </div>
        ) : conversations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', opacity: 0.6 }}>
            <div style={{ fontSize: 16, marginBottom: 8 }}>Sin conversaciones</div>
            <div style={{ fontSize: 13 }}>No hay conversaciones que coincidan con los filtros</div>
          </div>
        ) : (
          <>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '36%' }}>Cliente / Inicio</th>
                  <th>Bot</th>
                  <th>Resultado</th>
                  <th>Estado</th>
                  <th>Hace</th>
                  <th style={{ width: 48 }}></th>
                </tr>
              </thead>
              <tbody>
                {conversations.map((conv) => (
                  <tr key={conv._id} style={{ cursor: 'pointer' }}>
                    <td>
                      <Link to={`/conversaciones/${conv._id}`} style={{ display: 'block' }}>
                        <div className="td-strong">
                          {conv.visitorMetadata?.name || conv.visitorId || 'Visitante'}
                        </div>
                        <div style={{ fontStyle: 'italic', fontSize: 13, opacity: 0.65, marginTop: 2 }}>
                          {conv.lastMessagePreview?.length > 50
                            ? conv.lastMessagePreview.substring(0, 50) + '...'
                            : conv.lastMessagePreview || '(Sin mensajes)'}
                        </div>
                      </Link>
                    </td>
                    <td><BotPill botId={conv.botName} emoji={conv.botEmoji} color={conv.botColor} /></td>
                    <td><OutcomePill outcome={conv.outcome} /></td>
                    <td><StatusPill status={conv.status} /></td>
                    <td className="td-mono">{getTimeAgo(conv.lastMessageAt || conv.createdAt)}</td>
                    <td>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 18, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.55 }}>
              <div>Mostrando {startIndex + 1} de {total}</div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <button
                  className="btn btn-ghost btn-sm"
                  style={{ fontSize: 11, padding: '6px 10px' }}
                  onClick={handlePrevPage}
                  disabled={filters.page === 1}
                >
                  ← Anterior
                </button>
                <span>{filters.page} / {maxPages}</span>
                <button
                  className="btn btn-ghost btn-sm"
                  style={{ fontSize: 11, padding: '6px 10px' }}
                  onClick={handleNextPage}
                  disabled={filters.page >= maxPages}
                >
                  Siguiente →
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default ConversationsPage;
