<template>
    <HeadquartersHeaderComponent /> <!-- Everything in the AdminHeaderComponent will display here -->
    <main>      
        <div>List of finalized quotes:</div>
        <div v-for="(finalizedDetailedQuote, index) in finalizedDetailedQuotes" :key="index">
            <span>{{ finalizedDetailedQuote.id }}. Date:{{ finalizedDetailedQuote.date }} Sales Associate:{{ finalizedDetailedQuote.salesAssociate.username }} Customer:{{ finalizedDetailedQuote.customer.name }} Status:{{ finalizedDetailedQuote.status }} Price: ${{ finalizedDetailedQuote.totalCost }} </span>
            <button @click="updateFinalizedQuote(index)">Update</button>
        </div>
        <QuoteFormComponent v-if="showQuoteForm" :customer="selectedCustomer" :isUpdate="true" :detailedQuote="currentDetailedQuote" @close="closeQuoteForm" @quoteRender="fetchFinalizedQuotes" />
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
            finalizedDetailedQuotes: [],
            username: '',
            password: '',
            showQuoteForm: false,
            selectedCustomer: [],
            currentDetailedQuote: [],
        };
    },
    created() { // Put functions in here to be called as soon as the component is loaded in
        this.fetchFinalizedQuotes();
    },
    components: { // Like ejs partials. lets you add sections of code into this component. Example is you can have a component that uses 3 components.
        HeadquartersHeaderComponent,
        QuoteFormComponent,
    },
    methods: {  // Put functions in here that you want to call either inside the script or in the template
        async fetchFinalizedQuotes() {
            try {
                const response = await axios.get('http://localhost:3000/api/detailed-quotes?status=finalized');
                this.finalizedDetailedQuotes = response.data.detailedQuotes;
            } catch(err) {
                console.error(err);
                this.$router.push({ name: 'error' }); 
            }
        },
        updateFinalizedQuote(index) {
            this.selectedCustomer = this.finalizedDetailedQuotes[index].customer;
            this.currentDetailedQuote = this.finalizedDetailedQuotes[index];
            this.showQuoteForm = true;
            console.log('you clicked the editSalesAssociate funtion');
            console.log(this.finalizedDetailedQuotes[index]);
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