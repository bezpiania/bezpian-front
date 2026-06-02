import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import AppLayout from '../../../components/AppLayout.jsx';
import api from '../../../apis/app.js';
import { getBusinessType } from '../../../config/businessTypes.js';

const workspaceId = localStorage.getItem('workspaceId');

const ALL_STATUS_CONFIG = {
  new:        { label: 'Nuevo',           dot: '#F59E0B', bg: '#FEF3C7', color: '#92400E' },
  processing: { label: 'Procesando',      dot: '#3B82F6', bg: '#EFF6FF', color: '#1E40AF' },
  preparing:  { label: 'En preparación',  dot: '#0891B2', bg: '#ECFEFF', color: '#155E75' },
  on_the_way: { label: 'En camino',       dot: '#8B5CF6', bg: '#F5F3FF', color: '#5B21B6' },
  shipped:    { label: 'Enviado',         dot: '#8B5CF6', bg: '#F5F3FF', color: '#5B21B6' },
  delivered:  { label: 'Entregado',       dot: 'var(--green)', bg: '#F0FDF4', color: '#166534' },
  returned:   { label: 'Devuelto',        dot: '#F97316', bg: '#FFF7ED', color: '#9A3412' },
  cancelled:  { label: 'Cancelado',       dot: 'var(--magma)', bg: '#FFF1F0', color: '#B91C1C' },
};

// Status flow and labels per business type
const getStatusConfig = (businessType) => {
  const biz = getBusinessType(businessType);
  const flow = biz.sales?.statusFlow || ['new', 'preparing', 'delivered', 'cancelled'];
  const labels = biz.sales?.statusLabels || {};
  const config = {};
  flow.forEach(s => {
    config[s] = { ...ALL_STATUS_CONFIG[s], label: labels[s] || ALL_STATUS_CONFIG[s]?.label || s };
  });
  return config;
};

const getStatusFlow = (businessType) => {
  const biz = getBusinessType(businessType);
  const flow = biz.sales?.statusFlow || ['new', 'preparing', 'delivered', 'cancelled'];
  const flowMap = {};
  for (let i = 0; i < flow.length - 2; i++) {
    if (flow[i] !== 'cancelled') flowMap[flow[i]] = flow[i + 1];
  }
  return flowMap;
};

const fmt = (date) => new Date(date).toLocaleString('es-CL', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

const StatusPill = ({ status, statusConfig }) => {
  const s = (statusConfig || ALL_STATUS_CONFIG)[status] || ALL_STATUS_CONFIG.new;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: s.bg, color: s.color, border: `1px solid ${s.dot}33`, borderRadius: 20, padding: '3px 10px', fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 600, letterSpacing: '0.04em' }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
      {s.label}
    </span>
  );
};

