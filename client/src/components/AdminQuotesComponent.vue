<template>
    <AdminHeaderComponent /> <!-- Everything in the AdminHeaderComponent will display here -->
    <main>
        <h1>Quotes</h1>
    </main>
</template>
  
<!-- Everything inside your script tag is your controller -->
<script>
import AdminHeaderComponent from './AdminHeaderComponent.vue';

export default {
    data () {
        return {

        };
    },
    components: {
        AdminHeaderComponent
    },
    methods: {
    }
}
</script>
  
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>