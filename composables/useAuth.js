// composables/useAuth.js
import { jwtDecode } from 'jwt-decode';
import { useNuxtApp } from '#app';

export const useAuth = () => {
  const userRole = ref(null); // Store the user's role

  // Fetch and decode the user role
  const fetchUserRole = async () => {
    const { $supabase } = useNuxtApp();
    if ($supabase) {
      const { data: session, error } = await $supabase.auth.getSession();

      if (!error && session && session.session.access_token) {
        const decodedToken = jwtDecode(session.session.access_token);
        userRole.value = decodedToken.user_role;
      } else {
        userRole.value = null; // Handle logged out or no session case
      }
    }
  };

  return { userRole, fetchUserRole };
};
