import React, { useState } from 'react';
import AppLayout from '../../../components/AppLayout.jsx';

const Toggle = ({ on, onClick }) => (
  <div
    onClick={onClick}
    style={{
      width: 36,
      height: 22,
      background: on ? 'var(--carbon)' : 'var(--rule-strong)',
      borderRadius: 999,
      position: 'relative',
      cursor: 'pointer',
    }}
  >
    <div
      style={{
        position: 'absolute',
        top: 3,
        [on ? 'right' : 'left']: 3,
        width: 16,
        height: 16,
        background: on ? 'var(--voltage)' : 'var(--bone)',
        borderRadius: '50%',
      }}
    />
  </div>
);

const NOTIFS = [
  { id: 'lead', title: 'Nuevo lead capturado', desc: 'Cuando un bot consiga datos de contacto.', defaultOn: true },
  { id: 'quote', title: 'Cotización aceptada', desc: 'Cuando alguien acepta una cotización tuya.', defaultOn: true },
  { id: 'weekly', title: 'Resumen semanal', desc: 'Cada lunes con stats y tips.', defaultOn: true },
  { id: 'news', title: 'Tips y novedades del producto', desc: 'Solo cuando es importante. Nunca somos pesados.', defaultOn: false },
];

const Profile = () => {
  const [notifs, setNotifs] = useState(() =>
    NOTIFS.reduce((acc, n) => ({ ...acc, [n.id]: n.defaultOn }), {})
  );

  return (
    <AppLayout>
      <div className="page-head">
        <div>
          <div className="page-eyebrow"><span>Mi cuenta</span></div>
          <h1 className="page-title">Tu <em>perfil.</em></h1>
          <p className="page-sub">
            Datos personales, contraseña, preferencias. Lo de tu workspace está en otra parte.
          </p>
        </div>
      </div>

      <div className="page-body" style={{ maxWidth: 760 }}>
        {/* Foto + datos */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="section-num" style={{ marginBottom: 14 }}>Foto y datos básicos</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 24 }}>
            <div style={{ width: 72, height: 72, background: 'var(--voltage)', color: 'var(--carbon)', borderRadius: '50%', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 30 }}>SR</div>
            <div>
              <button className="btn btn-ghost btn-sm">
                <svg><use href="#i-upload" /></svg>Cambiar foto
              </button>
              <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 12.5, opacity: 0.65, marginTop: 6 }}>
                JPG o PNG, máx 2 MB. Cuadrada se ve mejor.
              </div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div className="field" style={{ margin: 0 }}>
              <div className="field-label">Nombre</div>
              <input type="text" className="input" defaultValue="Sebastián" />
            </div>
            <div className="field" style={{ margin: 0 }}>
              <div className="field-label">Apellido</div>
              <input type="text" className="input" defaultValue="Rojas" />
            </div>
          </div>
          <div className="field">
            <div className="field-label">Email</div>
            <input type="email" className="input" defaultValue="hola@acme.cl" />
            <div className="field-hint">Si cambias el email, te pedimos verificarlo de nuevo.</div>
          </div>
          <div className="field" style={{ margin: 0 }}>
            <div className="field-label">Teléfono <span className="req">Opcional</span></div>
            <input type="tel" className="input" defaultValue="+56 9 8421 9921" />
            <div className="field-hint">Para que el equipo te pueda contactar si hay un problema con la cuenta.</div>
          </div>
        </div>

        {/* Contraseña */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="section-num" style={{ marginBottom: 14 }}>Contraseña</div>
          <div className="field">
            <div className="field-label">Contraseña actual</div>
            <input type="password" className="input" placeholder="••••••••" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="field" style={{ margin: 0 }}>
              <div className="field-label">Nueva contraseña</div>
              <input type="password" className="input" placeholder="Mínimo 8 caracteres" />
            </div>
            <div className="field" style={{ margin: 0 }}>
              <div className="field-label">Confirmar</div>
              <input type="password" className="input" placeholder="Otra vez" />
            </div>
          </div>
        </div>

        {/* Notifs */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="section-num" style={{ marginBottom: 14 }}>Notificaciones por email</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {NOTIFS.map((n, i) => (
              <div
                key={n.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 0',
                  borderBottom: i < NOTIFS.length - 1 ? '1px solid var(--rule)' : 'none',
                }}
              >
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14 }}>{n.title}</div>
                  <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 12.5, opacity: 0.65 }}>{n.desc}</div>
                </div>
                <Toggle on={notifs[n.id]} onClick={() => setNotifs((s) => ({ ...s, [n.id]: !s[n.id] }))} />
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginBottom: 32 }}>
          <button className="btn btn-ghost">Descartar cambios</button>
          <button className="btn btn-primary">
            <svg><use href="#i-check" /></svg>Guardar
          </button>
        </div>

        {/* Danger zone */}
        <div style={{ background: 'var(--bone-2)', border: '1px solid rgba(255, 77, 31, 0.3)', borderRadius: 12, padding: '18px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 18 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14.5, color: 'var(--magma)' }}>Cerrar tu cuenta</div>
            <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 13, opacity: 0.7, lineHeight: 1.4, marginTop: 2 }}>
              Borra todos tus datos, bots y conversaciones. <em>No hay marcha atrás.</em>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" style={{ color: 'var(--magma)', borderColor: 'rgba(255, 77, 31, 0.3)' }}>
            <svg><use href="#i-trash" /></svg>Eliminar cuenta
          </button>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;
