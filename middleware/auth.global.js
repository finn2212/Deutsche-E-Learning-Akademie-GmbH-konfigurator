// middleware/auth.global.js
import { checkUserRole } from '~/utils/authHelper';
import { useAuth } from '~/composables/useAuth';
import { Roles } from '~/utils/roles';  // Import the Roles enum

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { $router } = useNuxtApp();  // Use $router to access navigation

  const { userRole, fetchUserRole } = useAuth(); 

  await fetchUserRole();

  // Define dynamic roles based on route path
  const roleMap = {
    '/start': [Roles.SUPER_ADMIN, Roles.MODERATOR,Roles.ORGANIZATION_OWNER, Roles.ORGANIZATION_WORKER],
    '/find-anbieter': Roles.SUPER_ADMIN,  // Ensure correct route with leading slash
  };

  // Get the required role for the current route
  const requiredRole = roleMap[to.path];

  // If a role is required for this route, call the helper function with that role
  if (requiredRole) {
    await checkUserRole(userRole.value, requiredRole, (path, options = {}) => {
      return $router.push(path, options);  // Use $router to navigate
    });
  }
});
