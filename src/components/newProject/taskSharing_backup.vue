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
            <div class="subtabItem" :class="{ selected : subtabSelected === 'label'}" @click="subtabSelected = 'label'">標註分派</div>
            <div class="subtabItem" :class="{ selected : subtabSelected === 'confirm'}" @click="subtabSelected = 'confirm'">確認分派</div>
        </div>
        <div class="tool flex-row" style="margin-bottom: 12px;">
            <div class="flex-row canAssign" v-if="subtabSelected === 'confirm'">
                <span>可分派</span>
                <span style="font-weight: bold;">{{ confirmCanAssign }}</span>
            </div>
            <!-- <div class="averageAssign">平均分派</div> -->
        </div>
        <el-table :data="(subtabSelected === 'label') ? nowLabelMember : nowConfirmMember"
            height="600"
            :default-sort="{ prop: 'user_name', order: 'null'}"
            style="margin-bottom: 12px;">
            <el-table-column
                label="＃"
                type="index">
            </el-table-column>
            <el-table-column
                prop="user_name"
                width="200"
                sortable>
                <template slot="header">
                    <span v-if="subtabSelected === 'label'">標註人員</span>
                    <span v-else>確認人員</span>
                    <span class="memberCount" v-if="subtabSelected === 'label'">{{ labelMember.length }}</span>
                    <span class="memberCount" v-else>{{ confirmMember.length }}</span>
                </template>
            </el-table-column>
            <el-table-column
                :label="(subtabSelected === 'label') ? '已標註' : '已確認'"
                prop="done"
                width="150">
            </el-table-column>
            <el-table-column
                :label="(subtabSelected === 'label') ? '未標註' : '未確認'"
                width="150">
                <template slot-scope="scope">
                    <div class="flex-row">
                        <span :class="{ has : scope.row.undone > 0 }">{{ scope.row.undone }}</span>
                        <div class="takeback" v-if="scope.row.undone !== 0" @click="takebackAll(subtabSelected, scope.row.user_id)">
                            全收回
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                width="165">
                <template slot="header">
                    <div class="flex-row" style="justify-content: space-between;">
                        <span>收回</span>
                        <span>分派</span>
                    </div>
                </template>
                <template slot-scope="scope">
                    <div class="flex-row">
                        <div class="updateNumBtn minus" @click="takeback(subtabSelected, scope.row.user_id)">
                            <i class="el-icon-minus"></i>
                        </div>
                        <el-input v-model.number="scope.row.countingNum" 
                                    :keyup="checkNumber(subtabSelected, scope.row.user_id, scope.row.countingNum)" placeholder="請輸入" />
                        <div class="updateNumBtn plus" @click="assign(subtabSelected, scope.row.user_id)">
                            <i class="el-icon-plus"></i>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                label=""
                min-width="180">
                <template slot-scope="scope">
                    <transition name="fade">
                        <div class="flex-row success" v-if="scope.row.descirbeStyle === '#84CD36'">
                            <i class="el-icon-success" style="margin-right: 13px; color: '#84CD36';"></i>
                            <span>{{ scope.row.descirbe }}</span>
                        </div>
                        <div class="flex-row failed" v-else-if="scope.row.descirbeStyle === '#FC0000'">
                            <i class="el-icon-error" style="margin-right: 13px; color: '#FC0000';"></i>
                            <span>{{ scope.row.descirbe }}</span>
                        </div>
                    </transition>                  
                </template>
            </el-table-column>
        </el-table>
        <div class="pagi flex-row"  style="justify-content: flex-end;" v-if="subtabSelected === 'label'">
            <span>{{ labelPagination.nowRange }} of {{ labelPagination.total }}</span>
            <i class="el-icon-arrow-left" @click="prePage('label')" :class="{ disabled : labelPagination.nowPage === 1 }"></i>
            <i class="el-icon-arrow-right" @click="nextPage('label')" :class="{ disabled : labelPagination.nowPage === labelPagination.total }"></i>
        </div>
        <div class="pagi flex-row"  style="justify-content: flex-end;" v-else>
            <span>{{ confirmPagination.nowRange }} of {{ confirmPagination.total }}</span>
            <i class="el-icon-arrow-left" @click="prePage('confirm')" :class="{ disabled : confirmPagination.nowPage === 1 }"></i>
            <i class="el-icon-arrow-right" @click="nextPage('confirm')" :class="{ disabled : confirmPagination.nowPage === 1 }"></i>
        </div>
    </div>
