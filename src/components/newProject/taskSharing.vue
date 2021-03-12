<template>
    <div class="flex-column" style="padding: 0;height: 100%;">
        <div class="dashboard flex-row" style="justify-content: space-between;">
            <div class="flex-row">
                <div class="dbtItem">
                    <span>總數</span>
                    <span class="text">{{ dashboard.total }}</span>
                </div>
                <div class="dbtItem">
                    <span>已分派</span>
                    <span class="text">{{ dashboard.assigned }}</span>
                </div>
                <div class="dbtItem">
                    <span>未分派</span>
                    <span class="text">{{ dashboard.unassigned }}</span>
                </div>
                <div class="dbtItem">
                    <span>參與者</span>
                    <span class="text">{{ dashboard.member }}</span>
                </div>
            </div>
            <div class="flex-row">
                <div class="dbtItem">
                    <span>未標註</span>
                    <span class="text">{{ dashboard.unlabeled }}</span>
                </div>
                <div class="dbtItem">
                    <span>未確認</span>
                    <span class="text">{{ dashboard.unconfirmed }}</span>
                </div>
            </div>
        </div>
        <div class="subtab flex-row">
            <div class="subtabItem" :class="{ selected : subtabSelected === 'label'}" @click="switchSub('label')">標註分派</div>
            <div class="subtabItem" :class="{ selected : subtabSelected === 'confirm'}" @click="switchSub('confirm')">確認分派</div>
        </div>        
        <member-table ref="refMemberTable"
                        v-if="nowMember.length !== 0 && subtabSelected !== ''"
                        :dashboard.sync="dashboard"
                        :nowMember.sync="nowMember"
                        :nowPage.sync="nowPage"
                        :subtabSelected.sync="subtabSelected"
                        :confirmCanAssign.sync="confirmCanAssign"
                        @updateCanAssign="updateCanAssign" />
        <pagination v-if="Object.keys(nowPagination).length > 0"
                        :nowPagination.sync="nowPagination" 
                        @updatePage="nowPage = $event"/>
    </div>
</template>

