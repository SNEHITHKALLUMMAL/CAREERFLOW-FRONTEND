import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as ReduxProvider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { store } from '@/redux/store';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthBootstrap } from '@/components/AuthBootstrap';
import { router } from '@/routes/AppRouter';
import 'react-toastify/dist/ReactToastify.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReduxProvider store={store}>
        <ThemeProvider>
          <AuthBootstrap>
            <RouterProvider router={router} />
          </AuthBootstrap>
          <ToastContainer position="top-right" autoClose={4000} theme="colored" />
        </ThemeProvider>
      </ReduxProvider>
    </QueryClientProvider>
  );
}
