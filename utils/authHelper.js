// utils/authHelper.js

export async function checkUserRole(userRole, requiredRole, navigateTo) {
  try {
    // Check if the user's role matches the required role
    if (Array.isArray(requiredRole)) {
      if (!requiredRole.includes(userRole)) {
        return navigateTo('/start');  // Ensure returning navigateTo
      }
    } else {
      if (userRole !== requiredRole) {
        return navigateTo('/login', { external: true });  // Ensure returning navigateTo
      }
    }
  } catch (err) {
    console.error('Error checking user role:', err);
    return navigateTo('/login');  // Ensure returning navigateTo in case of error
  }
}
