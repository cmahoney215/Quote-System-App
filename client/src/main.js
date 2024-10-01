import { createApp } from 'vue'; // Import the Vue createApp function
import App from './App.vue'; // Import the root component
import router from './router'; // Import the router instance
import store from './store';

// Create the Vue app instance
const app = createApp(App);

// Use the router instance with the app
app.use(router);

app.use(store);

// Mount the Vue app to the DOM element with id 'app'
app.mount('#app');