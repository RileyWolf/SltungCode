<template>
    <div id="app">
        <!--    <HelloWorld msg="Welcome to Your Vue.js App"/>-->
        <router-view></router-view>
    </div>
</template>

<script>
    // import HelloWorld from './components/LoginPage.vue'

    export default {
        name: 'App',
        components: {
            // HelloWorld
        }
    }
</script>

<style>
    body, html {
        margin: 0;
        padding: 0;
        height: 100%;
    }

    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #233044;
    }
</style>
