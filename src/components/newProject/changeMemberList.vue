<template>
    <el-dialog ref="dialog" :visible="dialogVisible" width="960px" top="6vh"
               :close-on-click-modal="false"
               :before-close="close">
        <div class="container">
            <div class="all-member">
                <p class="title">全部名單</p>
                <div class="setting-box">
                    <i class="el-icon-more"></i>
                    <el-select class="project-dropdown"
                               v-model="selectedProject"
                               placeholder="Dropdownlist (Project)"
                               clearable
                               @change="getProjectUser">
                        <el-option
                                v-for="item in getProjectList"
                                :key="item.project_id"
                                :label="item.project_name"
                                :value="item.project_id">
                        </el-option>
                    </el-select>
                </div>
                <div class="move-btn-box">
                    <div class="move-btn border-radius-left" @click="moveAlltoRight()">
                        <i class="el-icon-d-arrow-right"></i>
                    </div>
                    <div class="move-btn border-radius-right" style="justify-content: flex-end; padding-right: 13px;"
                         @click="moveSelectedtoRight()">
                        <div class="count">{{ allMemberSelection.length }}</div>
                        <i class="el-icon-arrow-right"></i>
                    </div>
                </div>
                <div style="position: relative">
                    <el-table
                            :data="allMemberList"
                            tooltip-effect="dark"
                            max-height="520"
                            @selection-change="handleSelectionChange"
                            ref="allListTable"
                            :default-sort="{ prop: 'account', order: 'descending'}">
                        <el-table-column
                                type="selection"
                                width="50"
                                sortable
                                :selectable="checkSelectable">
                        </el-table-column>
                        <el-table-column
                                prop="username"
                                label="帳號"
                                width="165"
                                show-overflow-tooltip
                                sortable>
                        </el-table-column>
                        <el-table-column
                            prop="fullname"
                            label="姓名"
                            width="90"
                            sortable>
                            <!-- <template slot-scope="scope">
                                <el-popover trigger="hover" placement="right" width="150">
                                    <p style="margin-bottom: 0;">標注品質</p>
                                    <i class="el-icon-star-on"
                                       :class="(i <= scope.row.ratings) ? 'fullstar' : 'blankstar'"
                                       v-for="i in 5" :key="`star + ${i}`"></i>
                                    <div slot="reference" class="name-wrapper">
                                        {{ scope.row.fullname }}
                                    </div>
                                </el-popover>
                            </template> -->
                        </el-table-column>
                        <el-table-column
                                prop="roles"
                                label="系統權限"
                                width="85"
                                show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column
                                prop="projectCount"
                                label="參與專案"
                                width="110"
                                show-overflow-tooltip
                                sortable>
                        </el-table-column>
                        <template slot="empty">
                            <div></div>
                        </template>
                    </el-table>
                    <div v-if="allMemberList.length==0" style="position: absolute; top: 80px; left: 40%">
                        該專案尚無設定參與人員
                    </div>
                </div>

            </div>
            <div class="joined-member">
                <p class="title">已加入名單</p>
                <div class="move-btn-box" style="margin-top: 55px;" @click="moveSelectedtoLeft()">
                    <div class="move-btn border-radius-left" style="justify-content: flex-start; padding-left: 13px;">
                        <i class="el-icon-arrow-left"></i>
                    </div>
                    <div class="move-btn border-radius-right" @click="moveAlltoLeft()">
                        <i class="el-icon-d-arrow-left"></i>
                    </div>
                </div>
                <div class="joined-member-title">
                    <p>姓名</p>
                    <p>本專案權限設定</p>
                </div>
                <ul class="joined-member-list">
                    <el-checkbox-group v-model="joinedMemberSelection">
                        <li class="joined-member-list-item" v-for="(member, index) in joinedMemberList" :key="index">
                            <el-checkbox class="member-name" :label="member">{{ member.fullname }}</el-checkbox>
                            <div class="linear-line"/>
                            <div class="toolbox">
                                <el-switch
                                        v-model="member.label"
                                        active-color="#84CD36"
                                        inactive-color="#DEE2E6">
                                </el-switch>
                                <p>標注</p>
                                <el-switch
                                        v-model="member.confirm"
                                        active-color="#84CD36"
                                        inactive-color="#DEE2E6">
                                </el-switch>
                                <p>確認</p>
                            </div>
                        </li>
                    </el-checkbox-group>
                </ul>
            </div>
        </div>
        <div slot="footer" class="dialog-footer">
            <div class="save" @click="doSave">確定</div>
        </div>
    </el-dialog>
</template>

