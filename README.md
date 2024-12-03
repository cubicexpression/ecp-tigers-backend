# My Azure App Backend

This is the backend part of the My Azure App project, which is built using Express.js. This README provides instructions on how to set up and run the backend server.

## Prerequisites

- Node.js (version 14 or higher)
- npm (Node package manager)

## Installation

1. Navigate to the backend directory:

   ```
   cd my-azure-app/backend
   ```

2. Install the required dependencies:

   ```
   npm install
   ```

## Running the Server

To start the Express server, use the following command:

```
npm start
```

The server will run on `http://localhost:3000` by default.

## API Endpoints

The backend exposes several API endpoints. Refer to the routes defined in `backend/src/routes/index.js` for details on available endpoints and their usage.

## Deployment

For deployment to Azure, ensure you have the Azure CLI installed and configured. You can deploy the backend using the following commands:

1. Log in to Azure:
   ```bash
   az login
   ```

2. Create an Azure App Service:
   ```bash
   az webapp up --name <your-app-name> --resource-group <your-resource-group> --runtime "NODE|14-lts"
   ```

3. Configure deployment from GitHub:
   ```bash
   az webapp deployment source config --name <your-app-name> --resource-group <your-resource-group> --repo-url <your-repo-url> --branch main --manual-integration
   ```

## License

This project is licensed under the MIT License. See the LICENSE file for more details.