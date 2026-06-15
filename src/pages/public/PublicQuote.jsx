import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { message } from 'antd';
import Quote from '../../services/Quote.js';

/**
 * Cotización pública · vista del cliente final.
 * Es una pantalla sin sidebar — el cliente accede por un link tipo zapien.cl/q/XXX.
 */
const PublicQuote = () => {
  const { id: shareToken } = useParams();
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        setLoading(true);
        // Get by shareToken (no workspace auth needed for public link)
        const response = await Quote.getByShareToken(shareToken);
        if (response.data && response.data._id) {
          setQuote(response.data);
        } else {
          message.error('Cotización no encontrada');
        }
      } catch (error) {
        console.error('Error fetching quote:', error);
        message.error('No se pudo cargar la cotización');
      } finally {
        setLoading(false);
      }
    };

    if (shareToken) {
      fetchQuote();
    }
  }, [shareToken]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bone-2)', padding: '48px 24px', display: 'grid', placeItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 12 }}>Cargando cotización...</div>
        </div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bone-2)', padding: '48px 24px', display: 'grid', placeItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--red)' }}>Cotización no encontrada</div>
        </div>
      </div>
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

  const getInitial = (name) => {
    return (name || '?').charAt(0).toUpperCase();
  };

  const expiryDate = quote.expiresAt ? new Date(quote.expiresAt).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' }) : '—';

  return (
  <div style={{ minHeight: '100vh', background: 'var(--bone-2)', padding: '48px 24px' }}>
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      {/* Topbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, background: 'var(--voltage)', borderRadius: 9, display: 'grid', placeItems: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, letterSpacing: '-0.05em' }}>
            {getInitial(quote.companySummary?.name)}
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 19, letterSpacing: '-0.025em' }}>
            {quote.companySummary?.name || 'Mi Empresa'}
          </div>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.5, display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg style={{ width: 12, height: 12, color: 'var(--green)' }}><use href="#i-lock" /></svg>
          Link seguro · {shareToken?.slice(0, 8)}
        </div>
      </div>

      {/* Card principal */}
      <div style={{ background: 'var(--bone)', borderRadius: 18, boxShadow: '0 24px 60px rgba(0,0,0,0.06)', overflow: 'hidden', border: '1px solid var(--rule)' }}>
        {/* Header */}
        <div style={{ background: 'var(--carbon)', color: 'var(--bone)', padding: '36px 40px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -80, top: -80, width: 280, height: 280, background: 'var(--voltage)', borderRadius: '50%', opacity: 0.18, filter: 'blur(80px)' }}></div>
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--voltage)', opacity: 0.8, marginBottom: 10 }}>
                Cotización · {quote.quoteNumber || 'SIN N°'}
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 36, letterSpacing: '-0.035em', lineHeight: 1.05 }}>
                Hola, {quote.customerData?.name || 'Cliente'} 👋
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 16, opacity: 0.8, lineHeight: 1.45, marginTop: 6, maxWidth: '44ch' }}>
                Acá está la cotización que te armó{' '}
                <strong style={{ fontStyle: 'normal', fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--voltage)' }}>Pielo</strong>.
                Revísala con calma y avísanos cuando quieras avanzar.
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.55, marginBottom: 4 }}>Total</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 42, letterSpacing: '-0.035em', background: 'var(--voltage)', color: 'var(--carbon)', padding: '6px 14px', borderRadius: 8, display: 'inline-block' }}>
                {formatCurrency(quote.total)}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.06em', opacity: 0.6, marginTop: 6 }}>Válida hasta {expiryDate}</div>
            </div>
          </div>
        </div>

        {/* Detalle */}
        <div style={{ padding: '32px 40px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.55, marginBottom: 14 }}>Detalle</div>

          <div style={{ background: 'var(--bone-2)', border: '1px solid var(--rule)', borderRadius: 12, overflow: 'hidden', marginBottom: 24 }}>
            {quote.items && quote.items.map((item, idx) => (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: '60px 1fr auto', gap: 14, padding: '16px 18px', alignItems: 'center', borderTop: idx > 0 ? '1px solid var(--rule)' : 'none' }}>
                <div style={{ width: 60, height: 60, background: 'var(--carbon)', borderRadius: 8, display: 'grid', placeItems: 'center', color: 'var(--voltage)', fontSize: 24 }}>
                  {item.emoji || '📦'}
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15, letterSpacing: '-0.005em' }}>
                    {item.name || item.description}
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 13, opacity: 0.7, marginTop: 2 }}>
                    {item.quantity} unidad{item.quantity !== 1 ? 'es' : ''}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, opacity: 0.55 }}>
                    {item.quantity} × {formatCurrency(item.unitPrice)}
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, letterSpacing: '-0.02em', marginTop: 2 }}>
                    {formatCurrency((item.unitPrice || 0) * (item.quantity || 0))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ minWidth: 280 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontFamily: 'var(--font-body)', fontSize: 14, opacity: 0.75 }}>
                <span>Subtotal</span><span style={{ fontFamily: 'var(--font-mono)' }}>{formatCurrency(quote.subtotal || quote.total)}</span>
              </div>
              {quote.tax && quote.tax > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontFamily: 'var(--font-body)', fontSize: 14, opacity: 0.75 }}>
                  <span>IVA (19%)</span><span style={{ fontFamily: 'var(--font-mono)' }}>{formatCurrency(quote.tax)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0 0', marginTop: 8, borderTop: '2px solid var(--carbon)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, letterSpacing: '-0.025em' }}>
                <span>Total</span><span style={{ background: 'var(--voltage)', padding: '2px 10px', borderRadius: 6 }}>{formatCurrency(quote.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ background: 'var(--bone-2)', padding: '28px 40px', borderTop: '1px solid var(--rule)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 19, letterSpacing: '-0.02em', marginBottom: 4 }}>
              ¿Vamos por <em style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontWeight: 400 }}>esta cotización?</em>
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 13.5, opacity: 0.7, lineHeight: 1.45 }}>
              Si aceptas, te contactamos para coordinar pago y entrega.
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
            <button className="btn btn-ghost">Tengo dudas</button>
            <button className="btn btn-voltage" style={{ padding: '13px 22px', fontSize: 15 }}>
              <svg><use href="#i-check" /></svg>
              Aceptar cotización
            </button>
          </div>
        </div>
      </div>

      {/* Footer info */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18, marginTop: 32 }}>
        <div style={{ background: 'var(--bone)', border: '1px solid var(--rule)', borderRadius: 12, padding: 18, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div style={{ width: 36, height: 36, background: 'var(--voltage)', borderRadius: 9, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
            <svg style={{ width: 18, height: 18 }}><use href="#i-clock" /></svg>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13.5 }}>Vence el {expiryDate}</div>
            <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 12.5, opacity: 0.7, marginTop: 2, lineHeight: 1.4 }}>
              Después de esa fecha los precios pueden variar.
            </div>
          </div>
        </div>
        <div style={{ background: 'var(--bone)', border: '1px solid var(--rule)', borderRadius: 12, padding: 18, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div style={{ width: 36, height: 36, background: 'var(--bone-2)', border: '1px solid var(--rule)', borderRadius: 9, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
            <svg style={{ width: 18, height: 18 }}><use href="#i-download" /></svg>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13.5 }}>Descarga el PDF</div>
            <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 12.5, opacity: 0.7, marginTop: 2, lineHeight: 1.4 }}>
              <a style={{ cursor: 'pointer', borderBottom: '1px solid var(--voltage)' }}>{quote.quoteNumber || 'COT'}.pdf</a> · disponible
            </div>
          </div>
        </div>
        <div style={{ background: 'var(--bone)', border: '1px solid var(--rule)', borderRadius: 12, padding: 18, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div style={{ width: 36, height: 36, background: 'var(--bone-2)', border: '1px solid var(--rule)', borderRadius: 9, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
            <svg style={{ width: 18, height: 18 }}><use href="#i-mail" /></svg>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13.5 }}>Tienes dudas</div>
            <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 12.5, opacity: 0.7, marginTop: 2, lineHeight: 1.4 }}>
              Escríbenos a <a style={{ cursor: 'pointer', borderBottom: '1px solid var(--voltage)' }} href={`mailto:${quote.companySummary?.email || 'hola@empresa.cl'}`}>
                {quote.companySummary?.email || 'hola@empresa.cl'}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Powered by */}
      <div style={{ textAlign: 'center', marginTop: 36, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.45 }}>
        Con tecnología de <strong style={{ fontWeight: 700 }}>Pielo</strong> · vende mientras duermes
      </div>
    </div>
  </div>
  );
};

export default PublicQuote;
