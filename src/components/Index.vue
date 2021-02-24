<template>
    <div>
        <Header></Header>
        <div style="display: flex; flex-direction: row">
            <sidebar></sidebar>
            <new-project></new-project>
        </div>

    </div>
</template>

<script>
    import newProject from "./newProject";
    import sidebar from "./sideBar";
    import Header from "./header";

    export default {
        name: "Index.vue",
        components: {
            Header,
            sidebar,
            newProject
        }
    }
</script>

<style scoped>

</style>
