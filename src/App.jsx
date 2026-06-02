import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import IconSprite from './components/IconSprite.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';

// Públicas
import Login from './pages/public/Login.jsx';
import Signup from './pages/public/Signup.jsx';
import VerifyEmail from './pages/public/VerifyEmail.jsx';
import ForgotPassword from './pages/public/ForgotPassword.jsx';
import Widget from './pages/public/Widget.jsx';
import AcceptInvite from './pages/public/AcceptInvite.jsx';
import PublicQuote from './pages/public/PublicQuote.jsx';

// Privadas
import Dashboard from './pages/private/Dashboard.jsx';
import BotsList from './pages/private/chatbots/BotsList.jsx';
import BotDetail from './pages/private/chatbots/BotDetail.jsx';
import BotEmbed from './pages/private/chatbots/BotEmbed.jsx';
import Nuevo from './pages/private/chatbots/Nuevo.jsx';
import Conversations from './pages/private/operacion/Conversations.jsx';
import ConversationDetail from './pages/private/operacion/ConversationDetail.jsx';
import Leads from './pages/private/operacion/Leads.jsx';
import Appointments from './pages/private/operacion/Appointments.jsx';
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
          {/* Auth & landings públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verificar-email" element={<VerifyEmail />} />
          <Route path="/invitar" element={<AcceptInvite />} />
          <Route path="/recuperar" element={<ForgotPassword />} />

          {/* Cliente final (públicas, simulan vistas embebidas) */}
          <Route path="/widget" element={<Widget />} />
          <Route path="/cotizacion/:id" element={<PublicQuote />} />
          <Route path="/cotizacion-publica" element={<PublicQuote />} />

          {/* Privadas */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/chatbots" element={<BotsList />} />
            <Route path="/chatbots/nuevo" element={<Nuevo />} />
            <Route path="/chatbots/:id" element={<BotDetail />} />
            <Route path="/chatbots/:id/embed" element={<BotEmbed />} />

            <Route path="/conversaciones" element={<Conversations />} />
            <Route path="/conversaciones/:id" element={<ConversationDetail />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/citas" element={<Appointments />} />
            <Route path="/cotizaciones" element={<Quotes />} />
            <Route path="/cotizaciones/:id" element={<QuoteDetail />} />

            <Route path="/equipo" element={<Team />} />
            <Route path="/integraciones" element={<Integrations />} />
            <Route path="/plan" element={<Billing />} />
            <Route path="/perfil" element={<Profile />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
