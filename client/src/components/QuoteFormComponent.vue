<template>
    <div class="box">
        <!-- Customer information goes here -->
        <div>
            <span>{{ isEditing ? 'Edit Quote For: ' : 'New Quote For: ' }}{{ customer.name }}</span>
            <button @click="close">X</button>
        </div>
        <div>{{ customer.city }}</div>
        <div>{{ customer.street }}</div>
        <div>{{ customer.contact }}</div>

        <!-- Email for customer -->
        <label for="email">Email:</label>
        <input v-model="email" type="email" placeholder="Email" :disabled="disableEmail" id="email">

        <!-- Adding an item to a form -->
        <button v-if="!disableItems" @click="addNewItem">Add Item</button>
        <div v-for="(item, index) in items" :key="index" class="item">
            <input v-model="item.description" :disabled="!item.editing" placeholder="Description" type="text"/>
            <input v-model.number="item.amount" :disabled="!item.editing" placeholder="Amount" type="number" />
            <button v-if="item.editing && !disableItems" type="button" @click="saveItem(index)">Save</button>
            <button v-if="!item.editing && !disableItems" type="button" @click="editItem(index)">Edit</button>
            <button v-if="!disableItems" type="button" @click="removeItem(index)">Remove</button>
        </div>

        <!-- Adding a secret note -->
        <button v-if="!disableSecretNotes" @click="addNewSecretNote">Add Secret Note</button>
        <div v-for="(secretNote, index) in secretNotes" :key="index">
            <input v-model="secretNote.description" type="text" placeholder="Secret Note" :disabled="!secretNote.editing">
            <button v-if="secretNote.editing && !disableSecretNotes" @click="saveSecretNote(index)">Save</button>
            <button v-if="!secretNote.editing && !disableSecretNotes" @click="editSecretNote(index)">Edit</button>
            <button v-if="!disableSecretNotes" @click="removeSecretNote(index)">Remove</button>
        </div>

        <!-- Discount -->
        <div>
            <label for="discount">Discount:</label>
            <input v-model="discount" type="number" id="discount">
            <button @click="applyDiscount">Apply</button>
            <input v-model="discountType" type="radio" id="percent" name="discountType" value="percent" checked>
            <label for="percent">Percent</label>
            <input v-model="discountType" type="radio" id="amount" name="discountType" value="amount">
            <label for="amount">Amount</label>
        </div>

        <!-- Total amount -->
        <div>
            Amount: ${{ totalCost }}
        </div>

        <!-- Save button -->
        <button @click="saveQuote">{{ isEditing ? 'Update Quote' : 'Create Quote' }}</button>
        <br>
        <button v-if="status === 'open'" @click="finalizeQuote">Finalize Quote</button>
        <button v-if="status === 'finalized'" @click="sanctionQuote">Sanction Quote</button>
        <button v-if="status === 'sanctioned'" @click="processQuote">Process Quote</button>


    </div>
</template>

<script>
import axios from 'axios';

export default {
    props: {
        customer: {
            type: Object,
            required: true,
        },
        detailedQuote: {
            type: Object,
            default: null,
        },
        isUpdate: {  // not doing anything with this. may make this react depending on status for quote
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            items: this.detailedQuote ? this.detailedQuote.items : [],
            secretNotes: this.detailedQuote ? this.detailedQuote.secretNotes : [],
            email: this.detailedQuote ? this.detailedQuote.email : '',
            totalCost: this.detailedQuote ? this.detailedQuote.totalCost : 0,
            status: this.detailedQuote ? this.detailedQuote.status : 'open',
            discount: 0,
            discountType: 'percent',
            disableEmail: false,
            disableItems: false,
            disableSecretNotes: false,
            sendEmail: false,
        };
    },
    computed: {
        isEditing() {
            return this.detailedQuote !== null;
        },
    },
    created() {
        this.disableInputByStatus();
    },
    methods: {

        // Item methods
        addNewItem() {
            this.items.push({ description: '', amount: 0, editing: true });
        },
        saveItem(index) {
            let item = this.items[index];
            this.totalCost += item.amount;
            item.editing = false;
        },
        editItem(index) {
            let item = this.items[index];
            this.totalCost -= item.amount;
            this.items[index].editing = true;
        },
        removeItem(index) {
            let item = this.items[index];
            if (!item.editing) {
                this.totalCost -= item.amount;
            } 
            this.items.splice(index, 1);
        },

        // Secret note methods
        addNewSecretNote() {
            this.secretNotes.push({ description: '', editing: true });
        },
        saveSecretNote(index) {
            this.secretNotes[index].editing = false;
        },
        editSecretNote(index) {
            this.secretNotes[index].editing = true;
        },
        removeSecretNote(index) {
            this.secretNotes.splice(index, 1);
        },

        // Discount methods
        applyDiscount() {
            if (this.discountType === 'percent') {
                this.totalCost -= this.totalCost * (this.discount / 100);
            } else if (this.discountType === 'amount') {
                this.totalCost -= this.discount;
            }
            this.discount = 0;
        },

        // create or update or finalize the quote
        async saveQuote() {
            if (!this.items || !this.email) {
                console.log('Not all required fields are filled out');
                return;
            }

            try {
                const d = new Date();
                const dformat = [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('-');

                const payload = {
                    customerId: this.customer.id,
                    email: this.email,
                    items: this.items,
                    status: this.status,
                    secretNotes: this.secretNotes,
                    totalCost: this.totalCost,
                    date: dformat,
                    sendEmail: this.sendEmail,
                };

                this.sendEmail = false; // Set it back to default of false after passing the value in payload
                let response = '';
                if (this.isEditing) {
                    payload.id = this.detailedQuote.id;
                    payload.salesAssociateId = this.detailedQuote.salesAssociateId;
                    response = await axios.put('http://localhost:3000/api/quotes', payload, {
                        headers: { 'Content-Type': 'application/json' }
                    });
                } else {
                    payload.salesAssociateId = this.$store.state.salesAssociate.id;
                    response = await axios.post('http://localhost:3000/api/quotes', payload, {
                        headers: { 'Content-Type': 'application/json' }
                    });
                } // Could do a patch maybe to update the status
                this.$store.dispatch('showNotification', response.data.message);
                this.$emit('quoteRender');
                this.$emit('close');
            } catch (err) {
                this.$store.dispatch('showNotification', err);
            }
        },
        finalizeQuote() {
            this.status = 'finalized';
            this.saveQuote();
        },
        sanctionQuote() {
            this.sendEmail = true;
            this.status = 'sanctioned';
            this.saveQuote();
        },
        processQuote() {
            this.status = 'ordered';
            this.saveQuote();
        },

        // Close the quote form component
        close() {
            this.$emit('close');
        },

        resetForm() {
            this.items = [];
            this.secretNotes = [];
            this.email = '';
            this.totalCost = 0;
            this.status = 'open';
            this.discount = 0;
            this.discountType = 'percent';
        },
        disableInputByStatus() {
            if (this.status !== 'open') {
                this.disableEmail = true;
                if (this.status !== 'finalized') {
                    this.disableItems = true;
                    this.disableSecretNotes = true;
                }
            }
        },
    },
    watch: {
        detailedQuote: {
            immediate: true,
            handler(newVal) {
                if (newVal) {
                    this.items = newVal.items;
                    this.secretNotes = newVal.secretNotes;
                    this.email = newVal.email;
                    this.totalCost = newVal.totalCost;
                    this.status = newVal.status;
                } else {
                    this.resetForm();
                }
            }
        }
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
  