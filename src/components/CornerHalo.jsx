import React from 'react';

/**
 * CornerHalo — glow decorativo fijo en la esquina superior derecha de la pantalla.
 * Anclado al viewport (position: fixed), detrás del contenido y sin capturar clics.
 */
const CornerHalo = () => (
  <div
    aria-hidden="true"
    style={{
      position: 'fixed', top: -140, right: -140, width: 320, height: 320,
      background: 'var(--voltage)', borderRadius: '50%', opacity: 0.20,
      filter: 'blur(70px)', pointerEvents: 'none', zIndex: 0,
    }}
  />
);

export default CornerHalo;