</template>

<script>
    export default {
        name: "taskSharing.vue",
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
                subtabSelected: 'label',

                labelMember: [],
                confirmMember: [],
                nowLabelMember: [],
                nowConfirmMember: [],

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
            };
        },
        mounted() {
            this.getMission()

            Promise.all([this.getLabelMember(), this.getConfirmMember()])
                .then()
        },
        methods: {
            //  取得任務資訊
            getMission() {
                this.dashboard =  {
                    total: 500,
                    assigned: 0,
                    unassigned: 500,
                    member: 17,
                    unlabeled: 0,
                    unconfirmed: 0,
                }

                this.confirmCanAssign = this.dashboard.total
            },

            //  取得標註人員
            getLabelMember() {
                this.labelMember = [
                    { user_id: '13768', user_name: '1陳宥融', done: 0, undone: 0, descirbe: '', descirbeStyle: '', countingNum: '' },
                    { user_id: '14565', user_name: '2陳宥融', done: 0, undone: 0, descirbe: '', descirbeStyle: '', countingNum: '' },
                    { user_id: '17538', user_name: '3陳宥融', done: 0, undone: 0, descirbe: '', descirbeStyle: '', countingNum: '' },
                    { user_id: '19731', user_name: '4陳宥融', done: 0, undone: 0, descirbe: '', descirbeStyle: '', countingNum: '' },
                    { user_id: '11427', user_name: '5陳宥融', done: 0, undone: 0, descirbe: '', descirbeStyle: '', countingNum: '' },
                    { user_id: '17273', user_name: '6陳宥融', done: 0, undone: 0, descirbe: '', descirbeStyle: '', countingNum: '' },
                    { user_id: '17658', user_name: '7陳宥融', done: 0, undone: 0, descirbe: '', descirbeStyle: '', countingNum: '' },
                    { user_id: '11478', user_name: '8陳宥融', done: 0, undone: 0, descirbe: '', descirbeStyle: '', countingNum: '' },
                    { user_id: '11385', user_name: '9陳宥融', done: 0, undone: 0, descirbe: '', descirbeStyle: '', countingNum: '' },
                    { user_id: '19637', user_name: '10陳宥融', done: 0, undone: 0, descirbe: '', descirbeStyle: '', countingNum: '' },
                    { user_id: '16374', user_name: '11陳宥融', done: 0, undone: 0, descirbe: '', descirbeStyle: '', countingNum: '' },
                ]
                this.countPage ('label')
            },
            //  取得確認人員
            getConfirmMember() {
                this.confirmMember = [
                    { user_id: '12345', user_name: '王大保1', done: 0, undone: 0, descirbe: '', descirbeStyle: '', countingNum: '' },
                    { user_id: '24613', user_name: '王大保2', done: 0, undone: 0, descirbe: '', descirbeStyle: '', countingNum: '' },
                    { user_id: '18924', user_name: '王大保3', done: 0, undone: 0, descirbe: '', descirbeStyle: '', countingNum: '' },
                    { user_id: '17432', user_name: '王大保4', done: 0, undone: 0, descirbe: '', descirbeStyle: '', countingNum: '' },
                    { user_id: '17378', user_name: '王大保5', done: 0, undone: 0, descirbe: '', descirbeStyle: '', countingNum: '' },
                    { user_id: '19426', user_name: '王大保6', done: 0, undone: 0, descirbe: '', descirbeStyle: '', countingNum: '' },
                ]
                this.countPage ('confirm')
            },
            //  計算頁面相關參數
            countPage (type) {
                switch (type) {
                    case 'label':
                        this.labelPagination.total = Math.floor(this.labelMember.length / 10) + 1

                        if(this.labelMember.length < 10){
                            this.labelPagination.nowPage = 1
                            this.labelPagination.nowRange = `1 - ${ this.labelMember.length }`
                            this.nowLabelMember = (this.labelMember).slice(0, this.labelMember.length + 1)
                        } else {
                            this.labelPagination.nowPage = 1
                            this.labelPagination.nowRange = `1 - 10`
                            this.nowLabelMember = (this.labelMember).slice(0, 10)
                        }
                        break;
                    case 'confirm':
                        this.confirmPagination.total = Math.floor(this.confirmMember.length / 10) + 1

                        if(this.confirmMember.length < 10){
                            this.confirmPagination.nowPage = 1
                            this.confirmPagination.nowRange = `1 - ${ this.confirmMember.length }`
                            this.nowConfirmMember = (this.confirmMember).slice(0, this.confirmMember.length)                            
                        } else {
                            this.confirmPagination.nowPage = 1
                            this.confirmPagination.nowRange = `1 - 10`
                            this.nowConfirmMember = (this.confirmMember).slice(0, 10)
                        }
                        break;
                    default:
                        break;
                }
            },
            //  上一頁
            prePage(type) {
                switch (type) {
                    case 'label':
                        if(this.labelPagination.nowPage !== 1) {
                            this.labelPagination.nowPage -= 1
                            this.nowLabelMember = this.labelMember.slice((this.labelPagination.nowPage - 1) * 10, (this.labelPagination.nowPage - 1) * 10 + 10)
                            this.labelPagination.nowRange = `${ (this.labelPagination.nowPage - 1) * 10 + 1 } - ${ (this.labelPagination.nowPage - 1) * 10 + 10 }`

                        }
                        break;
                    case 'confirm':
                        if(this.confirmPagination.nowPage !== 1) {
                            this.confirmPagination.nowPage -= 1
                            this.nowConfirmMember = this.confirmMember.slice((this.confirmPagination.nowPage - 1) * 10, (this.confirmPagination.nowPage - 1) * 10 + 10)
                            this.confirmPagination.nowRange = `${ (this.confirmPagination.nowPage - 1) * 10 + 1 } - ${ (this.confirmPagination.nowPage - 1) * 10 + 10 }`
                        }
                        break;
                    default:
                        break;
                }
            },
            //  下一頁
            nextPage(type) {
                switch (type) {
                    case 'label':
                        if(this.labelPagination.nowPage !== this.labelPagination.total) {
                            this.labelPagination.nowPage += 1
                            this.nowLabelMember = this.labelMember.slice((this.labelPagination.nowPage - 1) * 10, (this.labelPagination.nowPage - 1) * 10 + 10)
                            this.labelPagination.nowRange = `${ (this.labelPagination.nowPage - 1) * 10 + 1 } - ${ (this.labelPagination.nowPage - 1) * 10 + 10 }`
                        }
                        break;
                    case 'confirm':
                        if(this.confirmPagination.nowPage !== this.confirmPagination.total) {
                            this.confirmPagination.nowPage += 1
                            this.nowConfirmMember = this.confirmMember.slice((this.confirmPagination.nowPage - 1) * 10, (this.confirmPagination.nowPage - 1) * 10 + 10)
                            this.confirmPagination.nowRange = `${ (this.confirmPagination.nowPage - 1) * 10 + 1 } - ${ (this.confirmPagination.nowPage - 1) * 10 + 10 }`
                        }
                        break;
                    default:
                        break;
                }
            },
            //  全收回
            takebackAll(type, id) {
                console.log(type, id);
               switch (type) {
                    case 'label': {
                        /* 找到那筆  -> 
                            1. 已分派 減掉 收回的任務
                            2. 未分派 加上 收回的任務
                            3. 未標註 減掉 收回的任務
                           清空那筆的 未標註
                        */
                        const index = this.nowLabelMember.findIndex(item => item.user_id === id)

                        this.dashboard.assigned -= this.nowLabelMember[index].undone
                        this.dashboard.unassigned += this.nowLabelMember[index].undone
                        this.dashboard.unlabeled -= this.nowLabelMember[index].undone
                        this.nowLabelMember[index].undone = 0

                        this.nowLabelMember[index].descirbe = '已收回完成'
                        this.nowLabelMember[index].descirbeStyle = '#84CD36'

                        setTimeout(() => {
                            this.nowLabelMember[index].descirbe = ''
                            this.nowLabelMember[index].descirbeStyle = ''
                        }, 1500)

                        break;
                    }
                    case 'confirm': {
                        /* 找到那筆  -> 
                            1. 未確認 減掉 收回的任務
                            2. 確認可分派 加上 收回的任務
                           清空那筆的 未確認
                        */
                        const index = this.nowConfirmMember.findIndex(item => item.user_id === id)
                        
                        this.dashboard.unconfirmed -= this.nowConfirmMember[index].undone 
                        this.confirmCanAssign += this.nowConfirmMember[index].undone
                        this.nowConfirmMember[index].undone = 0

                        setTimeout(() => {
                            this.nowConfirmMember[index].descirbe = ''
                            this.nowConfirmMember[index].descirbeStyle = ''
                        }, 1500)

                        break;
                    }
                    default:
                        break;
                } 
            },
            //  收回
            takeback(type, id) {
                console.log(type, id);
                switch (type) {
                    case 'label': {
                        /* 找到那筆  -> 
                            1. 已分派 減掉 收回的任務
                            2. 未分派 加上 收回的任務
                            3. 未標註 減掉 收回的任務
                            4. 那筆的未標註 減掉 收回的任務
                            清空那筆的 輸入欄
                        */
                        const index = this.nowLabelMember.findIndex(item => item.user_id === id)

                        if(this.nowLabelMember[index].countingNum > this.nowLabelMember[index].undone) {
                            this.nowLabelMember[index].countingNum = ''
                            this.nowLabelMember[index].descirbe = '已超出可收回的數量'
                            this.nowLabelMember[index].descirbeStyle = '#FC0000'
                        } else if (this.nowLabelMember[index].countingNum === '') {
                            this.nowLabelMember[index].descirbe = '請輸入數值'
                            this.nowLabelMember[index].descirbeStyle = '#FC0000'
                        } else {
                            this.dashboard.assigned -= this.nowLabelMember[index].countingNum
                            this.dashboard.unassigned += this.nowLabelMember[index].countingNum
                            this.dashboard.unlabeled -= this.nowLabelMember[index].countingNum
                            this.nowLabelMember[index].undone -= this.nowLabelMember[index].countingNum
                            this.nowLabelMember[index].countingNum = ''
                            this.nowLabelMember[index].descirbe = '已收回完成'
                            this.nowLabelMember[index].descirbeStyle = '#84CD36'
                        }

                        setTimeout(() => {
                            this.nowLabelMember[index].descirbe = ''
                            this.nowLabelMember[index].descirbeStyle = ''
                        }, 1500)

                        break;
                    }
                    case 'confirm': {
                         /* 找到那筆  -> 
                              1. 未確認 減掉 收回的任務
                              2. 確認可分派 加上 收回的任務
                              3. 那筆的未確認 減掉 收回的任務
                            清空那筆的 輸入欄
                        */
                        const index = this.nowConfirmMember.findIndex(item => item.user_id === id)

                        if(this.nowConfirmMember[index].countingNum > this.nowConfirmMember[index].undone) {
                            this.nowConfirmMember[index].countingNum = ''
                            this.nowConfirmMember[index].descirbe = '已超出可收回的數量'
                            this.nowConfirmMember[index].descirbeStyle = '#FC0000'
                        } else if (this.nowConfirmMember[index].countingNum === '') {
                            this.nowConfirmMember[index].descirbe = '請輸入數值'
                            this.nowConfirmMember[index].descirbeStyle = '#FC0000'
                        } else {
                            this.dashboard.unconfirmed -= this.nowConfirmMember[index].countingNum
                            this.confirmCanAssign += this.nowConfirmMember[index].countingNum
                            this.nowConfirmMember[index].undone -= this.nowConfirmMember[index].countingNum
                            this.nowConfirmMember[index].countingNum = ''
                        }

                        setTimeout(() => {
                            this.nowConfirmMember[index].descirbe = ''
                            this.nowConfirmMember[index].descirbeStyle = ''
                        }, 1500)

                        break;
                    }
                    default:
                        break;
                } 
            },
            //  分派
            assign(type, id) {
                console.log(type, id);
                 switch (type) {
                    case 'label': {
                        /* 找到那筆  -> 
                            1. 已分派 加上 分派的任務
                            2. 未分派 減掉 分派的任務
                            3. 未標註 加上 分派的任務
                            4. 那筆的未標註 加上 分派的任務
                            清空那筆的 輸入欄
                        */
                        const index = this.nowLabelMember.findIndex(item => item.user_id === id)

                        if(this.nowLabelMember[index].countingNum > this.dashboard.unassigned) {
                            this.nowLabelMember[index].countingNum = ''
                            this.nowLabelMember[index].descirbe = '已超出可分派的數量'
                            this.nowLabelMember[index].descirbeStyle = '#FC0000'
                        } else if (this.nowLabelMember[index].countingNum === '') {
                            this.nowLabelMember[index].descirbe = '請輸入數值'
                            this.nowLabelMember[index].descirbeStyle = '#FC0000'
                        } else {
                            this.dashboard.assigned += this.nowLabelMember[index].countingNum
                            this.dashboard.unassigned -= this.nowLabelMember[index].countingNum
                            this.dashboard.unlabeled += this.nowLabelMember[index].countingNum
                            this.nowLabelMember[index].undone += this.nowLabelMember[index].countingNum
                            this.nowLabelMember[index].countingNum = ''
                            this.nowLabelMember[index].descirbe = '已分派完成'
                            this.nowLabelMember[index].descirbeStyle = '#84CD36'
                        }

                        setTimeout(() => {
                            this.nowLabelMember[index].descirbe = ''
                            this.nowLabelMember[index].descirbeStyle = ''
                        }, 1500)
                       
                        break;
                    }
                    case 'confirm': {
                        /* 找到那筆  -> 
                              1. 未確認 加上 分派的任務
                              2. 確認可分派 減掉 分派的任務
                              3. 那筆的未確認 加上 分派的任務
                            清空那筆的 輸入欄
                        */
                        const index = this.nowConfirmMember.findIndex(item => item.user_id === id)

                        if(this.nowConfirmMember[index].countingNum > this.confirmCanAssign) {
                            this.nowConfirmMember[index].countingNum = ''
                            this.nowConfirmMember[index].descirbe = '已超出可分派的數量'
                            this.nowConfirmMember[index].descirbeStyle = '#FC0000'
                        } else if (this.nowConfirmMember[index].countingNum === '') {
                            this.nowConfirmMember[index].descirbe = '請輸入數值'
                            this.nowConfirmMember[index].descirbeStyle = '#FC0000'
                        } else {
                            this.dashboard.unconfirmed += this.nowConfirmMember[index].countingNum
                            this.confirmCanAssign -= this.nowConfirmMember[index].countingNum
                            this.nowConfirmMember[index].undone += this.nowConfirmMember[index].countingNum
                            this.nowConfirmMember[index].countingNum = ''
                            this.nowConfirmMember[index].descirbe = '已分派完成'
                            this.nowConfirmMember[index].descirbeStyle = '#84CD36'
                        }

                        setTimeout(() => {
                            this.nowConfirmMember[index].descirbe = ''
                            this.nowConfirmMember[index].descirbeStyle = ''
                        }, 1500)

                        break;
                    }
                    default:
                        break;
                } 
            },

            //  檢查是否為數字
            checkNumber(type, id, num) {
                if(num !== '' && typeof(num) === 'string' ) {
                    switch (type) {
                        case 'label': {
                            const index = this.nowLabelMember.findIndex(item => item.user_id === id)
                            this.nowLabelMember[index].countingNum = ''
                            break;
                        }    
                        case 'confirm': {
                            const index = this.nowConfirmMember.findIndex(item => item.user_id === id)
                            this.nowConfirmMember[index].countingNum = ''
                            break;
                        }
                        default:
                            break;
                    }
                }
            }

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
        font-size: 16px;
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

    .canAssign {
        width: 100px;
        height: 32px;
        justify-content: space-between;
        background-color: #F6F7FA;
        font-size: 16px;
        line-height: 16px;
        color: #334560;
        border-radius: 3px;
        padding: 0 15px;
        margin-right: 15px;
    }

    /* .averageAssign {
        border: 1px solid #4481FF;
        border-radius: 3px;
        color: #4481FF;
        background-color: #FFFFFF;
        padding: 5px 22px;
        cursor: pointer;
        transition: all .3s;
    }

    .averageAssign:hover {
        color: #FFFFFF;
        background-color: #4481FF;
    } */

    /* table */

    .el-table >>> thead th {
        background-color: #F2F5FC;
        color: #233044;
    }

    .el-table >>> thead th:nth-child(1) {
        color: #9C9C9C;
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

    .el-table >>> tbody td {
        padding: 7px 0;
        color: #233044;
    }

    .el-table >>> tbody tr td:nth-child(1) {
        color: #9C9C9C;
    }

    .el-table::before {
        height: 0;
    }

    .memberCount {
        position: absolute;
        left: 90px;
        height: 23px;
        padding: 0 7px;
        border-radius: 13px;
        background-color: #98BBF0;
        color: #FFFFFF;
        font-size: 14px;
        line-height: 23px;
    }

    .updateNumBtn {
        display: flex;
        justify-content: center;
        align-items: center;
        min-width: 30px;
        width: 30px;
        height: 30px;
        cursor: pointer;
        transition: all .3s;
    }

    .updateNumBtn i {
        color: #FFFFFF;
        font-size: 16px;
        font-weight: bold;
    }

    .has {
        color: #C78D06;
    }

    .takeback {
        position: absolute;
        right: 50px;
        padding: 2px 5px;
        border: 1px solid #C78D06;
        border-radius: 3px;
        font-size: 13px;
        color: #C78D06;
        cursor: pointer;
        transition: all .3s;
    }

    .takeback:hover {
        background-color: #C78D06;
        color: #FFFFFF;
    }
    
    .minus {
        border-radius: 3px 0 0 3px;
        background-color: #F73C4E;
    }

    .minus:hover {
        background-color: #e23849;
    }

    .plus {
        border-radius: 0 3px 3px 0;
        background-color: #84CD36;
    }

    .plus:hover {
        background-color: #76b82f;
    }

    .el-input >>> .el-input__inner {
        height: 30px;
        border-radius: 0;
        text-align: center;
    }
    
    .pagi span {
        display: block;
        margin-right: 40px;
        color: #233044;
    }

    .pagi i {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 30px;
        height: 30px;
        font-weight: bold;
        cursor: pointer;
        color: #233044;
    }

    .pagi i.disabled {
        cursor: not-allowed;
        color: #DEE2E6;
    }

    .success {
        color: #84CD36;
    }

    .failed {
        color: #FC0000;
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
        }
    .fade-enter, .fade-leave-to {
        opacity: 0;
    }
</style>
