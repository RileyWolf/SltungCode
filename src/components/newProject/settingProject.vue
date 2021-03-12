<template>
    <div class="setting-project-container">
        <div v-if="nowProjectId" style="height: 100%;">
            <el-tabs v-model="activeName">
                <el-tab-pane v-for="func in functionList" :key="func.name" :label="func.label" :name="func.name">
                    <component :is="activeName" v-if="activeName === func.name"></component>
                </el-tab-pane>
            </el-tabs>
        </div>
        <div v-else style="text-align: center; margin-top: 20%">
            <i class="el-icon-lock" style="font-size: 60px"></i>
            <div style="margin-top: 20px; font-size: 20px">請先完成專案資訊再進行專案設定</div>
        </div>
    </div>
</template>

<script>
    import labelSetting from "./labelSetting";
    import importData from "./importData";
    import taskSharing from "./taskSharing"
    import exportData from "./exportData";
    import { mapState } from "vuex"

    export default {
        name: "settingProject.vue",
        components: {
            labelSetting,
            importData,
            taskSharing,
            exportData
        },
        computed: {
            ...mapState({
                nowProjectId: state => state.nowProjectId
            })
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
        }
    }
</script>

<style scoped>
    .el-tabs >>> .el-tabs__item {
        color: #6C757D;
        font-size: 16px;
    }

    .el-tabs >>> .el-tabs__item.is-active {
        color: #4481FF;
        font-weight: bold;
    }

    .el-tabs >>> .el-tabs__active-bar  {
        background-color: #4481FF;
    }

    .setting-project-container {
        background-color: #FFFFFF;
        padding: 15px 20px;
        margin-top: 10px;
        margin-left: 20px;
        position: relative;
    }

    .el-tabs {
        height: 100%;
    }

    .el-tabs >>> .el-tabs__content {
        height: calc(100% - 40px);
    }

    .el-tabs >>> .el-tab-pane {
        height: 100%;
    }

    .el-tabs >>> .el-tabs__header {
        margin: 0;
    }
</style>
