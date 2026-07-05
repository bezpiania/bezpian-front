import React, { useState } from 'react';
import AppLayout from '../../components/AppLayout.jsx';
import useStatus from '../../hooks/useStatus.js';

/**
 * Dashboard · 01 · Inicio del workspace
 * Réplica del data-screen-id="dashboard" del mockup.
 * Usa el hook useStatus para mantener el flujo Page → Hook → Service → API
 * (no bloquea el render: si falla, igual renderiza el dashboard con sus datos demo).
 */
const Dashboard = () => {
  const [showTip, setShowTip] = useState(true);
  // Se llama el hook por convención de arquitectura. No bloquea el render.
  useStatus();

  return (
    <AppLayout>
      <div className="page-head with-halo">
        <div>
          <div className="page-eyebrow">
            <span>Panel · Últimos 7 días</span>
            <span className="dot"></span>
            <span>Lunes 11 may, 10:19</span>
          </div>
          <h1 className="page-title">
            Buenos días, <em>Sebastián.</em>
          </h1>
          <p className="page-sub">
            Tus bots tuvieron <strong>32% más conversaciones</strong> que la semana pasada. Mientras dormías atendieron 8 clientes y cerraron 2 cotizaciones.
          </p>
        </div>
      </div>

      <div className="page-body">
        {/* KPIs */}
        <div className="kpis">
          <div className="kpi voltage">
            <div className="kpi-label">Conversaciones</div>
            <div className="kpi-value">847</div>
            <div>
              <span className="kpi-delta up">+32%</span>
              <span className="kpi-foot" style={{ display: 'inline' }}>vs. semana anterior</span>
            </div>
          </div>
          <div className="kpi">
            <div className="kpi-label">Cotizaciones</div>
            <div className="kpi-value">23</div>
            <div>
              <span className="kpi-delta up">+18%</span>
              <span className="kpi-foot" style={{ display: 'inline' }}>8 pendientes de cierre</span>
            </div>
          </div>
          <div className="kpi">
            <div className="kpi-label">Tasa de conversión</div>
            <div className="kpi-value">
              14.2<span className="unit">%</span>
            </div>
            <div>
              <span className="kpi-delta down">−2.1%</span>
              <span className="kpi-foot" style={{ display: 'inline' }}>objetivo: 16%</span>
            </div>
          </div>
          <div className="kpi">
            <div className="kpi-label">Respuesta promedio</div>
            <div className="kpi-value">
              1.4<span className="unit">s</span>
            </div>
            <div>
              <span className="kpi-delta up">−0.3s</span>
              <span className="kpi-foot" style={{ display: 'inline' }}>más rápido que humano</span>
            </div>
          </div>
        </div>

        <div className="grid-2">
          {/* Chart card */}
          <div className="card">
            <div className="section-head">
              <div>
                <div className="section-num">01 · Tráfico</div>
                <div className="section-title">
                  Conversaciones <em>por día</em>
                </div>
              </div>
            </div>
            <div style={{ height: 200 }}>
              <svg viewBox="0 0 600 200" style={{ width: '100%', height: '100%' }} preserveAspectRatio="none">
                <line x1="0" y1="40" x2="600" y2="40" stroke="var(--rule)" />
                <line x1="0" y1="100" x2="600" y2="100" stroke="var(--rule)" />
                <line x1="0" y1="160" x2="600" y2="160" stroke="var(--rule)" />
                <rect x="20" y="100" width="58" height="80" fill="#15140F" />
                <rect x="100" y="80" width="58" height="100" fill="#15140F" />
                <rect x="180" y="90" width="58" height="90" fill="#15140F" />
                <rect x="260" y="60" width="58" height="120" fill="#15140F" />
                <rect x="340" y="70" width="58" height="110" fill="#15140F" />
                <rect x="420" y="20" width="58" height="160" fill="#DCFF1E" stroke="#15140F" strokeWidth="1.5" />
                <rect x="500" y="50" width="58" height="130" fill="#15140F" />
                <text x="49" y="196" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="#15140F" opacity="0.5">L</text>
                <text x="129" y="196" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="#15140F" opacity="0.5">M</text>
                <text x="209" y="196" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="#15140F" opacity="0.5">M</text>
                <text x="289" y="196" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="#15140F" opacity="0.5">J</text>
                <text x="369" y="196" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="#15140F" opacity="0.5">V</text>
                <text x="449" y="196" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="#15140F" opacity="0.5">S</text>
                <text x="529" y="196" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="#15140F" opacity="0.5">D</text>
              </svg>
            </div>
          </div>

          {/* Activity */}
          <div className="card">
            <div className="section-head">
              <div>
                <div className="section-num">02 · En vivo</div>
                <div className="section-title">
                  Lo que <em>pasó hoy</em>
                </div>
              </div>
            </div>
            <div>
              <div className="activity-row">
                <div className="activity-icon voltage"><svg><use href="#i-zap" /></svg></div>
                <div className="activity-text">
                  <strong>Nueva cotización</strong> · <em>Carla L. pidió 3 polerones M</em>
                </div>
                <div className="activity-time">10:04</div>
              </div>
              <div className="activity-row">
                <div className="activity-icon bone"><svg><use href="#i-chat" /></svg></div>
                <div className="activity-text">
                  <strong>Chat cerrado</strong> · <em>cliente quedó conforme</em>
                </div>
                <div className="activity-time">09:48</div>
              </div>
              <div className="activity-row">
                <div className="activity-icon dark"><svg><use href="#i-cal" /></svg></div>
                <div className="activity-text">
                  <strong>Cita agendada</strong> · <em>Andrés P., mañana 11:00</em>
                </div>
                <div className="activity-time">09:12</div>
              </div>
              <div className="activity-row">
                <div className="activity-icon voltage"><svg><use href="#i-money" /></svg></div>
                <div className="activity-text">
                  <strong>Venta cerrada</strong> · <em>$48.900 · cliente fidelizado</em>
                </div>
                <div className="activity-time">08:55</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tip */}
        {showTip && (
        <div className="tip-bar">
          <div className="tip-bar-icon"><svg><use href="#i-zap" /></svg></div>
          <div className="tip-bar-text">
            <strong>Tip de la semana</strong>
            <em>Los bots con al menos 20 productos cargados convierten un 40% más. Súbete a tu catálogo completo.</em>
          </div>
          <button className="tip-bar-close" type="button" onClick={() => setShowTip(false)}>
            <svg><use href="#i-close" /></svg>
          </button>
        </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Dashboard;
