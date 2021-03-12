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
        overflow-x: hidden;
    }

    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        font-size: 16px;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #233044;
    }

    /* width */
    ::-webkit-scrollbar {
        width: 5px;
        height: 5px;
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: #4481FF;
        border-radius: 4px;
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
        background: #296bf0;
    }
    
    .el-select-dropdown__item.selected {
        color: #4481FF;
        font-weight: 700;
    }
</style>
