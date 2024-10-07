// middleware/auth.global.js
import { checkUserRole } from '~/utils/authHelper';

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { $supabase } = useNuxtApp();  // Access $supabase globally

  // Define dynamic roles based on route path
  const roleMap = {
    '/admin': 'admin',
    '/moderator': 'moderator',
    '/participant-dashboard': 'participant',
    '/organization-dashboard': ['organization_owner', 'organization_worker'],
    '/find-anbieter': 'super_admin',  // Ensure correct route with leading slash
  };

  // Get the required role for the current route
  const requiredRole = roleMap[to.path];

  // If a role is required for this route, call the helper function with that role
  if (requiredRole) {
    await checkUserRole($supabase, requiredRole);
  }
});
