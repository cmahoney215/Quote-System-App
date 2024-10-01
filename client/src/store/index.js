import { createStore } from 'vuex';
import router from '../router/index.js';


// All the components in our app can use this
export default createStore({
    // Where we store the data of our app
    state: {
        salesAssociate: null,
        isAuthenticated: false,
        notification: null,
    },
    // Can change data in state only with calling these methods in mutation. Only sync code. Commit mutations
    mutations: {
        setSalesAssociate(state, salesAssociate) {
            state.salesAssociate = salesAssociate;
            state.isAuthenticated = true;
        },
        logout(state) {
            state.isAuthenticated = false;
            state.salesAssociate = null;
            router.push({ name: 'login' });
        },
        setNotification(state, message) {
            state.notification = message;
            console.log(state.notification);
        },
        clearNotification(state) {
            state.notification = null;
        },
    },
    // Also methods but they cant change data in the state. They can access data of the state. Can have async code. For things like api calls. Dispatch actions
    actions: {
        showNotification({ commit }, message) {
            commit('setNotification', message);
            setTimeout(() => commit('clearNotification'), 10000); // After 6 seconds the notification disappears
        },
    },
    // minipulate data in a certain way then provide that everywhere
    getters: {

    },
    // Allows us to break up our store into multiple module. With each seperate module having its own state, mutations, action, and getters 
    modules: {

    }
});