const Orders = () => {
  const qc = useQueryClient();
  const [filter, setFilter] = useState('');
  const [expanded, setExpanded] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['orders', workspaceId, filter],
    queryFn: () => api.get(`/api/workspaces/${workspaceId}/orders${filter ? `?status=${filter}` : ''}`),
    enabled: !!workspaceId,
    refetchInterval: 30000,
  });

  // Detect businessType from first order's chatbot (or from workspace default)
  const ordersRaw = data?.data?.orders || [];
  const orders = ordersRaw;
  const detectedBusinessType = orders[0]?.businessType || 'restaurant';
  const STATUS_CONFIG = getStatusConfig(detectedBusinessType);
  const STATUS_FLOW   = getStatusFlow(detectedBusinessType);
  const bizConfig     = getBusinessType(detectedBusinessType);
  const features      = bizConfig.sales?.features || {};

  const { mutate: updateStatus } = useMutation({
    mutationFn: ({ id, status }) => api.patch(`/api/workspaces/${workspaceId}/orders/${id}/status`, { status }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['orders', workspaceId] }); message.success('Estado actualizado'); },
    onError: () => message.error('Error al actualizar estado'),
  });

  const counts = Object.fromEntries(
    Object.keys(STATUS_CONFIG).map(s => [s, orders.filter(o => o.status === s).length])
  );

  return (
    <AppLayout>
      <div className="page-head with-halo">
        <div>
          <div className="page-eyebrow">
            <span>Ventas</span>
            <span className="dot"></span>
            <span>{orders.length} pedido{orders.length !== 1 ? 's' : ''}</span>
          </div>
          <h1 className="page-title">Pedidos <em>en tiempo real</em></h1>
          <p className="page-sub">Gestiona los pedidos de delivery que tomó tu chatbot.</p>
        </div>
      </div>

      <div className="page-body">

        {/* Status filter chips */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          <button onClick={() => setFilter('')}
            className={'filter-chip' + (!filter ? ' active' : '')}>
            Todos <span className="badge" style={{ marginLeft: 4 }}>{orders.length}</span>
          </button>
          {Object.entries(STATUS_CONFIG).map(([key, s]) => (
            <button key={key} onClick={() => setFilter(key === filter ? '' : key)}
              className={'filter-chip' + (filter === key ? ' active' : '')}>
              {s.label}
              {counts[key] > 0 && <span className="badge" style={{ marginLeft: 4 }}>{counts[key]}</span>}
            </button>
          ))}
        </div>

        {/* Orders table */}
        {isLoading ? (
          <div style={{ padding: 40, textAlign: 'center', opacity: 0.5, fontFamily: 'var(--font-mono)', fontSize: 12 }}>Cargando pedidos...</div>
        ) : orders.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🛵</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, marginBottom: 6 }}>Sin pedidos aún</div>
            <div style={{ opacity: 0.5, fontFamily: 'var(--font-body)', fontSize: 14 }}>Los pedidos que tome el chatbot aparecerán aquí.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {orders.map(order => {
              const isExpanded = expanded === order._id;
              const s = STATUS_CONFIG[order.status] || STATUS_CONFIG.new;
              const nextStatus = STATUS_FLOW[order.status];
              return (
                <div key={order._id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                  {/* Row header */}
                  <div onClick={() => setExpanded(isExpanded ? null : order._id)}
                    style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr 140px 160px 120px', gap: 16, alignItems: 'center', padding: '14px 20px', cursor: 'pointer' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 13 }}>#{order.orderNumber}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{order.customerName}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, opacity: 0.5 }}>{order.customerPhone}</div>
                    </div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, opacity: 0.7, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {order.deliveryAddress}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 14 }}>
                      Bs. {order.total?.toLocaleString()}
                    </div>
                    <StatusPill status={order.status} statusConfig={STATUS_CONFIG} />
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, opacity: 0.45 }}>{fmt(order.createdAt)}</div>
                  </div>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div style={{ borderTop: '1px solid var(--rule)', padding: '16px 20px', background: 'var(--bone-2)', display: 'grid', gridTemplateColumns: '1fr auto', gap: 24 }}>
                      <div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.45, marginBottom: 10 }}>Productos</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {order.items?.map((item, i) => (
                            <div key={i} style={{ marginBottom: 4 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                                <span>
                                  <strong>{item.quantity}×</strong> {item.name}
                                  {item.variant && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, opacity: 0.6 }}> ({item.variant})</span>}
                                </span>
                                <span style={{ fontFamily: 'var(--font-mono)' }}>Bs. {item.totalPrice?.toLocaleString()}</span>
                              </div>
                              {item.notes && features.itemNotes && (
                                <div style={{ fontSize: 11, opacity: 0.55, fontStyle: 'italic', paddingLeft: 20 }}>📝 {item.notes}</div>
                              )}
                            </div>
                          ))}
                          <div style={{ borderTop: '1px solid var(--rule)', marginTop: 6, paddingTop: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, opacity: 0.6 }}>
                              <span>Subtotal</span>
                              <span style={{ fontFamily: 'var(--font-mono)' }}>Bs. {order.subtotal?.toLocaleString()}</span>
                            </div>
                            {order.deliveryCost > 0 && (
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, opacity: 0.6 }}>
                                <span>Delivery</span>
                                <span style={{ fontFamily: 'var(--font-mono)' }}>Bs. {order.deliveryCost?.toLocaleString()}</span>
                              </div>
                            )}
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 700 }}>
                              <span>Total</span>
                              <span style={{ fontFamily: 'var(--font-mono)' }}>Bs. {order.total?.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                        {order.notes && (
                          <div style={{ marginTop: 12, fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 13, opacity: 0.65 }}>
                            📝 {order.notes}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 180 }}>
                        {nextStatus && (
                          <button
                            onClick={() => updateStatus({ id: order._id, status: nextStatus })}
                            style={{ padding: '10px 14px', background: 'var(--voltage)', color: 'var(--carbon)', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-body)', textAlign: 'center' }}>
                            {STATUS_NEXT_LABEL[order.status]}
                          </button>
                        )}
                        {order.status !== 'cancelled' && order.status !== 'delivered' && (
                          <button
                            onClick={() => updateStatus({ id: order._id, status: 'cancelled' })}
                            style={{ padding: '9px 14px', background: 'transparent', color: 'var(--magma)', border: '1px solid var(--magma)', borderRadius: 8, fontWeight: 600, fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                            Cancelar pedido
                          </button>
                        )}
                        {order.estimatedMinutes && order.status !== 'delivered' && order.status !== 'cancelled' && (
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, opacity: 0.5, textAlign: 'center' }}>
                            ⏱ ~{order.estimatedMinutes} min estimados
                          </div>
                        )}
                        {/* Tracking code for store */}
                        {features.trackingCode && order.status === 'shipped' && (
                          <div style={{ marginTop: 4 }}>
                            <input placeholder="Nº de guía de envío" defaultValue={order.trackingCode || ''}
                              style={{ width: '100%', padding: '7px 10px', border: '1px solid var(--rule)', borderRadius: 6, fontSize: 12, fontFamily: 'var(--font-mono)', boxSizing: 'border-box' }}
                              onBlur={e => e.target.value && updateStatus({ id: order._id, status: 'shipped', trackingCode: e.target.value })} />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Orders;
