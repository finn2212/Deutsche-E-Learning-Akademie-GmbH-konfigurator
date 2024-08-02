// middleware/subdomain.global.ts

import { defineNuxtRouteMiddleware, useNuxtApp, useRequestHeaders } from '#app';

export default defineNuxtRouteMiddleware(() => {
  const headers = useRequestHeaders();
  const nuxtApp = useNuxtApp();

  if (process.server && headers.host) {
    const host = headers.host; // Get the host from the request headers
    const subdomain = host.includes('.') ? host.split('.')[0] : 'default'; // Extract subdomain or use default

    // Safely add the subdomain to the existing ssrContext object
    if (nuxtApp.ssrContext) {
      (nuxtApp.ssrContext as any).subdomain = subdomain;
    }
  } else if (process.client) {
    // On client-side, check if ssrContext already has the subdomain set
    if (nuxtApp.ssrContext && !(nuxtApp.ssrContext as any).subdomain) {
      // Add subdomain to ssrContext on the client-side only if not already set
      (nuxtApp.ssrContext as any).subdomain = 'default';
    }
  }
});
