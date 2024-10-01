<template>
    <AdminHeaderComponent /> <!-- Everything in the AdminHeaderComponent will display here -->
    <main>
    <div class="box">
        <div class="box">
            <div><b>Sales Associates</b>
                <button id="headerButton" v-if="!showAdminForm" @click="addNewSalesAssociate">New associate..</button>                
            </div>
                <AdminFormComponent v-if="showAdminForm" @salesAssociateAdded="fetchSalesAssociates" @close="closeAdminForm" />
                <AdminEditComponent v-if="showEditForm" :salesAssociate="salesAssociate" @close="closeEditForm"/>
                <hr>
                <table>
                    <thead>
                        <th>Associate#</th>
                        <th>Sales Associate</th>
                        <th>City</th>
                        <th>Commission</th>
                        <th></th>
                        <th></th>
                    </thead>
                    <tbody>
                        <tr v-for="(salesAssociate, index) in salesAssociates" :key="index">
                            <td class="id" scope="row">{{ salesAssociate.id }} </td>
                            <td class="customerName" scope="row">{{ salesAssociate.username }}</td>
                            <td class="customerName" scope="row">{{ salesAssociate.city }}</td>
                            <td class="customerName" scope="row"><i>${{ salesAssociate.commission }}</i></td>
                            <td class="id" scope="row">
                                <button id="headerButton" @click="editSalesAssociate(index)">Edit</button>
                            </td><td>
                                <button id="headerButton" @click="deleteSalesAssociate(index)">Delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
                <div class ="box">
                    <div><b>Sales Records</b>
                    <button id="headerButton">Open quote</button></div>
                    <hr>
                    <table>
                        <thead>
                            <th>Quote#</th>
                            <th>Associate#</th>
                            <th>Date range</th>
                            <th>Customer</th>
                            <th>Status</th>
                            <th>Sales Associate</th>
                            <tr>
                                <td class="filterBar">Search:</td>
                            <!-- associate id -->
                                <td id="searchId">
                                    <input v-model="searchId" id="searchId" type="number" min="0">
                                </td>
                            <!-- date -->
                                <td>
                                    <input id="searchDate" type="date">
                                </td>
                            <!-- customers -->
                                <td class="filterBar">
                                    <select>               
                                        <option>None</option>
                                        <option v-for="(detailedQuote, index) in detailedQuotes" :key="index">{{ detailedQuote.customer.name }}</option>
                                    </select>                           
                                </td>
                            <!-- status -->
                                <td class="filterBar">
                                    <select>
                                        <option>None</option>
                                        <option>Finalized</option>
                                        <option>Sanctioned</option>
                                        <option>Ordered</option>
                                    </select>
                                </td>
                            <!-- associate name -->
                                <td class="filterBar">
                                    <select>
                                        <option>None</option>
                                        <option v-for="(salesAssociate, index) in salesAssociates" :key="index">{{ salesAssociate.username }}</option>
                                    </select>
                                </td>
                            </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(detailedQuote, index) in detailedQuotes" :key="index">
                            <td class="id" scope="row">{{ detailedQuote.id }}</td> <!-- not actually a quote id -->
                            <td class="id" scope="row">{{ detailedQuote.salesAssociate.id }}</td>
                            <td class="statusDate" scope="row">{{ detailedQuote.date }}</td>
                            <td class="customerName" scope="row">{{ detailedQuote.customer.name }}</td>
                            <td class="statusDate" scope="row">{{ detailedQuote.status }}</td>
                            <td class="associateName" scope="row">{{ detailedQuote.salesAssociate.username }}</td>
                        </tr>
                    </tbody>               
                </table>
            </div>
        </div>
    </main>
</template>
  
<!-- Everything inside your script tag is your controller -->
<script>
import axios from 'axios';
import AdminHeaderComponent from './AdminHeaderComponent.vue';
import AdminFormComponent from './AdminFormComponent.vue';
import AdminEditComponent from './AdminEditComponent.vue';

export default {
    data () { // Basically this is where you put data that you want your script and template(html code) to communicate back and forth with
        return {
            customers: [], 
            detailedQuotes: [], 
            salesAssociates: [],
            salesAssociate: [],
            username: '',
            password: '',
            commission: 0,
            city: '',
            street: '',
            showAdminForm: false,
            showEditForm: false,
        };
    },
    created() { // Put functions in here to be called as soon as the component is loaded in
        this.fetchSalesAssociates();
        this.fetchDetailedQuotes();
    },
    components: { // Like ejs partials. lets you add sections of code into this component. Example is you can have a component that uses 3 components.
        AdminHeaderComponent,
        AdminFormComponent,
        AdminEditComponent,
    },
    methods: {  // Put functions in here that you want to call either inside the script or in the template
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
                const response = await axios.get('http://localhost:3000/api/detailed-quotes');
                this.detailedQuotes = [];
                this.detailedQuotes = response.data.detailedQuotes;
            } catch (err) {
                console.error(err);
                this.$router.push({ name: 'error' }); 
            }
        },
        async fetchSalesAssociates() {
            try {
                const response = await axios.get('http://localhost:3000/api/sales-associates');
                this.salesAssociates = response.data;
            } catch(err) {
                console.error(err);
                this.$router.push({ name: 'error' }); 
            }
        },
        editSalesAssociate(index) {
            this.salesAssociate = this.salesAssociates[index];
            this.showEditForm = true;
        },
        async deleteSalesAssociate(index) {
        
            window.confirm("Are you sure you want to delete " + this.salesAssociates[index].username + "?");
            
            try
            {
                await axios.delete(`http://localhost:3000/api/sales-associates/${this.salesAssociates[index].id}`);

            } catch (err) {
                console.error(err);
            } 
        },
        addNewSalesAssociate() {
            this.showAdminForm = !this.showAdminForm;
        },
        closeAdminForm() {
            this.showAdminForm = false;
        },
        closeEditForm() {
            this.showEditForm = false;
        }
    },
}

</script>
  
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

table {
    border: 1px solid rgb(109, 109, 109);
    border-collapse: collapse;
    font-size: 0.8rem;
    letter-spacing: 1px;
    overflow: scroll;
}

th {
    background-color:rgba(255, 255, 255, 0.5);
    border: 1px solid rgb(109, 109, 109);
    padding: 8px 10px;
    text-align: center;
}

td {
    border-left: 1px solid rgb(207, 207, 207);
}

td.id {
    width: 50px;
    text-align: center;
}

td.customerName {
    width: 325px;
}

td.statusDate {
    width: 100px;
    text-align: center;
}

td.associateName {
    width: 250px;
    text-align: center;
}

td.filterBar {
    text-align: center;
    border-right:1px solid rgb(109, 109, 109);
    border-bottom: 2px solid rgb(196, 196, 196);
    background-color: rgb(240, 240, 240);
}

#searchId {
    border: none;
    width: 100px;
    background-color: rgb(255, 255, 255);
}

#searchDate {
    border: none;
}

select {
    left: 0;
    top: 0;
    border: none;
    width: 100%;
    overflow: scroll;
    background-color: rgba(229, 229, 229, 0.031);
}

tr:nth-of-type(even) {
    background-color: rgba(255, 255, 255, 0.829);
}

tr:nth-of-type(odd) {
    background-color: rgba(245, 245, 245, 0.829);
}

td:nth-of-type(1) {
    border-left: 1px solid rgb(109, 109, 109);
}

#headerButton {
    float: right;
}

</style>