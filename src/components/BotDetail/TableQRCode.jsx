import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

const frontendUrl = import.meta.env.VITE_API_APP?.replace(':5001', ':5173') || 'http://localhost:5173';

const TableQRCode = ({ resource }) => {
  const [showQR, setShowQR] = useState(false);
  if (!resource.tableToken) return null;

  const url = `${frontendUrl}/mesa/${resource.tableToken}`;

  const handlePrint = () => {
    const win = window.open('', '_blank');
    win.document.write(`
      <html><head><title>QR ${resource.name}</title>
      <style>body{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;font-family:sans-serif;background:#F4F0E8;}
      h2{margin:0 0 8px;font-size:22px;} p{margin:0 0 20px;opacity:0.6;font-size:13px;}</style></head>
      <body>
        <h2>${resource.name}</h2>
        <p>Escanea para ver el menú y pedir</p>
        <div id="qr"></div>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
        <script>new QRCode(document.getElementById("qr"),{text:"${url}",width:240,height:240});</script>
        <script>setTimeout(()=>window.print(),800)</script>
      </body></html>
    `);
    win.document.close();
  };

  return (
    <div>
      <button className="btn btn-secondary btn-sm" style={{ fontSize: 11 }}
        onClick={() => setShowQR(!showQR)}>
        {showQR ? 'Ocultar QR' : '📱 Ver QR'}
      </button>

      {showQR && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 400 }}
          onClick={() => setShowQR(false)}>
          <div style={{ background: 'var(--bone)', borderRadius: 16, padding: 32, textAlign: 'center', boxShadow: '0 24px 60px rgba(0,0,0,0.2)' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, marginBottom: 4 }}>{resource.name}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, opacity: 0.5, marginBottom: 20 }}>
              Cap. {resource.capacity} · {resource.zoneType !== 'any' ? resource.zoneType : ''}
            </div>
            <div style={{ padding: 16, background: '#fff', borderRadius: 8, display: 'inline-block', marginBottom: 20 }}>
              <QRCodeSVG value={url} size={200} />
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, opacity: 0.4, marginBottom: 20, wordBreak: 'break-all', maxWidth: 260 }}>
              {url}
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button className="btn btn-secondary" onClick={() => setShowQR(false)}>Cerrar</button>
              <button className="btn btn-primary" onClick={handlePrint}>🖨️ Imprimir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableQRCode;
