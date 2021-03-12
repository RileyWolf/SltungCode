<template>
    <div class="flex-column" style="padding: 0; padding-top:15px; height: 100%;">
        <div class="flex-row" style="padding: 0 10px;">
            <div class="flex-column">
                <p>請選擇狀態</p>
                <div class="flex-row status-list" style="margin-bottom: 26px;">
                    <div v-for="(item, index) in statusList" :key="index"
                        class="statusBtn"  :class="{ active : status === item }"
                        @click="status = item">
                        <i class="el-icon-success" v-if="status === item"></i>
                        {{ item }}
                    </div>
                </div>
                <p>標注日期</p>
                <div class="flex-row" style="margin-bottom: 26px;">
                    <div class="flex-column">
                        <el-date-picker
                            v-model="timepickerSelect"
                            type="daterange"
                            range-separator=""
                            format="yyyy/MM/dd"
                            start-placeholder="開始日期"
                            end-placeholder="結束日期"
                            @change="timeChange()">
                        </el-date-picker>
                    </div>
                    <el-radio v-model="rangeSelect" label="當月">當月</el-radio>
                    <el-radio v-model="rangeSelect" label="當週">當週</el-radio>
                </div>
            </div>
            <div class="flex-column" style="height: 100%; justify-content: flex-end;">
                <div class="export" @click="exportSource()">匯出</div>
            </div>            
        </div>
        <div class="line"></div>
        <el-table :data="exportLog"
                height="600"
                :default-sort="{ prop: 'time', order: 'null'}">
            <el-table-column
                label=""
                width="15">
            </el-table-column>
            <el-table-column
                label="匯出時間"
                prop="time"
                sortable
                width="360">
            </el-table-column>
            <el-table-column
                label="下載期限"
                prop="range"
                width="280">
            </el-table-column>
            <el-table-column
                label="執行" >
                <template slot-scope="scope">
                    <div v-if="scope.row.status !== ''">處理中 ...</div>
                    <div v-else class="flex-row toolbox">
                        <svg class="dowBtn" xmlns="http://www.w3.org/2000/svg" width="16.5" height="16.5" viewBox="0 0 16.5 16.5"><g transform="translate(-3.75 -3.75)"><path class="dow" d="M19.5,22.5v3.424a1.69,1.69,0,0,1-1.667,1.712H6.167A1.69,1.69,0,0,1,4.5,25.924V22.5" transform="translate(0 -8.137)"/><path class="dow" d="M10.5,15l4.076,4.28L18.651,15" transform="translate(-2.576 -4.728)"/><path class="dow" d="M18,14.039V4.5" transform="translate(-6)"/></g></svg>
                        <svg class="delBtn" xmlns="http://www.w3.org/2000/svg" width="14.844" height="16.5" viewBox="0 0 14.844 16.5"><g transform="translate(-939.45 -625.75)"><path class="a" d="M953.926,637l-.716,8.312a2.242,2.242,0,0,1-2.225,2.059h-3.945a2.242,2.242,0,0,1-2.225-2.059L944.1,637" transform="translate(-2.141 -5.871)"/><path class="a" d="M3.607,0,3.055,6.349ZM0,0,.553,6.349Z" transform="translate(945.068 632.449)"/><line class="b" x2="13.343" transform="translate(940.2 628.882)"/><path class="c" d="M0,2.382H0ZM4.918,1.8a1.754,1.754,0,1,1,3.506,0Z" transform="translate(940.2 626.5)"/></g></svg>
                    </div>
                </template>
            </el-table-column>
            <template slot="empty">
                <div></div>
            </template>
        </el-table>
    </div>
</template>

<script>
/* eslint-disable no-unused-vars */
    import moment from 'moment'

    export default {
        name: "exportData.vue",
        data() {
            return {
                canSave: true,
                statusList: [ '全部', '已確認', '未確認' ],

                status: '全部',
                timepickerSelect: [],
                rangeSelect: '',

                exportLog: [
                    {
                        file_id: +new Date(),
                        time: moment(new Date()).format('YYYY/MM/DD HH:mm:ss'),
                        range: moment(new Date()).add(1, 'M').format('YYYY/MM/DD'),
                        status: ''
                    }
                ],
            };
        },
        watch: {
            timepickerSelect() {
                if(this.timepickerSelect === null) {
                    this.timepickerSelect = []
                    this.rangeSelect = ''
                }
            },
            rangeSelect() {
                const nowTime = new Date()
                const year = nowTime.getFullYear()
                const month = nowTime.getMonth() + 1

                if(this.rangeSelect === '當月') {
                    console.log('當月');
                    this.$set(this.timepickerSelect, 0, new Date(`${ year }/${ month }/01`))
                    this.$set(this.timepickerSelect, 1, new Date(`${ year }/${ month }/${ moment().daysInMonth() }`))
                } else if (this.rangeSelect === '當週') {
                    console.log('當週');
                    this.$set(this.timepickerSelect, 0, moment(moment(nowTime).startOf('week')._d).add(1, 'd')._d)
                    this.$set(this.timepickerSelect, 1, moment(moment(nowTime).endOf('week')._d).add(1, 'd')._d)
                }
            },
        },
        methods: {
            timeChange() {
                this.rangeSelect = '自訂'
            },
            exportSource() {
                if((this.exportLog[this.exportLog.length - 1].status === '' || this.exportLog.length === 0)
                        && this.timepickerSelect.length !== 0
                        && this.canSave) {
                    this.canSave = !this.canSave
                    
                    this.exportLog.push({
                        file_id: +new Date(),
                        time: moment(new Date()).format('YYYY/MM/DD HH:mm:ss'),
                        range: moment(new Date()).add(1, 'M').format('YYYY/MM/DD'),
                        status: 'loading'
                    })

                    //  之後改為 call 匯出 api, 取得 result 匯出成功後, 將最後一筆的 status 打空, 若最後一筆的 status 為空, this.canSave 才改為 true （ 不知道會不會有匯出失敗的情況
                    setTimeout(() => {
                        this.canSave = !this.canSave
                        this.exportLog[this.exportLog.length - 1].status = ''
                    },2000)

                } else if (this.exportLog[this.exportLog.length - 1].status !== '' || !this.canSave) {
                    this.$message.warning('操作過於頻繁, 請等候上一筆匯出完成！')
                } else this.$message.error('請選擇標注日期！')
            },

            downloadData() {

            },
            deleteData() {

            },
        },
    }
