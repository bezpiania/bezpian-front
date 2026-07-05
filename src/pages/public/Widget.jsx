import React from 'react';

/**
 * Vista del widget que el visitante ve en el sitio del cliente.
 * Es una pantalla "demo" — muestra un sitio fake con el widget abierto.
 */
const Widget = () => (
  <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #1B2C5C 0%, #15140F 100%)', padding: '48px 32px', position: 'relative', overflow: 'hidden' }}>
    <style>
      {`@keyframes bounce {
        0%, 60%, 100% { transform: translateY(0); opacity: 0.3; }
        30% { transform: translateY(-4px); opacity: 0.9; }
      }`}
    </style>
    <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative' }}>
      {/* Browser frame */}
      <div style={{ background: 'var(--bone)', borderRadius: 14, overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.4), 0 6px 18px rgba(0,0,0,0.25)', position: 'relative' }}>
        <div style={{ background: 'var(--bone-2)', padding: '12px 14px', borderBottom: '1px solid var(--rule)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <span style={{ width: 11, height: 11, borderRadius: '50%', background: 'var(--rule-strong)' }}></span>
            <span style={{ width: 11, height: 11, borderRadius: '50%', background: 'var(--rule-strong)' }}></span>
            <span style={{ width: 11, height: 11, borderRadius: '50%', background: 'var(--rule-strong)' }}></span>
          </div>
          <div style={{ flex: 1, background: 'var(--bone)', borderRadius: 6, padding: '6px 12px', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.05em', opacity: 0.7, marginLeft: 8 }}>🔒 tienda-acme.cl</div>
        </div>

        <div style={{ padding: '48px 56px', minHeight: 560, position: 'relative' }}>
          {/* Sitio fake */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 48 }}>
            <div style={{ width: 32, height: 32, background: 'var(--voltage)', borderRadius: 8, display: 'grid', placeItems: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18 }}>A</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, letterSpacing: '-0.025em' }}>Tienda Acme</div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 24, fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 13.5, opacity: 0.7 }}>
              <span>Catálogo</span><span>Nosotros</span><span>Contacto</span>
            </div>
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 56, lineHeight: 1.02, letterSpacing: '-0.035em', marginBottom: 18, maxWidth: '14ch' }}>
            Ropa urbana <em style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontWeight: 400 }}>hecha</em> en Chile.
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 16, opacity: 0.7, maxWidth: '48ch', marginBottom: 36, lineHeight: 1.5 }}>
            Polerones, poleras y pantalones diseñados y confeccionados en Santiago. Envío a todo el país.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
            {['Producto 1', 'Producto 2', 'Producto 3'].map((p) => (
              <div key={p} style={{ aspectRatio: 1, background: 'var(--bone-2)', border: '1px solid var(--rule)', borderRadius: 10, display: 'grid', placeItems: 'center', fontFamily: 'var(--font-display)', fontWeight: 600, opacity: 0.4 }}>
                {p}
              </div>
            ))}
          </div>

          {/* Widget abierto */}
          <div style={{ position: 'absolute', bottom: 28, right: 28, width: 380, background: 'var(--bone)', borderRadius: 18, boxShadow: '0 30px 80px rgba(0,0,0,0.25), 0 6px 16px rgba(0,0,0,0.12)', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ background: 'var(--voltage)', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--rule)' }}>
              <div style={{ width: 38, height: 38, background: 'var(--carbon)', color: 'var(--voltage)', borderRadius: '50%', display: 'grid', placeItems: 'center', fontSize: 20 }}>🛍️</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15, letterSpacing: '-0.01em' }}>Zapi</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.7, display: 'flex', alignItems: 'center', gap: 5, marginTop: 1 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)' }}></span>
                  En línea · responde al toque
                </div>
              </div>
              <button style={{ width: 28, height: 28, background: 'rgba(21,20,15,0.1)', border: 'none', borderRadius: 7, cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
                <svg style={{ width: 14, height: 14 }}><use href="#i-close" /></svg>
              </button>
            </div>

            {/* Body */}
            <div style={{ background: 'var(--bone)', padding: '20px 18px', display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 380, overflowY: 'auto' }}>
              <div style={{ alignSelf: 'flex-start', maxWidth: '85%', background: 'var(--bone-2)', padding: '11px 14px', fontSize: 13.5, lineHeight: 1.5, borderRadius: '14px 14px 14px 4px' }}>
                ¡Hola! Soy Zapi 🛍️ Te ayudo a encontrar lo que buscas. ¿En qué andas?
              </div>

              <div style={{ alignSelf: 'flex-start', display: 'flex', flexWrap: 'wrap', gap: 6, maxWidth: '90%' }}>
                {['Ver catálogo', 'Cotizar', 'Despacho'].map((q) => (
                  <button key={q} style={{ background: 'var(--bone)', border: '1px solid var(--rule-strong)', borderRadius: 999, padding: '7px 14px', fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 12.5, cursor: 'pointer' }}>
                    {q}
                  </button>
                ))}
              </div>

              <div style={{ alignSelf: 'flex-end', maxWidth: '85%', background: 'var(--voltage)', padding: '11px 14px', fontSize: 13.5, lineHeight: 1.5, borderRadius: '14px 14px 4px 14px', fontWeight: 500 }}>
                Busco polerones M en negro
              </div>

              <div style={{ alignSelf: 'flex-start', maxWidth: '90%', background: 'var(--bone-2)', padding: '11px 14px', fontSize: 13.5, lineHeight: 1.5, borderRadius: '14px 14px 14px 4px' }}>
                ¡Genial! Tengo 4 modelos en talla M negro. Te muestro los favoritos:
              </div>

              <div style={{ alignSelf: 'flex-start', maxWidth: '90%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div style={{ background: 'var(--bone-2)', border: '1px solid var(--rule)', borderRadius: 10, overflow: 'hidden', cursor: 'pointer' }}>
                  <div style={{ aspectRatio: 1, background: 'var(--carbon)', position: 'relative' }}>
                    <span style={{ position: 'absolute', top: 6, right: 6, background: 'var(--voltage)', color: 'var(--carbon)', fontFamily: 'var(--font-mono)', fontSize: 8.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 6px', borderRadius: 4 }}>Top</span>
                  </div>
                  <div style={{ padding: '8px 10px' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 11.5, lineHeight: 1.2 }}>Polerón oversize</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, marginTop: 3 }}>$29.900</div>
                  </div>
                </div>
                <div style={{ background: 'var(--bone-2)', border: '1px solid var(--rule)', borderRadius: 10, overflow: 'hidden', cursor: 'pointer' }}>
                  <div style={{ aspectRatio: 1, background: '#2A2922' }}></div>
                  <div style={{ padding: '8px 10px' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 11.5, lineHeight: 1.2 }}>Polerón clásico</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, marginTop: 3 }}>$24.900</div>
                  </div>
                </div>
              </div>

              <div style={{ alignSelf: 'flex-start', background: 'var(--bone-2)', padding: '11px 16px', borderRadius: '14px 14px 14px 4px', display: 'inline-flex', gap: 4 }}>
                <span style={{ width: 6, height: 6, background: 'var(--carbon)', borderRadius: '50%', opacity: 0.3, animation: 'bounce 1.2s ease-in-out infinite' }}></span>
                <span style={{ width: 6, height: 6, background: 'var(--carbon)', borderRadius: '50%', opacity: 0.3, animation: 'bounce 1.2s ease-in-out 0.2s infinite' }}></span>
                <span style={{ width: 6, height: 6, background: 'var(--carbon)', borderRadius: '50%', opacity: 0.3, animation: 'bounce 1.2s ease-in-out 0.4s infinite' }}></span>
              </div>
            </div>

            {/* Input */}
            <div style={{ borderTop: '1px solid var(--rule)', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bone)' }}>
              <input style={{ flex: 1, background: 'var(--bone-2)', border: '1px solid transparent', borderRadius: 999, padding: '10px 14px', fontFamily: 'var(--font-body)', fontSize: 13.5, color: 'var(--carbon)' }} placeholder="Escribe tu mensaje…" />
              <button style={{ width: 36, height: 36, background: 'var(--voltage)', border: 'none', borderRadius: '50%', cursor: 'pointer', display: 'grid', placeItems: 'center', color: 'var(--carbon)' }}>
                <svg style={{ width: 15, height: 15 }}><use href="#i-send" /></svg>
              </button>
            </div>

            <div style={{ padding: '8px 14px', textAlign: 'center', background: 'var(--bone-2)', borderTop: '1px solid var(--rule)', fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.55 }}>
              Con tecnología de <strong style={{ fontWeight: 700 }}>Øpia</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Caption */}
      <div style={{ textAlign: 'center', marginTop: 32, color: 'var(--bone)' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--voltage)', opacity: 0.8, marginBottom: 8 }}>
          Vista del visitante
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 22, letterSpacing: '-0.02em' }}>
          Así lo ve tu cliente <em style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontWeight: 400, color: 'var(--voltage)' }}>en tu sitio.</em>
        </div>
        <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 14, opacity: 0.6, marginTop: 6, maxWidth: '54ch', marginLeft: 'auto', marginRight: 'auto' }}>
          El widget vive en la esquina del sitio del cliente. Sin instalación, sin cuentas. Solo entra y conversa.
        </div>
      </div>
    </div>
  </div>
);

export default Widget;