<script>
    import {getProjectMember} from '@/api/index.js'
    import {mapGetters} from 'vuex'

    export default {
        name: "changeMemberList.vue",
        props: ['dialogVisible'],
        computed: {
            ...mapGetters({
                getUserList: 'getUserList',
                getProjectList: 'projectList'
            }),
        },
        data() {
            return {
                selectedProject: '',
                allMemberList: '',
                joinedMemberList: [],

                allMemberSelection: [],
                joinedMemberSelection: []
            };
        },
        mounted() {
            // this.getMemberList()

            // 從vuex取得全部人員清單
            this.allMemberList = this.getUserList
        },
        methods: {
            /*
            * 透過project id取得該專案底下的人員
            * */
            async getProjectUser() {
                if (this.selectedProject) {
                    let paramObj = {
                        project_id: this.selectedProject
                    }
                    let result = await getProjectMember(paramObj)
                    this.allMemberList = result.user_list
                    console.log('選定的專案底下的人員=>', result)
                } else {
                    this.allMemberList = this.getUserList
                }
            },
            close() {
                this.$emit('updateDialogVisible', false)
            },
            async doSave() {
                let paramObj = {
                    members_info_list: [],
                    project_id: ''
                }
                let canSave = true
                // 將加入的名單整理成api要的格式
                if (this.joinedMemberList) {
                    this.joinedMemberList.forEach(item => {
                        if (item.confirm || item.label) {
                            paramObj.members_info_list.push({
                                user_id: item.user_id,
                                permission: this.checkPermission(item)
                            })
                        } else {
                            canSave = false
                        }

                    })
                }
                if (canSave) {
                    this.$emit('storeUser', paramObj)
                } else {
                    this.$message({
                        message: '請選擇使用者權限',
                        type: 'warning'
                    });
                }
            },
            /*
            * 驗證該使用者有哪些權限
            * */
            checkPermission(item) {
                let arr = []
                if (item.confirm) {
                    arr.push('confirmer')
                }
                if (item.label) {
                    arr.push('labeler')
                }
                return arr
            },
            handleSelectionChange(val) {
                this.allMemberSelection = val;
            },
            moveAlltoRight() {
                this.joinedMemberList = []
                this.joinedMemberList = this.joinedMemberList.concat(this.allMemberList)
                this.$refs.allListTable.clearSelection()
            },
            // moveSelectedtoRight() {
            //     this.joinedMemberList = this.joinedMemberList.concat(this.allMemberSelection)
            //
            //     this.allMemberSelection.forEach(item => {
            //         let index = this.allMemberList.findIndex(i => i.id === item.id)
            //         this.allMemberList.splice(index, 1)
            //     })
            //     this.allMemberSelection = []
            //     this.joinedMemberSelection = []
            // },

            /*
            * 將選到的人員移至右邊加入名單
            * 110.03.03 子婷
            */
            moveSelectedtoRight() {
                this.joinedMemberList = this.joinedMemberList.concat(this.allMemberSelection)
                this.$refs.allListTable.clearSelection()
                this.joinedMemberSelection = []
            },
            /*
            * 如果加入名單已有全部名單內的成員 checkbox要呈現disable的狀態
            * */
            checkSelectable(row) {
                if (this.joinedMemberList.length > 0) {
                    let index = this.joinedMemberList.findIndex((item) => item.user_id == row.user_id)
                    if (index != -1) {
                        return false
                    }
                }
                return true
            },
            moveSelectedtoLeft() {
                // this.allMemberList = this.allMemberList.concat(this.joinedMemberSelection)

                this.joinedMemberSelection.forEach(item => {
                    console.log(item)
                    let index = this.joinedMemberList.findIndex(i => i.user_id === item.user_id)
                    console.log(index)
                    this.joinedMemberList.splice(index, 1)
                })
                this.joinedMemberSelection = []
                this.$refs.allListTable.clearSelection()
            },
            moveAlltoLeft() {
                // this.allMemberList = this.allMemberList.concat(this.joinedMemberList)
                this.joinedMemberList = []
            },
        },
    }
</script>

