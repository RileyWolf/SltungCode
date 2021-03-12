<template>
    <div style="position: relative;">
        <div class="flex-row canAssign" v-if="subtabSelected === 'confirm'">
            <span>可分派</span>
            <span style="font-weight: bold;">{{ confirmCanAssign }}</span>
        </div>
        <el-table :data="showData"
                height="545"
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
                    <span>{{ typeSelected }}人員</span>
                    <span class="memberCount">{{ nowMember.length }}</span>
                </template>
            </el-table-column>
            <el-table-column
                :label="`已${ typeSelected }`"
                prop="done"
                width="150">
            </el-table-column>
            <el-table-column
                :label="`未${ typeSelected }`"
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
                        <div class="flex-row success" v-if="scope.row.descirbeStyle === 'success'">
                            <i class="el-icon-success" style="margin-right: 13px; color: '#84CD36';"></i>
                            <span>{{ scope.row.descirbe }}</span>
                        </div>
                        <div class="flex-row failed" v-else-if="scope.row.descirbeStyle === 'failed'">
                            <i class="el-icon-error" style="margin-right: 13px; color: '#FC0000';"></i>
                            <span>{{ scope.row.descirbe }}</span>
                        </div>
                    </transition>                  
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import { assignTask, cancelTask } from '@/api/index.js'

