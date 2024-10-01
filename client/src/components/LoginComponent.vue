<template>
    <PortalHeaderComponent />
    <main>
        <div>
            <h1>Sign in</h1>

            <!-- Whatever equals v-model set that also in the data field as well -->
            <input type="text" name="username" placeholder="username" v-model="username">
            <input type="password" name="password" placeholder="password" v-model="password">
            <button @click="login">Register</button>
            <div>{{ errorMessage }}</div>
        </div>
    </main>
</template>
  
<!-- Everything inside your script tag is your controller -->
<script>
//import authenticationService from '@/services/authenticationService';
import axios from 'axios';
import PortalHeaderComponent from '@/components/PortalHeaderComponent.vue';


export default {
    data () {
        // These properties are reactive, meaning that if they change, Vue will automatically update the UI wherever these properties are used
        return {
            username: '',
            password: '',
            errorMessage: ''
        };
    },
    components: {
        PortalHeaderComponent
    },
    methods: {
        // Send a post request to the server with the users data
        async login() {
            try {
                const response = await axios.post('http://localhost:3000/api/login', {
                    username: this.username,
                    password: this.password
                });
                console.log(response.data);
                this.$store.commit('setSalesAssociate', response.data.salesAssociate);
                this.$router.push({ name: 'portal' });  // Send them to the portal page if they sign in
            } catch (error) {
                // Failed login attempt
                if (error.response) {
                    this.errorMessage = 'Username or Password does not match!';
                }
                console.error('Error registering user:', error);
            }
        }
    }
    // Print the email value in the input field to the console for any change that happens
    // watch: {
    //     email (value) {
    //         console.log('email has changed', value);
    //     }
    // },
    // When the page loads after about 5 seconds change email value
    // mounted () {
    //     setTimeout(() => {
    //         this.email = 'hello word';
    //     }, 5000);
    // }
}
</script>
  
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
