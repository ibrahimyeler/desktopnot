import { useAppStore } from './store/useAppStore';
import SplashPage from './components/splash/SplashPage';
import Dashboard from './components/dashboard/Dashboard';

export default function App() {
  const route = useAppStore((s) => s.route);
  if (route === 'splash') return <SplashPage />;
  return <Dashboard />;
}
