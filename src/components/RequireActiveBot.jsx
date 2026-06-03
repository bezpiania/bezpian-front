import { Navigate, Outlet } from 'react-router-dom';

/**
 * RequireActiveBot — wraps routes that need an active bot selected.
 * If no activeBotId in localStorage, redirects to /bots.
 */
const RequireActiveBot = () => {
  const activeBotId = localStorage.getItem('activeBotId');
  return activeBotId ? <Outlet /> : <Navigate to="/bots" replace />;
};

export default RequireActiveBot;
