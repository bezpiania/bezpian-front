import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { message, Spin } from 'antd';
import AppLayout from '../../../components/AppLayout.jsx';
import Quote from '../../../services/Quote.js';

const QuoteDetail = () => {
  const { id } = useParams();
  const workspaceId = localStorage.getItem('workspaceId');
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isResending, setIsResending] = useState(false);
  const [isPdfLoading, setIsPdfLoading] = useState(false);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        setLoading(true);
        console.log('📥 Fetching quote:', { id, workspaceId });
        const response = await Quote.get(id, workspaceId);
        console.log('📤 Quote response:', response.data);

        // El backend retorna { success: true, data: quote }
        const quoteData = response.data?.data || response.data;
        if (quoteData && quoteData._id) {
          setQuote(quoteData);
        } else {
          message.error('No se pudo cargar la cotización');
        }
      } catch (error) {
        console.error('Error fetching quote:', error);
        message.error('No se pudo cargar la cotización');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchQuote();
    }
  }, [id, workspaceId]);

  const copy = async () => {
    try {
      const publicLink = `zapien.cl/cotizacion/${quote?.shareToken || id}`;
      await navigator.clipboard.writeText('https://' + publicLink);
      message.success('Link copiado');
    } catch {
      message.error('No se pudo copiar');
    }
  };

  const handleResend = async () => {
    try {
      setIsResending(true);
      const chatbotId = localStorage.getItem('chatbotId');
      const response = await Quote.resend(workspaceId, chatbotId, id);
      if (response.data?.success) {
        message.success('Cotización reenviada');
        setQuote({ ...quote, sentAt: new Date() });
      }
    } catch (error) {
      console.error('Error resending:', error);
      message.error('Error al reenviar');
    } finally {
      setIsResending(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setIsPdfLoading(true);
      const response = await Quote.getPDF(id);
      if (response.data?.success) {
        message.success('PDF descargado');
        // In production with actual PDF generation
      } else {
        message.info('Generación de PDF aún no disponible');
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      message.error('Error descargando PDF');
    } finally {
      setIsPdfLoading(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '500px' }}>
          <Spin size="large" />
        </div>
      </AppLayout>
    );
  }

  if (!quote) {
    return (
      <AppLayout>
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <p>Cotización no encontrada</p>
          <Link to="/cotizaciones">← Volver a cotizaciones</Link>
        </div>
      </AppLayout>
    );
  }

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
    return new Date(date).toLocaleDateString('es-CL');
  };

  return (
    <AppLayout>
      <div className="page-head" style={{ paddingBottom: 20 }}>
        <div>
          <div className="page-eyebrow">
            <Link to="/cotizaciones" style={{ cursor: 'pointer', borderBottom: '1px solid var(--rule-strong)' }}>Cotizaciones</Link>
            <span className="dot"></span>
            <span>{quote.quoteNumber}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6 }}>
            <h1 className="page-title" style={{ fontSize: 32 }}>
              Cotización <em>#{quote.quoteNumber?.split('-')[0]}</em>
            </h1>
            <span className="pill amber">{quote.status === 'draft' ? 'Borrador' : 'Enviada'} · vista {quote.viewCount || 0} veces</span>
          </div>
        </div>
        <div className="page-actions">
          <button className="btn btn-ghost btn-sm" onClick={copy}>
            <svg><use href="#i-link" /></svg>Copiar link público
          </button>
          <button
            className="btn btn-ghost btn-sm"
            onClick={handleResend}
            disabled={isResending}
            style={{ opacity: isResending ? 0.6 : 1 }}
          >
            <svg><use href="#i-mail" /></svg>{isResending ? 'Reenviando...' : 'Reenviar'}
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleDownloadPDF}
            disabled={isPdfLoading}
            style={{ opacity: isPdfLoading ? 0.6 : 1 }}
          >
            <svg><use href="#i-download" /></svg>{isPdfLoading ? 'Descargando...' : 'Descargar PDF'}
          </button>
        </div>
      </div>

      <div className="page-body">
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 24 }}>
          {/* PDF preview */}
          <div>
            <div className="section-head">
              <div>
                <div className="section-num">PDF · cliente lo vio 2 veces</div>
                <div className="section-title">Lo que <em>recibe el cliente</em></div>
              </div>
              <Link to={`/cotizacion/${quote.shareToken}`} style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 13, cursor: 'pointer', opacity: 0.7, borderBottom: '2px solid var(--voltage)' }}>
                Ver versión pública →
              </Link>
            </div>

            <div style={{ background: 'var(--bone)', border: '1px solid var(--rule)', borderRadius: 14, padding: 48, boxShadow: '0 12px 36px rgba(0,0,0,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 36, borderBottom: '1px solid var(--rule)', paddingBottom: 24 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                    <div style={{ width: 36, height: 36, background: 'var(--voltage)', borderRadius: 9, display: 'grid', placeItems: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18 }}>Z</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, letterSpacing: '-0.02em' }}>Pielo</div>
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, opacity: 0.7, lineHeight: 1.5 }}>
                    Santiago, Chile<br />
                    info@zapien.cl
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.55, marginBottom: 6 }}>Cotización</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 28, letterSpacing: '-0.025em' }}>#{quote.quoteNumber}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, opacity: 0.6, marginTop: 6 }}>Fecha: {formatDate(quote.createdAt)}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, opacity: 0.6 }}>Vence: {formatDate(quote.expiresAt)}</div>
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.55, marginBottom: 6 }}>Para</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16 }}>
                  {quote.customerData?.name || quote.customerData?.visitorMetadata?.name || 'Cliente'}
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, opacity: 0.7 }}>
                  {quote.customerData?.email || quote.customerData?.visitorMetadata?.email || 'email@example.com'}
                  {quote.customerData?.phone && ` · ${quote.customerData.phone}`}
                </div>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 24 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--rule-strong)' }}>
                    <th style={{ textAlign: 'left', padding: '10px 0', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.55 }}>Producto</th>
                    <th style={{ textAlign: 'right', padding: '10px 0', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.55, width: 60 }}>Cant.</th>
                    <th style={{ textAlign: 'right', padding: '10px 0', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.55, width: 100 }}>Unitario</th>
                    <th style={{ textAlign: 'right', padding: '10px 0', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.55, width: 100 }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {quote.items?.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--rule)' }}>
                      <td style={{ padding: '14px 0' }}>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14 }}>{item.name}</div>
                      </td>
                      <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 13 }}>{item.quantity}</td>
                      <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 13 }}>{formatCurrency(item.unitPrice)}</td>
                      <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600 }}>{formatCurrency(item.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ minWidth: 240 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontFamily: 'var(--font-body)', fontSize: 13, opacity: 0.7 }}>
                    <span>Subtotal</span><span style={{ fontFamily: 'var(--font-mono)' }}>{formatCurrency(quote.subtotal)}</span>
                  </div>
                  {quote.tax > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontFamily: 'var(--font-body)', fontSize: 13, opacity: 0.7 }}>
                      <span>IVA (19%)</span><span style={{ fontFamily: 'var(--font-mono)' }}>{formatCurrency(quote.tax)}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', marginTop: 6, borderTop: '2px solid var(--carbon)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, letterSpacing: '-0.02em' }}>
                    <span>Total</span><span style={{ fontFamily: 'var(--font-mono)', background: 'var(--voltage)', padding: '2px 8px', borderRadius: 6 }}>{formatCurrency(quote.total)}</span>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 32, paddingTop: 18, borderTop: '1px solid var(--rule)', fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 12.5, opacity: 0.65, lineHeight: 1.5 }}>
                Esta cotización es válida hasta el {formatDate(quote.expiresAt)}. Generada automáticamente por Pielo.{' '}
                <strong style={{ fontStyle: 'normal', fontFamily: 'var(--font-display)', fontWeight: 600 }}>Cualquier duda escríbenos a info@zapien.cl</strong>.
              </div>
            </div>
          </div>

          {/* Side panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="card">
              <div className="section-num" style={{ marginBottom: 10 }}>Estado</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--rule)' }}>
                  <div style={{ width: 22, height: 22, background: 'var(--green)', color: 'var(--bone)', borderRadius: '50%', display: 'grid', placeItems: 'center' }}>
                    <svg style={{ width: 11, height: 11 }}><use href="#i-check" /></svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13 }}>Generada</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, opacity: 0.5 }}>11 may · 10:18</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--rule)' }}>
                  <div style={{ width: 22, height: 22, background: 'var(--green)', color: 'var(--bone)', borderRadius: '50%', display: 'grid', placeItems: 'center' }}>
                    <svg style={{ width: 11, height: 11 }}><use href="#i-check" /></svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13 }}>Enviada por email</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, opacity: 0.5 }}>11 may · 10:18</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--rule)' }}>
                  <div style={{ width: 22, height: 22, background: 'var(--voltage)', color: 'var(--carbon)', borderRadius: '50%', display: 'grid', placeItems: 'center' }}>
                    <svg style={{ width: 11, height: 11 }}><use href="#i-eye" /></svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13 }}>Vista por el cliente · 2 veces</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, opacity: 0.5 }}>Última: 11 may · 13:42</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', opacity: 0.4 }}>
                  <div style={{ width: 22, height: 22, background: 'var(--rule)', borderRadius: '50%' }}></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 13, fontStyle: 'italic' }}>Pendiente: aceptar o rechazar</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card" style={{ background: 'var(--voltage)', borderColor: 'var(--carbon)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.7, marginBottom: 8 }}>Link público</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, background: 'rgba(21,20,15,0.1)', padding: '8px 10px', borderRadius: 6, marginBottom: 10, wordBreak: 'break-all' }}>
                zapien.cl/q/{quote.shareToken?.substring(0, 8)}
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 12.5, lineHeight: 1.45, fontStyle: 'italic', opacity: 0.85 }}>
                Compártelo por WhatsApp o email.{' '}
                <strong style={{ fontStyle: 'normal', fontFamily: 'var(--font-display)', fontWeight: 600 }}>El cliente puede aceptar con un click.</strong>
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
                <button className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center', fontSize: 12 }} onClick={copy}>
                  <svg><use href="#i-copy" /></svg>Copiar
                </button>
              </div>
            </div>

            <div className="card">
              <div className="section-num" style={{ marginBottom: 8 }}>Origen</div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, lineHeight: 1.5 }}>
                Generada por <strong style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>🤖 Pielo</strong> {quote.conversationId ? (
                  <>
                    desde la conversación{' '}
                    <Link to={`/conversaciones/${quote.conversationId}`} style={{ cursor: 'pointer', borderBottom: '1px solid var(--voltage)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                      #{quote.conversationId?.substring(0, 4).toUpperCase()}
                    </Link>.
                  </>
                ) : (
                  'manualmente.'
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default QuoteDetail;
