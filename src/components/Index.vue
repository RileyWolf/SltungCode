<template>
    <div>
        <Header></Header>
        <div class="container">
            <sidebar></sidebar>
            <component :is="getNowFunction"></component>
        </div>

    </div>
</template>

<script>
    import workList from "./workList";
    import newProject from "./newProject";
    import advanceSearch from "./advanceSearch";
    import settingAccount from "./settingAccount";
    import sidebar from "./sideBar";
    import Header from "./header";
    import projectList from "./projectList";
    import projectManagement from "./projectManagement";
    import {mapGetters} from "vuex"

    export default {
        name: "Index.vue",
        components: {
            Header,
            sidebar,
            workList,
            newProject,
            advanceSearch,
            settingAccount,
            projectList,
            projectManagement
        },
        computed: {
            ...mapGetters({
                getNowFunction: 'getNowFunction'
            })
        },
        data() {
            return {
                showInner: 'newProject',
            }
        }
    }
</script>

<style scoped>
    .container {
        display: flex;
        height: calc(100vh - 55px);
    }
</style>
