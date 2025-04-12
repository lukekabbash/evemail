import axios from 'axios';
import { EveItem, MarketOrder, ESIResponse, ItemCategory, ItemGroup, Region, ESIMarketOrder, convertESIOrder } from '../types';

// Base URL for ESI API
const ESI_BASE_URL = 'https://esi.evetech.net/latest';

// Create axios instance with custom configuration
const esiAxios = axios.create({
  baseURL: ESI_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'EVE OS Mail (https://mail.eveos.space; contact@eveos.space)',
  },
});

// Add response interceptor for error handling
esiAxios.interceptors.response.use(
  response => response,
  error => {
    // Handle ESI errors
    const errorMessage = error.response?.data?.error || 'An unknown error occurred';
    const errorStatus = error.response?.status;
    return Promise.reject({ message: errorMessage, status: errorStatus });
  }
);

// Helper to add auth token to requests
const createAuthHeader = (token: string) => ({
  headers: { Authorization: `Bearer ${token}` }
});

// Auth service for EVE SSO
export const authService = {
  // Get the SSO authorization URL
  getAuthUrl: (clientId: string, redirectUri: string, scopes: string[], state: string): string => {
    const baseUrl = 'https://login.eveonline.com/v2/oauth/authorize/';
    const scope = scopes.join(' ');
    
    const params = new URLSearchParams({
      response_type: 'code',
      redirect_uri: redirectUri,
      client_id: clientId,
      scope,
      state,
    });
    
    return `${baseUrl}?${params.toString()}`;
  },
};

// Types service for item data
export const typesService = {
  // Get a single item by its type ID
  getItemById: async (typeId: number): Promise<EveItem> => {
    const response = await esiAxios.get<any>(`/v3/universe/types/${typeId}/`);
    
    return {
      typeId,
      name: response.data.name,
      description: response.data.description,
      groupId: response.data.group_id,
      categoryId: 0, // Will need to be looked up separately
      icon: `https://images.evetech.net/types/${typeId}/icon`,
    };
  },
  
  // Get multiple items by page
  getItems: async (page: number = 1): Promise<number[]> => {
    const response = await esiAxios.get<number[]>(`/v1/universe/types/?page=${page}`);
    return response.data;
  },
  
  // Search for items by name
  searchItems: async (searchTerm: string): Promise<number[]> => {
    const response = await esiAxios.get<{ inventory_type?: number[] }>(`/v2/search/?categories=inventory_type&search=${encodeURIComponent(searchTerm)}&strict=false`);
    return response.data.inventory_type || [];
  },
  
  // Get item categories
  getCategories: async (): Promise<number[]> => {
    const response = await esiAxios.get<number[]>('/v1/universe/categories/');
    return response.data;
  },
  
  // Get a single category
  getCategory: async (categoryId: number): Promise<ItemCategory> => {
    const response = await esiAxios.get<any>(`/v1/universe/categories/${categoryId}/`);
    return {
      categoryId,
      name: response.data.name,
    };
  },
  
  // Get groups for a category
  getGroups: async (categoryId?: number): Promise<number[]> => {
    const response = await esiAxios.get<number[]>('/v1/universe/groups/');
    return response.data;
  },
  
  // Get a single group
  getGroup: async (groupId: number): Promise<ItemGroup> => {
    const response = await esiAxios.get<any>(`/v1/universe/groups/${groupId}/`);
    return {
      groupId,
      name: response.data.name,
      categoryId: response.data.category_id,
    };
  },

  // Get item details
  getItemDetails: async (typeId: number): Promise<{ name: string; description: string; icon_url: string }> => {
    const response = await esiAxios.get<any>(`/v3/universe/types/${typeId}/`);
    return {
      name: response.data.name,
      description: response.data.description || 'No description available',
      icon_url: `https://images.evetech.net/types/${typeId}/icon`,
    };
  },
};

// Market service for orders and prices
export const marketService = {
  // Get market orders for a region and type
  getOrders: async (regionId: number, typeId: number, orderType?: 'buy' | 'sell'): Promise<MarketOrder[]> => {
    const orderParam = orderType ? `&order_type=${orderType}` : '';
    const response = await esiAxios.get<ESIMarketOrder[]>(`/v1/markets/${regionId}/orders/?type_id=${typeId}${orderParam}`);
    
    return response.data.map(convertESIOrder);
  },
  
  // Get market regions
  getRegions: async (): Promise<Region[]> => {
    const response = await esiAxios.get<number[]>('/v1/universe/regions/');
    
    // Common market hubs (The Forge contains Jita)
    const marketHubIds = [10000002, 10000043, 10000030, 10000032];
    const marketHubs = await Promise.all(
      marketHubIds.map(async regionId => {
        const regionResponse = await esiAxios.get<any>(`/v1/universe/regions/${regionId}/`);
        return {
          regionId,
          name: regionResponse.data.name,
        };
      })
    );
    
    return marketHubs;
  },
  
  // Get lowest sell price from orders
  getLowestPrice: (orders: MarketOrder[]): number => {
    const sellOrders = orders.filter(order => !order.isBuyOrder);
    if (sellOrders.length === 0) return 0;
    return Math.min(...sellOrders.map(order => order.price));
  },
};

// Mail service for sending in-game mail
export const mailService = {
  // Send an in-game mail
  sendMail: async (
    characterId: string,
    accessToken: string,
    subject: string,
    body: string,
    recipients: { recipient_id: number; recipient_type: string }[]
  ): Promise<number> => {
    const payload = {
      subject,
      body,
      recipients,
    };
    
    const response = await esiAxios.post<number>(
      `/v1/characters/${characterId}/mail/`,
      payload,
      createAuthHeader(accessToken)
    );
    
    return response.data;
  },
};

interface ESISearchResponse {
  inventory_type: number[];
}

interface ESITypeResponse {
  type_id: number;
  name: string;
  description: string;
  published: boolean;
  market_group_id?: number;
}

// Export a unified service interface
export const esiService = {
  searchItems: typesService.searchItems,
  getItemDetails: typesService.getItemDetails,
  getMarketOrders: marketService.getOrders,
  getLowestPrice: marketService.getLowestPrice,
};

export default {
  authService,
  typesService,
  marketService,
  mailService,
}; 