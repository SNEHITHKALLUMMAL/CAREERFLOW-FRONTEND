import { useSelector } from 'react-redux';

/** Reads the current auth state. Use react-redux's useDispatch() directly for actions/thunks. */
export function useAuth() {
  const { user, accessToken, status, error } = useSelector((state) => state.auth);
  return {
    user,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading' || status === 'idle',
    accessToken,
    error,
  };
}
