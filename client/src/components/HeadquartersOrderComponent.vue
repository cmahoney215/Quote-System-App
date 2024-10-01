<template>
    <HeadquartersHeaderComponent /> <!-- Everything in the AdminHeaderComponent will display here -->
    <main>      
        <div>List of sanctioned quotes:</div>
        <div v-for="(sanctionedDetailedQuote, index) in sanctionedDetailedQuotes" :key="index">
            <span>{{ sanctionedDetailedQuote.id }}. Date:{{ sanctionedDetailedQuote.date }} Sales Associate:{{ sanctionedDetailedQuote.salesAssociate.username }} Customer:{{ sanctionedDetailedQuote.customer.name }} Status:{{ sanctionedDetailedQuote.status }} Price: ${{ sanctionedDetailedQuote.totalCost }} </span>
            <button @click="updateSanctionedQuote(index)">Update</button>
        </div>
        <QuoteFormComponent v-if="showQuoteForm" :customer="selectedCustomer" :isUpdate="true" :detailedQuote="currentDetailedQuote" @close="closeQuoteForm" @quoteRender="fetchSanctionedQuotes" />
    </main>
</template>
  
<!-- Everything inside your script tag is your controller -->
<script>
import axios from 'axios';
import HeadquartersHeaderComponent from './HeadquartersHeaderComponent.vue';
import QuoteFormComponent from './QuoteFormComponent.vue';

export default {
    data () { // Basically this is where you put data that you want your script and template(html code) to communicate back and forth with
        return {
            sanctionedDetailedQuotes: [],
            username: '',
            password: '',
            showQuoteForm: false,
            selectedCustomer: [],
            currentDetailedQuote: [],
        };
    },
    created() { // Put functions in here to be called as soon as the component is loaded in
        this.fetchSanctionedQuotes();
    },
    components: { // Like ejs partials. lets you add sections of code into this component. Example is you can have a component that uses 3 components.
        HeadquartersHeaderComponent,
        QuoteFormComponent,
    },
    methods: {  // Put functions in here that you want to call either inside the script or in the template
        async fetchSanctionedQuotes() {
            try {
                const response = await axios.get('http://localhost:3000/api/detailed-quotes?status=sanctioned');
                this.sanctionedDetailedQuotes = response.data.detailedQuotes;
            } catch(err) {
                console.error(err);
                this.$router.push({ name: 'error' }); 
            }
        },
        updateSanctionedQuote(index) {
            this.selectedCustomer = this.sanctionedDetailedQuotes[index].customer;
            this.currentDetailedQuote = this.sanctionedDetailedQuotes[index];
            this.showQuoteForm = true;
            console.log('you clicked the editSalesAssociate funtion');
            console.log(this.sanctionedDetailedQuotes[index]);
        },
        closeQuoteForm() {
            this.showQuoteForm = false;
            this.currentDetailedQuote = null;
        },
    },
}
</script>
  
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>