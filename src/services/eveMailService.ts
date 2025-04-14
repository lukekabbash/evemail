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

export const eveMailService = {
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