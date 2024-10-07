import { jwtDecode } from 'jwt-decode';
import { navigateTo } from '#app';  // Import navigateTo from Nuxt 3

export async function checkUserRole($supabase, requiredRole) {
  if (!$supabase) {
    return
  }
  try {
    // Get the user session
    const { data: session, error } = await $supabase.auth.getSession();
    
    if (error || !session || !session.session.access_token) {
      // Handle session retrieval error or absence of token
      console.error('Error retrieving session or user not logged in', error);
      return navigateTo('/login');  // Directly use navigateTo here
    }

    // Decode the JWT to get the user's role
    const token = session.session.access_token;
    const decodedToken = jwtDecode(token);
    const userRole = decodedToken.user_role;

    console.log("requiere Role:", requiredRole)
    console.log(" Role:", userRole)
    debugger

    // Check if the user's role matches the required role
    if (Array.isArray(requiredRole)) {
      if (!requiredRole.includes(userRole)) {
        return await navigateTo('/start');  // Redirect if the role doesn't match
      }
    } else {
      if (userRole !== requiredRole) {
        navigateTo('/login', { external: true}) // Redirect if the role doesn't match
      }
    }
  } catch (err) {
    console.error('Error checking user role:', err);
    return navigateTo('/login');  // Redirect to login in case of any error
  }
}
    