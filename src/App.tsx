import { useAppStore } from './store/useAppStore';
import SplashPage from './components/splash/SplashPage';
import Dashboard from './components/dashboard/Dashboard';
import UpdateChecker from './components/UpdateChecker';

export default function App() {
  const route = useAppStore((s) => s.route);
  return (
    <>
      {route === 'splash' ? <SplashPage /> : <Dashboard />}
      <UpdateChecker />
    </>
  );
}
