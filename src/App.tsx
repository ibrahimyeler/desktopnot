import { useAppStore } from './store/useAppStore';
import SplashPage from './components/splash/SplashPage';
import LoginPage from './components/splash/LoginPage';
import ForgotPasswordPage from './components/splash/ForgotPasswordPage';
import RegisterPage from './components/splash/RegisterPage';
import Dashboard from './components/dashboard/Dashboard';
import UpdateChecker from './components/UpdateChecker';

export default function App() {
  const route = useAppStore((s) => s.route);

  const Page = route === 'splash' ? SplashPage
    : route === 'login' ? LoginPage
    : route === 'forgot-password' ? ForgotPasswordPage
    : route === 'register' ? RegisterPage
    : Dashboard;

  return (
    <>
      <Page />
      <UpdateChecker />
    </>
  );
}
