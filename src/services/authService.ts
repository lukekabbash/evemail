import { jwtDecode } from 'jwt-decode';

const EVE_SSO_URL = 'https://login.eveonline.com/v2/oauth/authorize';
const CLIENT_ID = process.env.REACT_APP_EVE_CLIENT_ID;
const CALLBACK_URL = process.env.REACT_APP_EVE_CALLBACK_URL;

const REQUIRED_SCOPES = [
  'esi-mail.organize_mail.v1',
  'esi-mail.read_mail.v1',
  'esi-mail.send_mail.v1',
  'esi-characters.read_contacts.v1',
  'esi-characters.write_contacts.v1'
].join(' ');

interface DecodedToken {
  sub: string; // Character ID
  name: string; // Character Name
  exp: number; // Expiration timestamp
  scp: string[]; // Scopes
}

export const authService = {
  login: () => {
    const params = new URLSearchParams({
      response_type: 'token',
      client_id: CLIENT_ID || '',
      redirect_uri: CALLBACK_URL || 'http://localhost:3000/auth/callback',
      scope: REQUIRED_SCOPES,
      state: crypto.randomUUID()
    });

    window.location.href = `${EVE_SSO_URL}?${params.toString()}`;
  },

  handleCallback: () => {
    const fragment = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = fragment.get('access_token');
    
    if (!accessToken) {
      throw new Error('No access token found in callback');
    }

    return accessToken;
  },

  getCharacterInfo: (token: string): DecodedToken => {
    const decoded = jwtDecode<DecodedToken>(token);
    // Ensure scopes is always an array
    decoded.scp = Array.isArray(decoded.scp) ? decoded.scp : [decoded.scp].filter(Boolean);
    return decoded;
  },

  isTokenExpired: (token: string): boolean => {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.exp * 1000 < Date.now();
  },

  logout: () => {
    localStorage.removeItem('eve_token');
    window.location.href = '/';
  }
}; 