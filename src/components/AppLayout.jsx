import React from 'react';
import Sidebar from './Sidebar.jsx';
import { getActiveBot } from '../hooks/useActiveBot.js';

/**
 * Layout estándar de páginas privadas: sidebar + área de contenido scrollable.
 *
 * Marca blanca (Fase 4): si el que entra es un cliente final (rol 'client') cuyo bot
 * tiene la marca del panel activa, se sobrescribe el color de acento (--voltage) con
 * el color del cliente. El resto de usuarios ve la marca Øpia por defecto.
 */
const AppLayout = ({ children }) => {
  const isClient = (localStorage.getItem('workspaceRole') || 'member') === 'client';
  const brand    = getActiveBot().brand || {};
  const themed   = isClient && brand.enabled && brand.color;
  const style    = themed ? { '--voltage': brand.color, '--voltage-dim': brand.color } : undefined;

  return (
    <div className="app" style={style}>
      <Sidebar />
      <main className="app-main">{children}</main>
    </div>
  );
};

export default AppLayout;
