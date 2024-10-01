<template>
    <header>
        <div class="row header-box">
            <div class="site-title">
            Plant Repair Services: Administration
            </div>
        </div>
    </header>
</template>
  
<!-- Everything inside your script tag is your controller -->
<script>
export default {
    data () {
        return {

        };
    },
    components: {
    },
    methods: {
        navigateTo(route) {
            this.$router.push(route);
        },
    }
}
</script>
  
<!-- Add "scoped" attribute to limit CSS to this component only -->
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