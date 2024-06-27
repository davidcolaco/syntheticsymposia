export default defineNuxtRouteMiddleware((to, from) => {
    if (process.server) return;
  
    const token = localStorage.getItem('token');
  
    if (!token) {
      return navigateTo('/login');
    }
  
    try {
      // If the token exists, we assume the user is authenticated
      // In a real-world scenario, you'd verify the token on the server-side
    } catch (error) {
      console.error('Invalid token:', error);
      return navigateTo('/login');
    }
  });
  