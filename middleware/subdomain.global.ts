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
  } else {
    // Handle client-side or fallback
    if (!process.server) {
      // Ensure ssrContext exists before adding properties
      if (!nuxtApp.ssrContext) {
        nuxtApp.ssrContext = {} as any;
      }
      // Add subdomain to ssrContext on the client-side
      (nuxtApp.ssrContext as any).subdomain = 'esn';
    }
  }
});
