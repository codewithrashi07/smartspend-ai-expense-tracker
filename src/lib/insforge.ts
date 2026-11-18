import { createClient } from '@insforge/sdk';

const insforgeUrl = import.meta.env.VITE_INSFORGE_URL || 'https://i9k3hh9n.us-east.insforge.app';
const insforgeAnonKey = import.meta.env.VITE_INSFORGE_ANON_KEY || 'anon_137166cf05ea65cf1bc3548bd5d181b2e729a1b3427773c6d31145c9cb88e3e8';

export const insforge = createClient({
  baseUrl: insforgeUrl,
  anonKey: insforgeAnonKey,
});

export const isInsForgeConfigured = Boolean(insforgeUrl && insforgeAnonKey);
