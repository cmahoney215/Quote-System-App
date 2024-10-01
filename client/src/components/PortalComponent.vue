<template>
    <PortalHeaderComponent />
    <main>
        <div class="box">
            <label for="customer">Select customer:</label>
            <select v-model="selectedCustomer" v-bind:disabled="!allowSelectedCustomer" id="customer">
                <option value="" disabled selected>Please select one</option>
                <option v-for="(customer, index) in customers" v-bind:key="index" v-bind:value="customer">{{ customer.name }}</option>
            </select>
            <button type="button" @click="startQuoteForm" v-bind:disabled="!allowNewQuote">New Quote</button>
        </div>
        <QuoteFormComponent v-if="showQuoteForm" :customer="selectedCustomer" :isUpdate="isUpdate" :detailedQuote="currentDetailedQuote" @close="closeQuoteForm" @quoteRender="fetchDetailedQuotes" />
        <div class="box">
            <div>List of current quotes:</div>
            <div v-for="(detailedQuote, index) in detailedQuotes" :key="index">
                <span>{{ detailedQuote.id }} {{ detailedQuote.customer.name }} Status: {{ detailedQuote.status }} Amount: ${{ detailedQuote.totalCost }} </span>
                <button @click="startUpdateQuoteForm(detailedQuote)">Update</button>
            </div>
        </div>
    </main>
</template>
  
<script>
import axios from 'axios';
import PortalHeaderComponent from '@/components/PortalHeaderComponent.vue';
import QuoteFormComponent from '@/components/QuoteFormComponent.vue';

export default {
    components: {
        PortalHeaderComponent,
        QuoteFormComponent,
    },
    data() {
        return {
            counter: 0,
            customers: [], //Retrieved using api
            detailedQuotes: [], //Retrieved using api
            selectedCustomer: '',
            allowNewQuote: false,
            allowSelectedCustomer: true,
            showQuoteForm: false,
            currentDetailedQuote: null,
            isUpdate: false,
        };
    },
    created() {
        this.fetchCustomers();
        this.fetchDetailedQuotes(); // Fetch open quotes for this sales associate that is logged in
    },
    methods: {
        async fetchCustomers() {
            try {
                const response = await axios.get('http://localhost:3000/api/customers');
                this.customers = response.data.customers;
            } catch (err) {
                console.error(err);
                this.$router.push({ name: 'error' }); 
            }
        },
        async fetchDetailedQuotes() {
            try {
                const response = await axios.get(`http://localhost:3000/api/detailed-quotes?status=open&salesAssociate=${this.$store.state.salesAssociate.id}`);
                this.detailedQuotes = [];
                this.detailedQuotes = response.data.detailedQuotes;
            } catch (err) {
                console.error(err);
                this.$router.push({ name: 'error' }); 
            }
        },
        startQuoteForm() {
            this.resetFormData();
            this.allowSelectedCustomer = false;
            this.allowNewQuote = false;
            this.isUpdate = false;
            this.showQuoteForm = true;
        },
        startUpdateQuoteForm(detailedQuote) {
            this.selectedCustomer = detailedQuote.customer;
            this.currentDetailedQuote = detailedQuote;
            this.allowSelectedCustomer = false;
            this.isUpdateMode = true;
            this.showQuoteForm = true;
            this.allowNewQuote = false;
        },
        closeQuoteForm() {
            this.showQuoteForm = false;
            this.allowSelectedCustomer = true;
            this.allowNewQuote = true;
            this.currentDetailedQuote = null;
            this.isUpdate = false;
        },
        resetFormData() {
            this.currentDetailedQuote = null;
            this.allowSelectedCustomer = true;
            this.allowNewQuote = false;
            this.showQuoteForm = false;
        },
    },
    watch: {
        selectedCustomer() {
            this.allowNewQuote = true;
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
  