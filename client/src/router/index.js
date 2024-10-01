// Functionality of how you hit different routes

import { createRouter, createWebHistory } from 'vue-router'; 
import LoginComponent from '@/components/LoginComponent.vue';
import PortalComponent from '@/components/PortalComponent.vue';
import ErrorComponent from '../components/ErrorComponent.vue';
import AdminAssociatesComponent from '../components/AdminAssociatesComponent.vue';
import AdminQuotesComponent from '../components/AdminQuotesComponent.vue';
import HeadquartersSanctionComponent from '../components/HeadquartersSanctionComponent.vue';
import HeadquartersOrderComponent from '../components/HeadquartersOrderComponent.vue';



import store from '../store/index.js';

// Define the routes for your application
const routes = [
    {
        path: '/', // URL path for this route
        redirect: '/login' // The route to redirect to
    },
    {
        path: '/login', // URL path for this route
        name: 'login', // Name for this route
        component: LoginComponent // Component to render for this route
    },
    {
        path: '/portal', // URL path for this route
        name: 'portal', // Name for this route
        component: PortalComponent, // Component to render for this route
        meta: { requiresAuth: true } // This meta field can be used for route guards
    },
    {
        path: '/headquarters/sanction', // URL path for this route
        name: 'headquartersSanction', // Name for this route
        component: HeadquartersSanctionComponent, // Component to render for this route
    },
    {
        path: '/headquarters/order', // URL path for this route
        name: 'headquartersOrder', // Name for this route
        component: HeadquartersOrderComponent, // Component to render for this route
    },
    {
        path: '/admin/associates', // URL path for this route
        name: 'adminAssociates', // Name for this route
        component: AdminAssociatesComponent, // Component to render for this route
    },
    {
        path: '/admin/quotes', // URL path for this route
        name: 'adminQuotes', // Name for this route
        component: AdminQuotesComponent, // Component to render for this route
    },
    {
        path: '/error/:message',
        name: 'error',
        component: ErrorComponent,
    },
];

// Create the router instance with the routes
const router = createRouter({
    history: createWebHistory(), // Use HTML5 history mode for clean URLs
    routes // Array of route objects
});

// check if the current user is logged or not. Where `to` is where the user is trying to go
router.beforeEach((to, from, next) => {

    // if the route requires auth and the the user is not authticated then route them to the login
    if (to.meta.requiresAuth && !store.state.isAuthenticated) {
        next({ path: '/login' });
    } else {
        next();
    }
});

export default router; // Export the router instance