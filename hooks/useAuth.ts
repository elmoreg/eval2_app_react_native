import { useAuthContext } from '../contexts/AuthContext';

/**
 * Thin wrapper del AuthContext.
 * Mantiene la misma firma de antes para que las pantallas no cambien.
 */
export function useAuth() {
  return useAuthContext();
}
