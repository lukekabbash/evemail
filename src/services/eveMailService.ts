const ESI_BASE_URL = 'https://esi.evetech.net/latest';

// Helper function to clean character ID
const cleanCharacterId = (characterId: string | null): string => {
  if (!characterId) throw new Error('Character ID is required');
  // Remove any prefix like "CHARACTER:EVE:" and return just the numeric ID
  return characterId.split(':').pop() || characterId;
};

interface EVEMailHeader {
  from: number;
  is_read: boolean;
  labels: number[];
  mail_id: number;
  recipient_id: number;
  recipient_type: string;
  subject: string;
  timestamp: string;
}

interface EVEMailContent {
  body: string;
  from: number;
  read: boolean;
  subject: string;
  timestamp: string;
}

interface EVECharacterInfo {
  character_id: number;
  name: string;
}

interface EVECharacterSearchResult {
  character_id: number;
  name: string;
  portrait_url: string;
}

export const eveMailService = {
  async searchCharacters(query: string): Promise<EVECharacterSearchResult[]> {
    if (!query || query.length < 3) return [];

    try {
      // First try exact match
      const exactResponse = await fetch(
        `${ESI_BASE_URL}/universe/ids/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify([query])
        }
      );

      if (exactResponse.ok) {
        const exactData = await exactResponse.json();
        if (exactData.characters && exactData.characters.length > 0) {
          const character = exactData.characters[0];
          const [infoResponse, portraitResponse] = await Promise.all([
            fetch(`${ESI_BASE_URL}/characters/${character.id}/`),
            fetch(`${ESI_BASE_URL}/characters/${character.id}/portrait/`)
          ]);

          if (infoResponse.ok && portraitResponse.ok) {
            const portrait = await portraitResponse.json();
            return [{
              character_id: character.id,
              name: character.name,
              portrait_url: portrait.px64x64
            }];
          }
        }
      }

      // If no exact match, try search
      const searchResponse = await fetch(
        `${ESI_BASE_URL}/search/?categories=character&search=${encodeURIComponent(query)}&strict=false`,
        {
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (!searchResponse.ok) {
        throw new Error(`Failed to search characters: ${searchResponse.statusText}`);
      }

      const searchData = await searchResponse.json();
      if (!searchData.character || !searchData.character.length) return [];

      // Get character details and portraits for each result
      const characterPromises = searchData.character.slice(0, 5).map(async (id: number) => {
        try {
          const [infoResponse, portraitResponse] = await Promise.all([
            fetch(`${ESI_BASE_URL}/characters/${id}/`),
            fetch(`${ESI_BASE_URL}/characters/${id}/portrait/`)
          ]);

          if (!infoResponse.ok || !portraitResponse.ok) return null;

          const info = await infoResponse.json();
          const portrait = await portraitResponse.json();

          return {
            character_id: id,
            name: info.name,
            portrait_url: portrait.px64x64
          };
        } catch (error) {
          console.error(`Failed to fetch character details for ID ${id}:`, error);
          return null;
        }
      });

      const results = await Promise.all(characterPromises);
      return results
        .filter((result): result is EVECharacterSearchResult => result !== null)
        .sort((a, b) => {
          // Sort exact matches first, then by name length
          const aExact = a.name.toLowerCase() === query.toLowerCase();
          const bExact = b.name.toLowerCase() === query.toLowerCase();
          if (aExact && !bExact) return -1;
          if (!aExact && bExact) return 1;
          return a.name.length - b.name.length;
        });
    } catch (error) {
      console.error('Character search failed:', error);
      return [];
    }
  },

  async getCharacterPortrait(characterId: number): Promise<string | null> {
    try {
      const response = await fetch(`${ESI_BASE_URL}/characters/${characterId}/portrait/`);
      if (!response.ok) return null;
      const data = await response.json();
      return data.px64x64 || null;
    } catch (error) {
      console.error('Failed to fetch character portrait:', error);
      return null;
    }
  },

  async getMailHeaders(characterId: string | null, accessToken: string | null): Promise<EVEMailHeader[]> {
    if (!characterId || !accessToken) {
      throw new Error('Character ID and access token are required');
    }

    const cleanId = cleanCharacterId(characterId);
    const response = await fetch(
      `${ESI_BASE_URL}/characters/${cleanId}/mail/`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch mail headers: ${response.statusText}`);
    }

    return response.json();
  },

  async getMailContent(characterId: string | null, mailId: number, accessToken: string | null): Promise<EVEMailContent> {
    if (!characterId || !accessToken) {
      throw new Error('Character ID and access token are required');
    }

    const cleanId = cleanCharacterId(characterId);
    const response = await fetch(
      `${ESI_BASE_URL}/characters/${cleanId}/mail/${mailId}/`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch mail content: ${response.statusText}`);
    }

    return response.json();
  },

  async getCharacterInfo(characterId: number, accessToken: string | null): Promise<EVECharacterInfo> {
    if (!accessToken) {
      throw new Error('Access token is required');
    }

    const response = await fetch(
      `${ESI_BASE_URL}/characters/${characterId}/`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch character info: ${response.statusText}`);
    }

    return response.json();
  },

  async markMailRead(characterId: string | null, mailId: number, accessToken: string | null): Promise<void> {
    if (!characterId || !accessToken) {
      throw new Error('Character ID and access token are required');
    }

    const cleanId = cleanCharacterId(characterId);
    const response = await fetch(
      `${ESI_BASE_URL}/characters/${cleanId}/mail/${mailId}/`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ read: true }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to mark mail as read: ${response.statusText}`);
    }
  },

  async deleteMail(characterId: string | null, mailId: number, accessToken: string | null): Promise<void> {
    if (!characterId || !accessToken) {
      throw new Error('Character ID and access token are required');
    }

    const cleanId = cleanCharacterId(characterId);
    const response = await fetch(
      `${ESI_BASE_URL}/characters/${cleanId}/mail/${mailId}/`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to delete mail: ${response.statusText}`);
    }
  },

  async sendMail(
    characterId: string | null,
    accessToken: string | null,
    subject: string,
    body: string,
    recipients: Array<{ recipient_id: number; recipient_type: string }>
  ): Promise<void> {
    if (!characterId || !accessToken) {
      throw new Error('Character ID and access token are required');
    }

    const cleanId = cleanCharacterId(characterId);
    const response = await fetch(
      `${ESI_BASE_URL}/characters/${cleanId}/mail/`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject,
          body,
          recipients,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to send mail: ${response.statusText}`);
    }
  },
}; 