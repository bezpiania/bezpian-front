import React from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../../../components/AppLayout.jsx';

const QUOTES = [
  { id: 'COT-0142', name: 'Carla Lagos', email: 'carla.lagos@gmail.com', items: '3 polerones M negro', itemsExtra: '+ envío', amount: '$89.700', status: { label: 'Enviada', tone: 'amber' }, when: 'Hoy 10:18' },
  { id: 'COT-0141', name: 'María González', email: 'maria@restaurant.cl', items: '24 salsa picante', itemsExtra: 'box mayorista', amount: '$216.000', status: { label: 'Aceptada', tone: 'green' }, when: 'Ayer 17:42' },
  { id: 'COT-0140', name: 'Daniel Soto', email: 'd.soto@empresa.cl', items: '5 poleras XL', itemsExtra: 'surtido colores', amount: '$64.500', status: { label: 'Vista', tone: 'amber' }, when: '2 días' },
  { id: 'COT-0139', name: 'Javiera Muñoz', email: 'jmunoz@correo.cl', items: '2 polerones S', itemsExtra: '', amount: '$59.800', status: { label: 'Rechazada', tone: 'red' }, when: '3 días' },
  { id: 'COT-0138', name: 'Restaurante Vega', email: 'jefa@vega.cl', items: '48 salsas mixtas', itemsExtra: 'contrato mensual', amount: '$384.000', status: { label: 'Aceptada', tone: 'green' }, when: '5 días' },
  { id: 'COT-0137', name: 'Anónimo', email: 'no dejó email', items: '1 polera blanca M', itemsExtra: '', amount: '$12.900', status: { label: 'Expirada', tone: 'muted' }, when: '8 días' },
];

const Quotes = () => (
  <AppLayout>
    <div className="page-head with-halo">
      <div>
        <div className="page-eyebrow">
          <span>Cotizaciones</span>
          <span className="dot"></span>
          <span>32 totales · $4.8M en pipeline</span>
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
          <div className="kpi-value">8</div>
          <div className="kpi-foot">$1.2M en juego</div>
        </div>
        <div className="kpi voltage">
          <div className="kpi-label">Aceptadas (mes)</div>
          <div className="kpi-value">14</div>
          <div className="kpi-foot">$2.4M cerrados</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Tasa de cierre</div>
          <div className="kpi-value">61<span className="unit">%</span></div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Ticket promedio</div>
          <div className="kpi-value">$172<span className="unit">k</span></div>
        </div>
      </div>

      <div className="filter-bar">
        <div className="search">
          <svg><use href="#i-search" /></svg>
          <input placeholder="Buscar por número, cliente o producto…" />
        </div>
        <button className="filter-chip">Estado <svg><use href="#i-chevron-down" /></svg></button>
        <button className="filter-chip"><svg><use href="#i-bot" /></svg>Todos los bots<svg><use href="#i-chevron-down" /></svg></button>
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
          {QUOTES.map((q) => (
            <tr key={q.id}>
              <td className="td-mono">
                <Link to={`/cotizaciones/${q.id}`} style={{ fontWeight: 700, borderBottom: '1px solid var(--rule-strong)' }}>
                  {q.id}
                </Link>
              </td>
              <td>
                <div className="td-strong">{q.name}</div>
                <div style={{ fontStyle: 'italic', fontSize: 12, opacity: 0.6 }}>{q.email}</div>
              </td>
              <td>
                <div className="td-strong">{q.items}</div>
                {q.itemsExtra && <div style={{ fontStyle: 'italic', fontSize: 12, opacity: 0.6 }}>{q.itemsExtra}</div>}
              </td>
              <td className="td-mono" style={{ fontWeight: 600 }}>{q.amount}</td>
              <td><span className={'pill ' + q.status.tone}>{q.status.label}</span></td>
              <td className="td-mono">{q.when}</td>
              <td>
                <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', opacity: 0.5, padding: 4 }}>
                  <svg style={{ width: 16, height: 16 }}><use href="#i-dots" /></svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </AppLayout>
);

export default Quotes;
