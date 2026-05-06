import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../state/AppContext.jsx';

export default function RequireAuth({ children }) {
  const { user } = useApp();
  const loc = useLocation();
  if (!user) {
    const next = encodeURIComponent(loc.pathname + loc.search);
    return <Navigate to={`/signin?next=${next}`} replace />;
  }
  return children;
}
