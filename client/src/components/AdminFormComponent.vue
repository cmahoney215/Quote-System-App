<template>
    <div class="box">

<!-- New/Edit associate values -->
        <div><b>New associate information: </b></div>
        <p></p>

            <!-- Username -->
        <div>
            <label for="username">Username: </label>
            <input v-model="username" type="username" placeholder="Username" id="username">
        </div>

            <!-- Password -->
        <div>
            <label for="password">Password: </label>
            <input v-model="password" type="password" placeholder="Password" id="password">
        </div>

            <!-- City -->
        <div>
            <label for="city">City: </label>
            <input v-model="city" type="city" placeholder="City" id="city">
        </div>

            <!-- Street -->
        <div>
            <label for="street">Street: </label>
            <input v-model="street" type="street" placeholder="Street" id="street">
        </div>

            <!-- Associate commission. Maybe change this field to be visible only on editing -->
        <div>
            <label for="commission">Commission: </label>
            <input v-model="commission" type="commission" placeholder="Commission" id="commission">
        </div>

            <!-- Save button -->
        <p></p>
        <button @click="saveAssociate(); close();">{{ isEditing ? 'Save changes' : 'Add associate' }}</button>&nbsp;
        <button @click="close()">Close</button>
    </div>
</template>

<script>
//---------------------------------------------------------------------------------------------------------------//
import axios from 'axios';

export default {
    props: {
        salesAssociate: {
            type: Object,
            default: null,
        },
    },
    data() {
        return {
            associateId: this.salesAssociate ? this.salesAssociate.id : 0,
            username: this.salesAssociate ? this.salesAssociate.username : '',
            password: this.salesAssociate ? this.salesAssociate.password : '',
            commission: this.salesAssociate ? this.salesAssociate.commission : 0,
            city: this.salesAssociate ? this.salesAssociate.city : '',
            street: this.salesAssociate ? this.salesAssociate.street : '',
        };
    },
    computed: {
        isEditing() {
            return this.salesAssociate !== null;
        },
    },
    created() {
        
    },
    methods: {
        // create or update associate
        async saveAssociate()
        {
            try {
                const payload = {
                    associateId: this.salesAssociate,
                    username: this.username,
                    password: this.password,
                    commission: this.commission,
                    city: this.city,
                    street: this.street,
                };
                    await axios.post('http://localhost:3000/api/sales-associates', payload, {
                    headers: { 'Content-Type': 'application/json' }
                    });
                this.$emit('salesAssociateAdded');
                this.$emit('close');
            } catch (err) {
                console.error(err);
            }
        },

        // Close the quote form component
        close() {
            // Reset the values before closing the form
            this.username = '';
            this.password = '';
            this.commission = 0;
            this.city = '';
            this.street = '';
            this.$emit('close');
        },

    },
    /*watch: {
        salesAssociate: {
            immediate: true,
            handler(newVal) {
                if (newVal) {
                    this.username = newVal.username;
                    this.password = newVal.password;
                    this.commission = newVal.commission;
                    this.city = newVal.city;
                    this.street = newVal.street;
                } else {
                    this.resetForm();
                }
            }
        }
    },*/
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
  