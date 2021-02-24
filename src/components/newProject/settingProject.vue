<template>
    <div class="setting-project-container">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane v-for="func in functionList" :key="func.name" :label="func.label" :name="func.name">
                <component :is="activeName"></component>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import labelSetting from "./labelSetting";
    import importData from "./importData";
    import taskSharing from "./taskSharing"
    import exportData from "./exportData";

    export default {
        name: "settingProject.vue",
        components: {
            labelSetting,
            importData,
            taskSharing,
            exportData
        },
        data() {
            return {
                activeName: 'labelSetting',
                functionList: [
                    {
                        label: '標註設定',
                        name: 'labelSetting'
                    }, {
                        label: '匯入資料',
                        name: 'importData'
                    }, {
                        label: '任務分派',
                        name: 'taskSharing'
                    },
                    {
                        label: '匯出資料',
                        name: 'exportData'
                    }]
            }
        },
        methods: {

            handleClick(tab, event) {
                console.log(tab, event);
            }
        },
    }
</script>

<style scoped>
    .setting-project-container {
        background-color: #FFFFFF;
        padding: 15px 20px;
        margin-top: 10px;
        margin-left: 20px;
        position: relative;
    }
</style>
