# EVE OS Mail

EVE OS Mail is a web application that allows EVE Online players to browse market items, create a checklist of items with quantities, and mail the shopping list to themselves in-game.

## Features

- Authentication via EVE Online SSO
- Browse all market items in EVE Online
- Search and filter items by categories and groups
- See current market prices from major trade hubs
- Add items to a shopping checklist with custom quantities
- Send the shopping list as an in-game mail

## Requirements

- Node.js (v14+)
- NPM or Yarn
- An EVE Online account
- EVE Online Developer Application (for SSO)

## Setup

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create an EVE Online Developer Application at https://developers.eveonline.com/
   - Set the callback URL to `http://localhost:3000/callback` (for local development)
   - Request the following scopes:
     - `esi-mail.send_mail.v1`
     - `esi-markets.read_character_markets.v1`
     - `esi-universe.read_universe.v1`

4. Create a `.env` file in the root directory with the following content:
   ```
   REACT_APP_EVE_CLIENT_ID=your_client_id_here
   REACT_APP_EVE_REDIRECT_URI=http://localhost:3000/callback
   ```
   Replace `your_client_id_here` with the Client ID from your EVE Developer Application.

5. Start the development server:
   ```
   npm start
   ```

6. Open your browser and navigate to http://localhost:3000

## Deployment

The application is set up to be deployed as a static site on platforms like Netlify, GitHub Pages, or AWS S3.

To build the production version:
```
npm run build
```

This will create a `build` directory with optimized static files ready for deployment.

## Technical Stack

- React (with TypeScript)
- React Router for navigation
- TailwindCSS for styling
- Axios for API requests
- JWT-decode for token handling

## Application Structure

- `/src/components` - Reusable UI components
- `/src/contexts` - React contexts for authentication and checklist
- `/src/pages` - Main application pages
- `/src/services` - Services for API interactions
- `/src/types` - TypeScript type definitions
- `/src/utils` - Utility functions

## Important Notes

- All API calls are made client-side directly to the EVE Online ESI API
- No data is stored on any server; all user data is stored in the browser
- The app requires EVE Online SSO authorization to access character data and send mail
- This is not an official CCP/EVE Online application

## License

This project is licensed under the MIT License - see the LICENSE file for details.
