// EVE SSO Authentication Utils
import { v4 as uuidv4 } from 'uuid';

// EVE Online SSO Configuration
export const EVE_SSO_CONFIG = {
  CLIENT_ID: process.env.REACT_APP_EVE_CLIENT_ID || '',
  REDIRECT_URI: process.env.REACT_APP_EVE_CALLBACK_URL || 'http://localhost:3000/auth/callback',
  SCOPES: [
    'esi-mail.organize_mail.v1',
    'esi-mail.read_mail.v1',
    'esi-mail.send_mail.v1',
    'esi-characters.read_contacts.v1',
    'esi-characters.write_contacts.v1'
  ],
  AUTH_URL: 'https://login.eveonline.com/v2/oauth/authorize',
  TOKEN_URL: 'https://login.eveonline.com/v2/oauth/token',
};

// Generate a random state string for CSRF protection
export const generateState = (): string => {
  return uuidv4();
};

// Generate a random code verifier for PKCE
export const generateCodeVerifier = (): string => {
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  return Array.from(array, dec => ('0' + dec.toString(16)).slice(-2)).join('');
};

// Base64 URL encode a string
const base64UrlEncode = (str: string): string => {
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

// Generate a code challenge from a code verifier for PKCE
export const generateCodeChallenge = async (codeVerifier: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  
  // Create a string from the array buffer without using spread operator
  const digestArray = new Uint8Array(digest);
  let digestString = '';
  for (let i = 0; i < digestArray.length; i++) {
    digestString += String.fromCharCode(digestArray[i]);
  }
  
  return base64UrlEncode(digestString);
};

// Get the authorization URL
export const getAuthorizationUrl = async (): Promise<{ url: string; state: string; codeVerifier: string }> => {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: EVE_SSO_CONFIG.CLIENT_ID,
    redirect_uri: EVE_SSO_CONFIG.REDIRECT_URI,
    scope: EVE_SSO_CONFIG.SCOPES.join(' '),
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });
  
  return {
    url: `${EVE_SSO_CONFIG.AUTH_URL}?${params.toString()}`,
    state,
    codeVerifier,
  };
};

// Store PKCE state in sessionStorage
export const storePKCEParams = (state: string, codeVerifier: string): void => {
  sessionStorage.setItem('eve_sso_state', state);
  sessionStorage.setItem('eve_sso_code_verifier', codeVerifier);
};

// Get stored PKCE params
export const getPKCEParams = (): { state: string | null; codeVerifier: string | null } => {
  return {
    state: sessionStorage.getItem('eve_sso_state'),
    codeVerifier: sessionStorage.getItem('eve_sso_code_verifier'),
  };
};

// Clear PKCE params
export const clearPKCEParams = (): void => {
  sessionStorage.removeItem('eve_sso_state');
  sessionStorage.removeItem('eve_sso_code_verifier');
};

// Exchange authorization code for tokens
export const exchangeCodeForTokens = async (
  code: string,
  codeVerifier: string
): Promise<{ access_token: string; refresh_token: string }> => {
  const tokenEndpoint = EVE_SSO_CONFIG.TOKEN_URL;
  
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: EVE_SSO_CONFIG.CLIENT_ID,
    code,
    code_verifier: codeVerifier,
    redirect_uri: EVE_SSO_CONFIG.REDIRECT_URI,
  });
  
  try {
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });
    
    if (!response.ok) {
      throw new Error(`Token exchange failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    };
  } catch (error) {
    console.error('Error exchanging code for tokens:', error);
    throw error;
  }
}; 