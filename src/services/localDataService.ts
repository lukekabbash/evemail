import { MarketOrder } from '../types';

interface ItemData {
  name: string;
  description?: string;
}

interface ItemsData {
  [key: string]: ItemData;
}

// Fetch item data from local JSON file
export const localDataService = {
  // Search for items by name
  searchItems: async (searchTerm: string): Promise<number[]> => {
    try {
      const response = await fetch('/data/types.json');
      const data: ItemsData = await response.json();
      
      const searchTermLower = searchTerm.toLowerCase();
      const matchingItems = Object.entries(data)
        .filter(([_, item]) => 
          item.name.toLowerCase().includes(searchTermLower)
        )
        .map(([typeId]) => parseInt(typeId))
        .slice(0, 20);

      return matchingItems;
    } catch (error) {
      console.error('Failed to search items:', error);
      return [];
    }
  },

  // Get item details
  getItemDetails: async (typeId: number): Promise<{ name: string; description: string; icon_url: string }> => {
    try {
      const response = await fetch('/data/types.json');
      const data: ItemsData = await response.json();
      
      const item = data[typeId.toString()];
      if (!item) {
        throw new Error(`Item ${typeId} not found`);
      }

      return {
        name: item.name,
        description: item.description || 'No description available',
        icon_url: `https://images.evetech.net/types/${typeId}/icon`,
      };
    } catch (error) {
      console.error('Failed to get item details:', error);
      return {
        name: 'Unknown Item',
        description: 'Item details not available',
        icon_url: '/placeholder-icon.png',
      };
    }
  },

  // Get market orders (returns placeholder data for non-authenticated users)
  getMarketOrders: async (_regionId: number, typeId: number): Promise<MarketOrder[]> => {
    return [{
      orderId: 0,
      typeId,
      locationId: 0,
      volumeRemain: 0,
      price: 0,
      isBuyOrder: false,
      issued: new Date().toISOString(),
      range: 'region',
      minVolume: 1,
    }];
  },

  // Get lowest price (returns 0 for non-authenticated users)
  getLowestPrice: (_orders: MarketOrder[]): number => {
    return 0;
  },
}; 