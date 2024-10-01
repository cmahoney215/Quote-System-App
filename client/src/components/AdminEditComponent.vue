<template>
    <div class="box">
        <div>
            Edit Sales Associate: {{ salesAssociate.username }}
        </div>
        <div>
            <label for="username">Username: </label>
            <input type="username" v_model="newUsername" id="username">
        </div>
        <div>
            <label for="password">Password: </label>
            <input type="password" v_model="newPassword" id="password">
        </div>
        <div>
            <label for="city">City: </label>
            <input type="city" v_model="newCity" id="city">
        </div>
        <div>
            <label for="street">Street: </label>
            <input type="street" v_model="newStreet" id="street">
        </div>
        <div>
            <label for="commission">Commission: </label>
            <input type="commission" v_model="newCommission" id="commission">
        </div>
        <button @click="saveSalesAssociate">Submit</button>&nbsp;
        <button @click="close()">Close</button>
    </div>
</template>
  
<!-- Everything inside your script tag is your controller -->
<script>
//import axios from 'axios';

export default {
    props: { // What you pass down from the AdminAssociateComponent
        salesAssociate: {
            type: Object,
            required: true,
        }
    },
    data() {
        return {
            newUsername: '',
            newPassword: '',
        };
    },
    methods: {  
        close(){
            this.$emit('close');
        },
        saveSalesAssociate() {
            console.log(this.salesAssociate.id);
            console.log(this.newUsername);
            console.log(this.newPassword);
            console.log(this.newCity);
            console.log(this.newStreet);
            console.log(this.newCommission);
        }
    },
}

</script>
  
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>