export default {
    name: 'memberTable',
    props: {
        dashboard: Object,
        nowMember: Array,
        nowPage: Number,
        subtabSelected: String,
        confirmCanAssign: Number,
    },
    data() {
        return {
            loadingData: false,
        };
    },
    computed: {
        typeSelected() {
            return (this.subtabSelected === 'label') ? '標註' : '確認'
        },
        showData() {
            return this.nowMember.slice((this.nowPage - 1) * 10, this.nowPage * 10)
        }
    },
    watch: {
        subtabSelected() {
            this.nowMember.forEach(item => {
                item.descirbe = ''
                item.descirbeStyle = ''
            })
        },
    },
    methods: {
        //  收回分派的訊息
        showMessage(index, style, string) {
            // describe style: success, failed
            // describe string
            this.nowMember[index].descirbe = string
            this.nowMember[index].descirbeStyle = style

            setTimeout(() => {
                console.log('times up');
                this.nowMember[index].descirbe = ''
                this.nowMember[index].descirbeStyle = ''
            }, 2000)
        },

        dashboardChange(type, mode, value) {
            // type: label, confirm
            // mode: assign, takeback
            // value
            if(type === 'label') {
                value = (mode === 'assign') ? value : -value
                this.dashboard.assigned += value
                this.dashboard.unassigned -= value
                this.dashboard.unlabeled += value
            } else {
                value = (mode === 'assign') ? value : -value
                this.dashboard.unconfirmed += value
                this.$emit('updateCanAssign', this.confirmCanAssign - value)
            }
        },

        //  全收回
        async takebackAll(type, id) {
            if(!this.loadingData) {
                const index = this.nowMember.findIndex(item => item.user_id === id)
    
                let param = this.getParam(type, id)
                param.amount = this.nowMember[index].undone
    
                this.loadingData = true
    
                console.log(param);
                let result = await cancelTask(param)
                console.log(result);
                if(result.result) {
                    this.nowMember[index].undone -= result.canceled
                    this.dashboardChange(this.subtabSelected, 'tackback', result.canceled)
                    
                    this.showMessage(index, 'success', `已收回 ${ result.canceled } 筆！`)                    
                }
                this.loadingData = false
                this.nowMember[index].countingNum = ''
            } else this.$message.warning('請等資料讀取完成！')
            
        },
        //  收回
        async takeback(type, id) {
            if(!this.loadingData) {
                const index = this.nowMember.findIndex(item => item.user_id === id)
    
                this.loadingData = true
    
                if(this.nowMember[index].undone < this.nowMember[index].countingNum) this.showMessage(index, 'failed', '已超過收回上限！')
                else if (this.nowMember[index].countingNum === '') this.showMessage(index, 'failed', '請輸入數值！')
                else {
                    let param = this.getParam(type, id)
                    param.amount = this.nowMember[index].countingNum
    
                    console.log(param);
                    let result = await cancelTask(param)
                    console.log(result);
                    if(result.result) {
                        this.nowMember[index].undone -= result.canceled
                        this.dashboardChange(this.subtabSelected, 'tackback', result.canceled)
    
                        this.showMessage(index, 'success', `已收回 ${ result.canceled } 筆！`)
                    }
                }
                this.nowMember[index].countingNum = ''
                this.loadingData = false
            } else this.$message.warning('請等資料讀取完成！')

        },
        getParam(type, id) {
            let obj = {
                amount: '',
                project_id: this.$store.state.nowProjectId,
                role: (type === 'label') ? 'labeler' : 'confirmer',
                user_id: id,
            }
            return obj 
        },
        //  分派
        async assign(type, id) {
            if(!this.loadingData) {
                const index = this.nowMember.findIndex(item => item.user_id === id)
                //  label 分派 跟 dashboard.unassigned 比對  /  confirm 分派 跟 confirmCanAssign 比對
                const comparativeValue = (type === 'label') ? this.dashboard.unassigned : this.confirmCanAssign
                
                this.loadingData = true
    
                if(comparativeValue < this.nowMember[index].countingNum) this.showMessage(index, 'failed', '已超過分派上限！')
                else if (this.nowMember[index].countingNum === '') this.showMessage(index, 'failed', '請輸入數值！')
                else {
                    let param = this.getParam(type, id)
                    param.amount = this.nowMember[index].countingNum
                    
                    let result = await assignTask(param)
                    console.log(result);
                    if(result.result) {    
                        this.nowMember[index].undone += result.assigned
                        this.dashboardChange(this.subtabSelected, 'assign', result.assigned)
    
                        if(result.assigned === result.request_amount) {
                            this.showMessage(index, 'success', `已分派 ${ result.assigned } 筆！`)
                        } else if (result.assigned !== 0 && result.assigned <= result.request_amount) {
                            this.showMessage(index, 'success', `已分派 ${ result.assigned } 筆, 其餘 ${ result.request_amount - result.assigned } 筆分派失敗。( 標記/確認者相同 )`)
                        } else if (result.assigned === 0) {
                            this.showMessage(index, 'failed', `已無任務可分派給此人員。`)
                            console.log('%c ERROR ','color: red;', `result.assigned ${ result.assigned } /  result.request_amount ${ result.request_amount }` );
                        }
                    }
                }
                this.nowMember[index].countingNum = ''
                this.loadingData = false

            } else this.$message.warning('請等資料讀取完成！')
        },

        //  檢查是否為數字
        checkNumber(type, id, num) {
            if(num !== '' && typeof(num) === 'string' ) {
                const index = this.nowMember.findIndex(item => item.user_id === id)
                this.nowMember[index].countingNum = ''
            }
        }    
    },
}
</script>

<style scoped>
    .flex-row {
        display: flex;
        align-items: center;
    }

    .memberCount {
        position: absolute;
        left: 100px;
        height: 23px;
        padding: 0 7px;
        border-radius: 13px;
        background-color: #98BBF0;
        color: #FFFFFF;
        line-height: 23px;
        font-size: 14px;
    }

    /* table */

    .el-table {
        font-size: 16px;
    }

    .el-table >>> thead th {
        background-color: #F2F5FC;
        color: #233044;
    }

    .el-table >>> thead .cell {
        font-weight: bold;
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
        padding: 9px 0;
        color: #233044;
    }

    .el-table >>> tbody tr td:nth-child(1) {
        color: #9C9C9C;
    }

    .el-table::before {
        height: 0;
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

    .canAssign {
        position: absolute;
        right: 0;
        top: 8px;
        z-index: 99;
        width: 100px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: #F6F7FA;
        line-height: 16px;
        color: #334560;
        border-radius: 3px;
        padding: 0 15px;
        margin-right: 15px;
    }
</style>
