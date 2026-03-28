import { useEffect } from 'react';
import { useAppStore } from './store/useAppStore';
import { authApi, getAccessToken, clearTokens } from './services/api';
import SplashPage from './components/splash/SplashPage';
import LoginPage from './components/splash/LoginPage';
import ForgotPasswordPage from './components/splash/ForgotPasswordPage';
import RegisterPage from './components/splash/RegisterPage';
import Dashboard from './components/dashboard/Dashboard';
import UpdateChecker from './components/UpdateChecker';

export default function App() {
  const route = useAppStore((s) => s.route);

  // Session restore on mount
  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;

    authApi.me()
      .then(async (user) => {
        const store = useAppStore.getState();
        store.setUser(user);
        useAppStore.setState({
          currentUser: {
            id: user.id,
            username: user.email.split('@')[0],
            name: user.name,
            role: user.role,
            avatar: '#06B6D4',
            isOnline: true,
          },
          route: 'home',
        });
        await store.loadData();
      })
      .catch(() => {
        clearTokens();
        useAppStore.setState({ route: 'splash' });
      });
  }, []);

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