</script>

<style scoped>
    * {
        box-sizing: border-box;
    }

    p {
        margin: 0;
        margin-bottom: 10px;
    }

    .flex-row {
        display: flex;
        align-items: center;
    }

    .flex-column {
        display: flex;
        flex-direction: column;
    }

    .line {
        width: 100%;
        height: 1px;
        background-color: #DEE2E6;
    }

    /* table */

    .el-table {
        font-size: 16px;
        margin-top: 20px;
    }

    .el-table >>> thead th {
        background-color: #F2F5FC;
        color: #233044;
    }

    .el-table >>> thead .cell {
        font-weight: bold;
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
        top: 0;
    }

    .el-table >>> thead .descending {
        bottom: 0;
    }

    .statusBtn {
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 1;

        padding: 8px 0;
        margin-right: 15px;
        font-weight: 500;
        border: 2px solid #DEE2E6;
        border-radius: 3px;
        cursor: pointer;

        transition: all .3s;
    }

    .status-list .statusBtn:nth-last-child(1)  {
        margin-right: 0;
    }

    .statusBtn:hover {
        color: #4481FF;
        border: 2px solid #4481FF;
    }

    .statusBtn i {
        margin-right: 10px;
    }

    .statusBtn.active {
        color: #4481FF;
        border: 2px solid #4481FF;
        border-radius: 3px;
    }

    .el-date-editor >>> .el-range-separator {
        width: 5px;
        height: 1px;
        background-color: #DEE2E6;
    }

    .el-radio {
        margin: 0 10px 0 15px;
    }

    .el-radio >>> .el-radio__label {
        font-size: 16px;
    }

    .el-radio >>> .el-radio__inner {
        position: relative;
        width: 16px;
        height: 16px;
        border: 1px solid #DEE2E6;
        border-radius: 3px;
    }

    .el-radio >>> .el-radio__inner::after {
        content: '\2714';
        width: 16px;
        height: 16px;
        background-color: transparent;
        position: absolute;
        top: 0;
        left: 0;
        color: white;
        border: 0;
        border-radius: 0;
        opacity: 0;
        font-size: 16px;
        transition: opacity .3s;
    }

    .el-radio >>> .el-radio__input.is-checked .el-radio__inner::after {
        opacity: 1;
        transform: none;
    }

    .export {
        width: 120px;
        height: 40px;
        line-height: 40px;
        background-color: #4481FF;
        box-shadow: 0px 3px 6px #4481FF33;
        border: 0;
        border-radius: 3px;
        margin: 0 10px 26px;
        margin-left: 150px;
        color: #ffffff;
        font-size: 16px;
        cursor: pointer;
        text-align: center;
    }

    .toolbox svg {
        margin-right: 20px;
        cursor: pointer;
    }

    /* 下載 btn */
    .dow {
        fill:none;
        stroke:#4481ff;
        stroke-linecap:round;
        stroke-linejoin:round;
        stroke-width:1.5px;
    }

    .dowBtn:hover .dow {
        stroke:#5B8FF8;
    }

    /* 刪除 btn */
    .del {
        color: #F73C4E;
    }
    .a {
        fill:none;
        stroke:#F73C4E;
        stroke-linecap:round;
        stroke-width:1.5px;
        stroke-linejoin:round;
    }
    .b {
        fill:#fff;
        stroke-miterlimit:10;
        stroke:#F73C4E;
        stroke-linecap:round;
        stroke-width:1.5px;
    }
    .c {
        stroke:#F73C4E;
        stroke-linecap:round;
        stroke-width:1.5px;
        stroke-miterlimit:10;
    }    
    .delBtn:hover .a, .delBtn:hover .b, .delBtn:hover .c{
        stroke: #e23849;
    }
</style>
