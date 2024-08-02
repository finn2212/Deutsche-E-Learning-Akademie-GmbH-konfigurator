// middleware/subdomain.global.ts

import { defineNuxtRouteMiddleware, useNuxtApp, useRequestHeaders } from '#app';

export default defineNuxtRouteMiddleware(() => {
  const headers = useRequestHeaders();
  const nuxtApp = useNuxtApp();

  if (process.server && headers.host) {
    const host = headers.host; // Get the host from the request headers
    console.log('Server-side host:', host); // Confirm the host

    const subdomain = host.includes('.') ? host.split('.')[0] : 'default'; // Extract subdomain or use default
    console.log('Server-side subdomain:', subdomain); // Confirm the subdomain

    // Safely add the subdomain to the existing ssrContext object
    if (nuxtApp.ssrContext) {
      nuxtApp.ssrContext.subdomain = subdomain;
    }
  }
});
