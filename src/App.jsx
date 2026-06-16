import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import IconSprite from './components/IconSprite.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import RequireActiveBot from './components/RequireActiveBot.jsx';

// Públicas
import Login from './pages/public/Login.jsx';
import Signup from './pages/public/Signup.jsx';
import Legal from './pages/public/Legal.jsx';
import VerifyEmail from './pages/public/VerifyEmail.jsx';
import ForgotPassword from './pages/public/ForgotPassword.jsx';
import Widget from './pages/public/Widget.jsx';
import AcceptInvite from './pages/public/AcceptInvite.jsx';
import TableOrder from './pages/public/TableOrder.jsx';
import PublicQuote from './pages/public/PublicQuote.jsx';
import FullChat from './pages/public/FullChat.jsx';
import GoogleCallback from './pages/public/GoogleCallback.jsx';

// Privadas
import BotSelector from './pages/private/chatbots/BotSelector.jsx';
import Dashboard from './pages/private/Dashboard.jsx';
import BotsList from './pages/private/chatbots/BotsList.jsx';
import BotDetail from './pages/private/chatbots/BotDetail.jsx';
import BotEmbed from './pages/private/chatbots/BotEmbed.jsx';
import Nuevo from './pages/private/chatbots/Nuevo.jsx';
import Conversations from './pages/private/operacion/Conversations.jsx';
import ConversationDetail from './pages/private/operacion/ConversationDetail.jsx';
import Leads from './pages/private/operacion/Leads.jsx';
import Appointments from './pages/private/operacion/Appointments.jsx';
import Orders from './pages/private/operacion/Orders.jsx';
import Quotes from './pages/private/operacion/Quotes.jsx';
import QuoteDetail from './pages/private/operacion/QuoteDetail.jsx';
import Team from './pages/private/cuenta/Team.jsx';
import Integrations from './pages/private/cuenta/Integrations.jsx';
import Billing from './pages/private/cuenta/Billing.jsx';
import Profile from './pages/private/cuenta/Profile.jsx';

function App() {
  return (
    <>
      <IconSprite />
      <Router>
        <Routes>
          {/* ── Públicas ──────────────────────────────────────── */}
          <Route path="/login"                   element={<Login />} />
          <Route path="/signup"                  element={<Signup />} />
          <Route path="/auth/google/success"     element={<GoogleCallback />} />
          <Route path="/verificar-email" element={<VerifyEmail />} />
          <Route path="/invitar"         element={<AcceptInvite />} />
          <Route path="/recuperar"       element={<ForgotPassword />} />
          <Route path="/terminos"        element={<Legal doc="terms" />} />
          <Route path="/privacidad"      element={<Legal doc="privacy" />} />
          <Route path="/mesa/:tableToken" element={<TableOrder />} />
          <Route path="/chat/:embedKey"   element={<FullChat />} />
          <Route path="/widget"          element={<Widget />} />
          <Route path="/cotizacion/:id"  element={<PublicQuote />} />
          <Route path="/cotizacion-publica" element={<PublicQuote />} />

          {/* ── Privadas (requieren login) ────────────────────── */}
          <Route element={<PrivateRoute />}>

            {/* Bot selector — landing tras login */}
            <Route path="/bots" element={<BotSelector />} />

            {/* Configuración de chatbots — no requieren bot activo */}
            <Route path="/chatbots"           element={<BotsList />} />
            <Route path="/chatbots/nuevo"     element={<Nuevo />} />
            <Route path="/chatbots/:id"       element={<BotDetail />} />
            <Route path="/chatbots/:id/embed" element={<BotEmbed />} />

            {/* Cuenta — no requieren bot activo */}
            <Route path="/equipo"       element={<Team />} />
            <Route path="/integraciones"element={<Integrations />} />
            <Route path="/plan"         element={<Billing />} />
            <Route path="/perfil"       element={<Profile />} />

            {/* ── Operación — requieren bot activo ────────────── */}
            <Route element={<RequireActiveBot />}>
              <Route path="/dashboard"              element={<Dashboard />} />
              <Route path="/conversaciones"         element={<Conversations />} />
              <Route path="/conversaciones/:id"     element={<ConversationDetail />} />
              <Route path="/leads"                  element={<Leads />} />
              <Route path="/citas"                  element={<Appointments />} />
              <Route path="/ventas"                 element={<Orders />} />
              <Route path="/cotizaciones"           element={<Quotes />} />
              <Route path="/cotizaciones/:id"       element={<QuoteDetail />} />
            </Route>
          </Route>

          {/* Fallback → selector de bots */}
          <Route path="*" element={<Navigate to="/bots" />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
