# Quote-System-App

## Getting Started

### Prerequisites
- Make sure you have Node.js installed on your computer. Use `node -v` in the terminal to check if it's installed. If not, you can install it from the https://nodejs.org/en/download/package-manager.
- Make sure you have the Vue CLI installed. Use `vue --version` in the terminal to check if it's installed. If not, you can install it globally by running: `npm install -g @vue/cli`

### Backend Setup (Express)
1. Clone the repository before doing any other steps below

2. After you clone it you should see a server and client folder. Go to the server folder: `cd server`

3. Install backend dependencies: `npm install`

4. Install `nodemon` for devlopment: `npm install --save-dev nodemon`

5. Now to start the backend server do: `npx nodemon app.js`

6. In the terminal now you should see that the server is running. Now you can make api calls from vue to this backend express app.

### Frontend Setup (Vue)
1. Open a new terminal and navigate to the client folder: `cd client`. If you're using vs code theres a plus symbol on the bottom right that will allow you to add another terminal

2. Install frontend dependencies: `npm install`

3. Start the Vue development server: `npm run serve`

4. In the terminal now you should see that the vue app is running on `http://localhost:8080`. copy and paste that in the browser.

### Database Setup (MariaDB)
1. Install the VS Code extension [MySQL] by Weijan.
2. Add a connection to the MySQL database.


### Notes
- Make sure that both the backend and frontend servers are running at the same time for the application to function correctly.