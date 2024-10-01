<template>
  <!-- This is where the routed components will be rendered -->
  <router-view></router-view>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif:wght@400;700&display=swap');

html {
    margin: 0;
    padding: 0;
    height: 100%;
    background: rgb(0,148,12);
    background: linear-gradient(148deg, rgba(0,148,12,0.6110819327731092) 10%, rgba(151,255,64,0.6727065826330532) 78%, rgba(180,252,69,0.7567401960784313) 100%);
}

body {
    font-family: 'Noto Serif', serif;
    display: grid;
    grid-template-columns: 80%;
    justify-content: center;
}

.row {
    display: flex;
    margin-bottom: 5px; 
}

.box {
    background: rgba(255, 255, 255, 0.35);
    margin: 10px;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
}
</style>