<script>
    import memberTable  from '@/components/newProject/taskSharing/memberTable.vue'
    import pagination  from '@/components/newProject/taskSharing/pagination.vue'
    import { getProjectMember, getTaskAssignedStatus } from '@/api/index.js'

    export default {
        name: "taskSharing.vue",
        components: {
            memberTable,
            pagination,
        },
        data() {
            return {
                dashboard: {
                    total: 0,
                    assigned: 0,
                    unassigned: 0,
                    member: 0,
                    unlabeled: 0,
                    unconfirmed: 0,
                },
                confirmCanAssign : 0,
                subtabSelected: '',

                labelMember: [],
                confirmMember: [],

                labelPagination: {
                    total: 0,
                    nowPage: 0,
                    nowRange: '',
                },
                confirmPagination: {
                    total: 0,
                    nowPage: 0,
                    nowRange: '',
                },

                //  table 需要的
                nowMember: [],
                nowPage: 0,
                //  pagination 需要的
                nowPagination: {},
            };
        },
        watch: {
            subtabSelected() {
                if (this.subtabSelected === 'label') {
                    this.nowMember = this.labelMember
                    this.nowPage = this.labelPagination.nowPage
                    this.nowPagination = this.labelPagination
                } else if (this.subtabSelected === 'confirm') {
                    this.nowMember = this.confirmMember
                    this.nowPage = this.confirmPagination.nowPage
                    this.nowPagination = this.confirmPagination
                }
            },
        },
        mounted() {
            this.getTaskAssignedStatus()
            this.getProjectMember()
        },
        methods: {
            //  取得任務資訊
            async getTaskAssignedStatus() {
                let param = {
                    project_id: this.$store.state.nowProjectId
                }
                let result = await getTaskAssignedStatus(param)
                console.log('getTaskAssignedStatus', result);

                if(result.result) {
                    this.dashboard =  {
                        total: result.files_imported,
                        assigned: result.labeler_assigned,
                        unassigned: result.files_imported - result.labeler_assigned,
                        member: result.participants,
                        unlabeled: result.labeler_ongoing,
                        unconfirmed: result.confirmer_ongoing,
                    }    
                    this.confirmCanAssign = this.dashboard.total
                }
            },
            //  取得此專案底下的人員
            async getProjectMember() {
                let paramObj = {
                    project_id: this.$store.state.nowProjectId,
                    include_task_info: true,
                }
                let result = await getProjectMember(paramObj)
                console.log(result);
                
                if(result.result) this.reformatData(result)
            },
            //  依照 permission push 到個別的 list
            reformatData(result) {
                console.log('reformatData', result.user_list);
                result.user_list.forEach((item, index) => {
                    const isLabeler = item.permission.findIndex(i => i === 'labeler')
                    const isConfirmer = item.permission.findIndex(i => i === 'confirmer')
                    console.log(`第${index + 1}人 / isLabeler ${isLabeler}  / isConfirmer ${isConfirmer}`);
                    if(isLabeler !== -1) {
                        this.labelMember.push({
                            user_id: item.user_id,
                            user_name: item.fullname,
                            done: item.task_status.labeler.done,
                            undone: item.task_status.labeler.ongoing,
                            descirbe: '',
                            descirbeStyle: '',
                            countingNum: ''
                        })
                    }

                    if(isConfirmer !== -1) {
                        this.confirmMember.push({
                            user_id: item.user_id,
                            user_name: item.fullname,
                            done: item.task_status.confirmer.done,
                            undone: item.task_status.confirmer.ongoing,
                            descirbe: '',
                            descirbeStyle: '',
                            countingNum: ''
                        })
                    }
                })
                this.countPage()
                this.subtabSelected = 'label'
            },
            //  計算頁面相關參數
            countPage () {
                this.labelPagination.total = Math.ceil(this.labelMember.length / 10)
                if(this.labelMember.length < 10){
                    this.labelPagination.nowPage = 1
                    this.labelPagination.nowRange = `1 - ${ this.labelMember.length }`
                } else {
                    this.labelPagination.nowPage = 1
                    this.labelPagination.nowRange = `1 - 10`
                }

                this.confirmPagination.total = Math.ceil(this.confirmMember.length / 10)
                if(this.confirmMember.length < 10){
                    this.confirmPagination.nowPage = 1
                    this.confirmPagination.nowRange = `1 - ${ this.confirmMember.length }`
                } else {
                    this.confirmPagination.nowPage = 1
                    this.confirmPagination.nowRange = `1 - 10`
                }
            },
            updateCanAssign(val) {
                this.confirmCanAssign = val
            },
            switchSub(val) {
                if(!this.$refs.refMemberTable.loadingData) this.subtabSelected = val
                else this.$message.warning('請等資料讀取完成！')
            },
        },
    }
</script>

<style scoped>
    .dashboard {
        padding: 18px 25px;
        background-color: #F6F7FA;
        border-bottom: 1px solid #DEE2E6;
        margin-bottom: 15px;
    }

    .flex-row {
        display: flex;
        align-items: center;
    }

    .flex-column {
        display: flex;
        flex-direction: column;
        flex: 1;
        padding: 0 10px;
    }

    .dbtItem {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100px;
        margin-right: 10px;
        border-radius: 3px;
        background-color: #FFFFFF;
        box-shadow: 0px 3px 6px #00000029;
        padding: 15px 15px 13px;
        color: #334560;
        line-height: 20px;
    }

    .dbtItem .text {
        font-weight: bold;
    }

    .subtab {
        border-bottom: 1px solid #DEE2E6;
        margin-bottom: 10px;
    }

    .subtabItem {
        position: relative;
        bottom: -1px;
        padding: 10px 20px;
        border: 1px solid transparent;
        cursor: pointer;
        transition: all .3s;
    }

    .subtabItem.selected {        
        border: 1px solid #DEE2E6;
        border-bottom: 1px solid #FFFFFF;
    }
</style>
