<template>
    <header>
      <div class="row header-box">
        <div class="site-title">
          Plant Repair Services: Portal <!-- This can be dynamically changed based on the component -->
        </div>
  
        <!-- Show "Sign in" button if not authenticated -->
        <div v-if="!isAuthenticated">
          <button @click="navigateTo({ name: 'login' })">
            Sign in
          </button>
        </div>
  
        <!-- Show username and "Sign out" button if authenticated -->
        <div v-if="isAuthenticated">
          <span>{{ salesAssociate.username }}</span>
          <button @click="logout">
            Sign out
          </button>
        </div>
      </div>
      <div v-if="notification">{{ notification }}</div>
    </header>
</template>

<script>
export default {
    data () {
        return {
        }
    },
    computed: {
        isAuthenticated() {
            return this.$store.state.isAuthenticated;
        },
        salesAssociate() {
            return this.$store.state.salesAssociate || {};
        },
        notification() {
            return this.$store.state.notification;
        },
    },
    methods: {
        navigateTo(route) {
            this.$router.push(route);
        },
        logout() {
            this.$store.commit('logout');
        }
    }
}
</script>


<style scoped>

.header-box {
    background: rgba(255, 255, 255, 0.5);
    position: relative;
    height: 70px;
    width: 100%;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
    padding: 15px;
    justify-content: flex-start;
    align-items: flex-end;
}

.header-box a {
    color: #222;
    text-decoration: none;
    padding-left: 25px;
    font-size: 25px;
    margin-left: 20px;
}

.site-title {
    font-size: 35px;
    margin-right: auto;
}
</style>
