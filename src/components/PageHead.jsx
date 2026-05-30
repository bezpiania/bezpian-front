import React from 'react';

/**
 * Cabecera estándar de una página privada.
 * Reproduce el .page-head del mockup con eyebrow + título + subtítulo + acciones.
 */
const PageHead = ({ eyebrow, title, sub, actions, halo = false }) => (
  <div className={'page-head' + (halo ? ' with-halo' : '')}>
    <div>
      {eyebrow && <div className="page-eyebrow">{eyebrow}</div>}
      {title && <h1 className="page-title">{title}</h1>}
      {sub && <p className="page-sub">{sub}</p>}
    </div>
    {actions && <div className="page-actions">{actions}</div>}
  </div>
);

export default PageHead;
