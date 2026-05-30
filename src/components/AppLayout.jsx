import React from 'react';
import Sidebar from './Sidebar.jsx';

/**
 * Layout estándar de páginas privadas: sidebar + área de contenido scrollable.
 * Cada página privada lo usa como wrapper para mantener el shell consistente.
 */
const AppLayout = ({ children }) => (
  <div className="app">
    <Sidebar />
    <main className="app-main">{children}</main>
  </div>
);

export default AppLayout;
