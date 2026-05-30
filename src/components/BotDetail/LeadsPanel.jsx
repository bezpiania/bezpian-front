import React, { useState, useEffect } from 'react';
import { message, Spin, Drawer } from 'antd';
import Chatbot from '../../services/Chatbot.js';
import instance from '../../apis/app.js';

const LeadsPanel = ({ workspaceId, botId, bot }) => {
  const [showConfig, setShowConfig] = useState(false);
  const [config, setConfig] = useState({
    fields: {
      name: bot?.features?.leadCaptureFields?.name ?? true,
      email: bot?.features?.leadCaptureFields?.email ?? true,
      phone: bot?.features?.leadCaptureFields?.phone ?? false,
      company: bot?.features?.leadCaptureFields?.company ?? false,
    },
    confirmationMessage: bot?.features?.leadConfirmationMessage || 'Gracias por tu información. Nos pondremos en contacto pronto.',
  });

  const [leads, setLeads] = useState([]);
  const [funnel, setFunnel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: null,
    search: '',
    hasQuote: null,
    hasAppointment: null,
  });
  const [selectedLead, setSelectedLead] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // table, kanban

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);
      if (filters.hasQuote !== null) params.append('hasQuote', filters.hasQuote);
      if (filters.hasAppointment !== null) params.append('hasAppointment', filters.hasAppointment);

      const [leadsRes, funnelRes] = await Promise.all([
        Chatbot.get(`/api/workspaces/${workspaceId}/chatbots/${botId}/leads?${params}`),
        Chatbot.get(`/api/workspaces/${workspaceId}/chatbots/${botId}/leads/funnel/stats`)
      ]);

      setLeads(leadsRes.data || []);
      setFunnel(funnelRes.data);
    } catch (error) {
      console.error('Error fetching leads:', error);
      message.error('Error al cargar leads');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (leadId, newStatus) => {
    try {
      await instance.patch(
        `/api/workspaces/${workspaceId}/chatbots/${botId}/leads/${leadId}`,
        { status: newStatus }
      );
      message.success(`Lead actualizado a ${newStatus}`);
      fetchData();
    } catch (error) {
      message.error('Error al actualizar lead');
    }
  };

  const handleFieldToggle = (field) => {
    setConfig(prev => ({
      ...prev,
      fields: { ...prev.fields, [field]: !prev.fields[field] }
    }));
  };

  const handleSaveConfig = async () => {
    try {
      // TODO: Guardar en backend
      message.success('Configuración de Leads guardada');
      setShowConfig(false);
    } catch (error) {
      message.error('Error al guardar configuración');
    }
  };

  const renderMetrics = () => {
    if (!funnel) return null;

    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div style={{ padding: 16, border: '1px solid #e0e0e0', borderRadius: 8 }}>
          <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>Total Leads</div>
          <div style={{ fontSize: 24, fontWeight: 600 }}>{funnel.total}</div>
        </div>
        <div style={{ padding: 16, border: '1px solid #e0e0e0', borderRadius: 8 }}>
          <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>Nuevos</div>
          <div style={{ fontSize: 24, fontWeight: 600 }}>{funnel.byStatus.new}</div>
        </div>
        <div style={{ padding: 16, border: '1px solid #e0e0e0', borderRadius: 8 }}>
          <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>Contactados</div>
          <div style={{ fontSize: 24, fontWeight: 600 }}>{funnel.byStatus.contacted}</div>
        </div>
        <div style={{ padding: 16, border: '1px solid #e0e0e0', borderRadius: 8 }}>
          <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>Calificados</div>
          <div style={{ fontSize: 24, fontWeight: 600 }}>{funnel.byStatus.qualified}</div>
        </div>
        <div style={{ padding: 16, border: '1px solid #ffeaa7', borderRadius: 8, backgroundColor: '#fffbf0' }}>
          <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>Ganados</div>
          <div style={{ fontSize: 24, fontWeight: 600, color: '#2ecc71' }}>{funnel.byStatus.won}</div>
        </div>
        <div style={{ padding: 16, border: '1px solid #e0e0e0', borderRadius: 8 }}>
          <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>Win Rate</div>
          <div style={{ fontSize: 24, fontWeight: 600 }}>{funnel.conversions.winRate}%</div>
        </div>
      </div>
    );
  };

  const renderFunnelVisualization = () => {
    if (!funnel) return null;

    const stages = [
      { label: 'Nuevos', value: funnel.byStatus.new, color: '#3498db' },
      { label: 'Contactados', value: funnel.byStatus.contacted, color: '#9b59b6' },
      { label: 'Calificados', value: funnel.byStatus.qualified, color: '#f39c12' },
      { label: 'Ganados', value: funnel.byStatus.won, color: '#2ecc71' }
    ];

    const maxValue = Math.max(...stages.map(s => s.value), 1);

    return (
      <div style={{ marginBottom: 24, padding: 16, border: '1px solid #e0e0e0', borderRadius: 8 }}>
        <div style={{ marginBottom: 16, fontSize: 14, fontWeight: 600 }}>Embudo de Ventas</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {stages.map((stage, idx) => (
            <div key={idx}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13 }}>
                <span>{stage.label}</span>
                <span style={{ fontWeight: 600 }}>{stage.value}</span>
              </div>
              <div style={{ height: 20, backgroundColor: '#f0f0f0', borderRadius: 4, overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${(stage.value / maxValue) * 100}%`,
                    backgroundColor: stage.color,
                    transition: 'width 0.3s'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderLeadsTable = () => {
    if (leads.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '40px 20px', opacity: 0.6 }}>
          No hay leads
        </div>
      );
    }

    const statusColors = {
      new: '#3498db',
      contacted: '#9b59b6',
      qualified: '#f39c12',
      won: '#2ecc71',
      lost: '#e74c3c'
    };

    return (
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e0e0e0', backgroundColor: '#fafafa' }}>
              <th style={{ padding: 12, textAlign: 'left' }}>Nombre</th>
              <th style={{ padding: 12, textAlign: 'left' }}>Email</th>
              <th style={{ padding: 12, textAlign: 'left' }}>Empresa</th>
              <th style={{ padding: 12, textAlign: 'left' }}>Estado</th>
              <th style={{ padding: 12, textAlign: 'center' }}>Cotización</th>
              <th style={{ padding: 12, textAlign: 'center' }}>Cita</th>
              <th style={{ padding: 12, textAlign: 'left' }}>Creado</th>
              <th style={{ padding: 12, textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {leads.map(lead => (
              <tr key={lead._id} style={{ borderBottom: '1px solid #e0e0e0', backgroundColor: '#fff' }}>
                <td style={{ padding: 12 }}>
                  <button
                    onClick={() => { setSelectedLead(lead); setShowDetail(true); }}
                    style={{ background: 'none', border: 'none', color: '#0066cc', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}
                  >
                    {lead.name}
                  </button>
                </td>
                <td style={{ padding: 12, opacity: 0.7 }}>{lead.email}</td>
                <td style={{ padding: 12, opacity: 0.7 }}>{lead.company || '-'}</td>
                <td style={{ padding: 12 }}>
                  <select
                    value={lead.status}
                    onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                    style={{
                      padding: '4px 8px',
                      borderRadius: 4,
                      border: `1px solid ${statusColors[lead.status]}`,
                      backgroundColor: statusColors[lead.status],
                      color: '#fff',
                      cursor: 'pointer',
                      fontSize: 12,
                      fontWeight: 500
                    }}
                  >
                    <option value="new">Nuevo</option>
                    <option value="contacted">Contactado</option>
                    <option value="qualified">Calificado</option>
                    <option value="won">Ganado</option>
                    <option value="lost">Perdido</option>
                  </select>
                </td>
                <td style={{ padding: 12, textAlign: 'center', opacity: 0.7 }}>
                  {lead.quoteIds?.length > 0 ? `${lead.quoteIds.length} 📋` : '-'}
                </td>
                <td style={{ padding: 12, textAlign: 'center', opacity: 0.7 }}>
                  {lead.appointmentIds?.length > 0 ? `${lead.appointmentIds.length} 📅` : '-'}
                </td>
                <td style={{ padding: 12, opacity: 0.7, fontSize: 12 }}>
                  {new Date(lead.createdAt).toLocaleDateString()}
                </td>
                <td style={{ padding: 12, textAlign: 'center' }}>
                  <button
                    onClick={() => { setSelectedLead(lead); setShowDetail(true); }}
                    style={{ fontSize: 12, color: '#0066cc', border: 'none', background: 'none', cursor: 'pointer' }}
                  >
                    Ver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <>
      <div className="section-head">
        <div>
          <div className="section-num">Gestión de Leads</div>
          <div className="section-title">Captura y seguimiento de <em>contactos potenciales</em></div>
        </div>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setShowConfig(!showConfig)}
          style={{ marginLeft: 'auto' }}
        >
          {showConfig ? 'Ocultar Configuración' : 'Configurar'}
        </button>
      </div>

      {showConfig && (
        <div className="grid-2-eq" style={{ marginBottom: 24 }}>
          <div className="card">
            <div className="section-num">Campos a capturar</div>
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { key: 'name', label: 'Nombre', required: true },
                { key: 'email', label: 'Email', required: true },
                { key: 'phone', label: 'Teléfono', required: false },
                { key: 'company', label: 'Empresa', required: false },
              ].map(field => (
                <label key={field.key} style={{ display: 'flex', gap: 10, alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={config.fields[field.key]}
                    onChange={() => handleFieldToggle(field.key)}
                    disabled={field.required}
                    style={{ cursor: field.required ? 'not-allowed' : 'pointer' }}
                  />
                  <span>{field.label}</span>
                  {field.required && <span style={{ fontSize: 11, opacity: 0.6 }}>(requerido)</span>}
                </label>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="section-num">Mensaje de confirmación</div>
            <div style={{ marginTop: 12 }}>
              <textarea
                className="textarea"
                value={config.confirmationMessage}
                onChange={(e) => setConfig(prev => ({ ...prev, confirmationMessage: e.target.value }))}
                placeholder="Gracias por tu información..."
                style={{ minHeight: 100 }}
              />
            </div>
          </div>
        </div>
      )}

      {showConfig && (
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginBottom: 24 }}>
          <button className="btn btn-secondary" onClick={() => setShowConfig(false)}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleSaveConfig}>Guardar Configuración</button>
        </div>
      )}

      <Spin spinning={loading}>
        {renderMetrics()}
        {renderFunnelVisualization()}

        <div style={{ marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Buscar por nombre, email, teléfono..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            style={{
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: 4,
              flex: 1,
              minWidth: 200,
              fontSize: 13
            }}
          />
          <select
            value={filters.status || ''}
            onChange={(e) => setFilters({ ...filters, status: e.target.value || null })}
            style={{
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: 4,
              fontSize: 13
            }}
          >
            <option value="">Todos los estados</option>
            <option value="new">Nuevos</option>
            <option value="contacted">Contactados</option>
            <option value="qualified">Calificados</option>
            <option value="won">Ganados</option>
            <option value="lost">Perdidos</option>
          </select>
        </div>

        <div style={{ border: '1px solid #e0e0e0', borderRadius: 8, backgroundColor: '#fff' }}>
          {renderLeadsTable()}
        </div>
      </Spin>

      <Drawer
        title={selectedLead?.name}
        placement="right"
        onClose={() => setShowDetail(false)}
        open={showDetail}
        width={500}
      >
        {selectedLead && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>Email</div>
              <div>{selectedLead.email}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>Teléfono</div>
              <div>{selectedLead.phone || '-'}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>Empresa</div>
              <div>{selectedLead.company || '-'}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>Estado</div>
              <div>{selectedLead.status}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 8 }}>Cotizaciones ({selectedLead.quoteIds?.length || 0})</div>
              {selectedLead.quoteIds?.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {selectedLead.quoteIds.map(qId => (
                    <div key={qId} style={{ padding: 8, backgroundColor: '#f5f5f5', borderRadius: 4, fontSize: 13 }}>
                      Cotización {qId}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ opacity: 0.6, fontSize: 13 }}>Sin cotizaciones</div>
              )}
            </div>
            <div>
              <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 8 }}>Citas ({selectedLead.appointmentIds?.length || 0})</div>
              {selectedLead.appointmentIds?.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {selectedLead.appointmentIds.map(aId => (
                    <div key={aId} style={{ padding: 8, backgroundColor: '#f5f5f5', borderRadius: 4, fontSize: 13 }}>
                      Cita {aId}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ opacity: 0.6, fontSize: 13 }}>Sin citas</div>
              )}
            </div>
            <div>
              <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>Notas</div>
              <textarea
                value={selectedLead.notes || ''}
                onChange={(e) => {
                  const updated = { ...selectedLead, notes: e.target.value };
                  setSelectedLead(updated);
                }}
                placeholder="Agregar notas..."
                style={{
                  padding: 8,
                  border: '1px solid #ddd',
                  borderRadius: 4,
                  minHeight: 80,
                  fontSize: 13
                }}
              />
              <button
                className="btn btn-primary"
                onClick={() => {
                  // TODO: Save notes
                  message.success('Notas guardadas');
                }}
                style={{ marginTop: 12 }}
              >
                Guardar Notas
              </button>
            </div>
          </div>
        )}
      </Drawer>
    </>
  );
};

export default LeadsPanel;