<style scoped>
    * {
        box-sizing: border-box;
    }

    .container {
        display: flex;
        justify-content: space-between;
        padding: 0 5px;
    }

    .all-member {
        flex: 5;
        display: flex;
        flex-direction: column;
    }

    .joined-member {
        margin-left: 20px;
        flex: 4;
        display: flex;
        flex-direction: column;
    }

    .title {
        font-size: 18px;
        font-weight: bold;
        color: #233044;
    }

    .setting-box {
        display: flex;
        margin-bottom: 15px;
    }

    .el-icon-more {
        position: relative;
        transform: rotate(90deg);
        margin-right: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #F6F7FA;
        color: #233044;
        width: 40px;
        height: 40px;
        border-radius: 3px;
        font-size: 21px;
        font-weight: bold;
        cursor: pointer;
        transition: all .3s;
    }

    .el-icon-more:hover {
        background-color: #e7e8eb;
    }

    .project-dropdown {
        width: 100%;
    }

    .move-btn-box {
        width: 100%;
        display: flex;
    }

    .move-btn {
        width: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 13px 0;
        background-color: #F6F7FA;
        color: #233044;
        cursor: pointer;
        transition: all .3s;
    }

    .move-btn:hover {
        background-color: #e7e8eb;
    }

    .move-btn i {
        font-weight: bold;
    }

    .border-radius-left {
        border-radius: 3px 0 0 3px;
    }

    .border-radius-right {
        border-radius: 0 3px 3px 0;
    }

    .count {
        margin-right: 25px;
        color: #4481FF;
    }

    .el-table {
        font-size: 16px;
    }

    .el-table >>> tr {
        height: 59px;
    }

    .el-table >>> tr td:nth-last-child(1) {
        text-align: right;
    }

    .el-table >>> thead .cell {
        color: #233044;
        font-weight: normal;
        font-size: 16px;
    }

    .el-table >>> thead tr th:nth-child(5) .cell {
        padding-right: 0;
        text-align: right;
    }

    .el-table >>> thead .caret-wrapper {
        margin-left: 6px;
        width: 8px;
        height: 15px;
        border-radius: 3px;
        background-color: #EEF1F6;
    }

    .el-table >>> .sort-caret {
        left: 1px;
        border: 3px solid transparent;
    }

    .el-table >>> thead .ascending {
        /* border-bottom-color: #707070; */
        top: 0;
    }

    .el-table >>> thead .descending {
        /* border-top-color: #707070; */
        bottom: 0;
    }

    .el-table >>> thead .el-checkbox {
        display: none;
    }

    .el-table >>> .el-checkbox__inner {
        width: 17px;
        height: 17px;
    }

    .el-table >>> .el-checkbox__inner::after {
        width: 5px;
        height: 9px;
        left: 4.5px;
        top: 1px;
    }

    .el-checkbox-group >>> .el-checkbox__inner {
        width: 17px;
        height: 17px;
    }

    .el-checkbox-group >>> .el-checkbox__inner::after {
        width: 5px;
        height: 9px;
        left: 4.5px;
        top: 1px;
    }

    .el-table >>> .el-table__body-wrapper {
        box-sizing: border-box;
        height: 462px;
        border: 1px solid #DEE2E6;
        top: -1px;
    }

    .el-table >>> .cell {
        color: #233044;
    }

    .el-table::before {
        height: 0;
    }

    .el-icon-star-on {
        font-size: 28px;
    }

    .fullstar {
        color: #FDB613;
    }

    .blankstar {
        color: #DEE2E6;
    }

    /* joined-member  start*/

    .joined-member-title {
        display: flex;
    }

    .joined-member-title p {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 50%;
        margin: 0;
        height: 59px;
        font-size: 16px;
        color: #233044;
    }

    .joined-member-list {
        display: flex;
        flex-direction: column;
        list-style: none;
        overflow-y: scroll;
        padding-left: 0;
        margin: 0;
        border: 1px solid #DEE2E6;
        height: 461px;
    }

    .joined-member-list-item {
        width: 100%;
        display: flex;
        align-items: center;
        font-size: 16px;
        border-bottom: 1px solid #DEE2E6;
    }

    .member-name {
        width: 50%;
        padding: 20px;
    }

    .linear-line {
        width: 1px;
        height: 30px;
        background: #DEE2E6;
    }

    .el-checkbox >>> .el-checkbox__label {
        font-size: 16px;
    }

    .toolbox {
        width: 50%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 15px;
    }

    .toolbox p {
        margin: 0;
        color: #233044;

    }

    .el-checkbox >>> .el-checkbox__label {
        color: #233044;
    }

    .el-checkbox >>> .el-checkbox__input.is-checked + .el-checkbox__label {
        color: #233044;
    }


    .el-switch >>> .el-switch__core {
        width: 35px !important;
        height: 18px;
    }

    .el-switch >>> .el-switch__core:after {
        top: 1px;
        left: 1px;
        border-radius: 100%;
        transition: all .3s;
        width: 14px;
        height: 14px;
        background-color: #FFF;
    }

    .save {
        position: relative;
        width: 100px;
        height: 43px;
        background-color: #4481FF;
        box-shadow: 0px 3px 6px #4481FF33;
        border-radius: 3px;
        color: #ffffff;
        line-height: 43px;
        text-align: center;
        cursor: pointer;
        font-size: 16px;
    }

    .dialog-footer {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding: 0 5px;
    }
</style>
