<template>
    <div class="new-project-container">
        <span class="new-project-maintitle">新增專案</span>
        <div style="display: flex; flex-direction: row; height: 100%; overflow: hidden;">
            <project-info style="flex: 1"></project-info>
            <setting-project style="flex: 2; overflow: hidden;"></setting-project>
        </div>

    </div>
</template>
<script>
    import projectInfo from "./newProject/projectInfo";
    import settingProject from "./newProject/settingProject";

    export default {
        name: "newProject.vue",
        components: {
            'project-info': projectInfo,
            'setting-project': settingProject
        },
    }
</script>

<style scoped>
    .new-project-container {
        display: flex;
        flex-direction: column;
        width: 100vw;
        background-color: #F6F7FA;
        padding: 19px 20px 22px 0px;
    }

    .new-project-maintitle {
        font-weight: bolder;
        margin-left: 32px;
        font-size: 20px;
    }

    .info-detail > div:first-child {
        margin-bottom: 8px;
    }


</style>
