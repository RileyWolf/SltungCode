<template>
    <div>
        <div class="projectDetail-div">
            <div class="peojectdetail-name-div"> {{ this.projectId }} </div>
            <div class="peojectdetail-amount-div">999999 張</div>
            <div class="detail-table-div">
                <el-tabs v-model=" activeName " @tab-click=" handleClick " class="tab-div">
                    <el-tab-pane label="標註任務" name="label">
                        <label-project task-list='label'></label-project>
                    </el-tab-pane>
                    <el-tab-pane label="確認任務" name="confirm">
                        <label-project task-list='confirm'></label-project>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </div>
</template>

<script>
import labelProject from "@/components/workList/labelProject.vue";
    export default {
        props: ['projectId'],
        name: "detailsProject",
        components: {
            labelProject,
        },
        data() {
            return {
                activeName: 'label', //初始選中的頁面
            }
        },
        mounted() {
            this.$nextTick( function() {
                this.style()
            })
        },
        updated() {
            this.$nextTick( function() {
                this.style()
            })
        },
        methods: {
            handleClick( tab, event ) {
                console.log(tab, event);
            },
            style() {
                document.querySelector('.el-tabs .el-tabs__active-bar.is-top').style.width = "90px"
            }
        }
    }
</script>

<style scoped>
    .el-tabs >>> .el-tabs__item {
        font: normal normal medium 16px/24px;
        font-size: 16px;
    }
    .el-tabs >>> .is-active {
        color: #4481FF;
    }
    .el-tabs >>> .el-tabs__nav {
        padding: 0px 20px;
    }
    .el-tabs >>> .el-tabs__active-bar {
        width: 90px;
        left: 10px;
    }
    .projectDetail-div {
        width: 1590px;
        height: 1025px;
        background-color: #F6F7FA;
        position: relative;
        margin-left: 270px;
    }
    .detail-div {
        font-size: 20px;
        color: #233044;
        opacity: 1;
        position: relative;
    }
    .detail-table-div {
        width: 1550px;
        height: 948px;
        background: #FFFFFF 0% 0% no-repeat padding-box;
        border-radius: 5px;
        opacity: 1;
        position: relative;
        top: 58px;
        left: 20px;
    }
    .peojectdetail-name-div {
        font-weight:bold;
        font-size: 20px;
        color: #233044;
        position: absolute;
        top: 19px;
        left: 20px;
    }
    .peojectdetail-amount-div {
        color: #6C757D;
        font: normal normal normal 20px/23px Arial;
        position: absolute;
        top: 20px;
        left: 1460px;
    }
    .tab-div {
        width: 1510px;
        position: absolute;
        margin-left: 20px;
        margin-right: 20px;
        /* left: 20px;  */
        top: 23px;
    }
</style>