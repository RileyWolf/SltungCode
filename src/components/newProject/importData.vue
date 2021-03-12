<template>
    <div class="flex-column" style="padding: 0; padding-top:15px; height: 100%;">
        <div class="flex-row">
            <div class="flex-column" style="flex: 1;">
                <p class="subtitle">資料來源</p>
                <el-select v-model="sourceSelected"
                            placeholder="請選擇"
                            clearable
                            @change="changeSource()">
                    <el-option
                        v-for="(item, index) in sourceList"
                        :key="index"
                        :label="item.source_name"
                        :value="item.source_id">
                    </el-option>
                </el-select>
            </div>
            <div class="flex-row" style="align-items: flex-end; flex: 1;">
                <div class="flex-column">
                    <p class="subtitle">匯入數量</p>
                    <el-input v-model="size" :disabled="remaining === 0" />
                </div>
                <div class="import" @click="importSource()">匯入</div>
            </div>
        </div>
        <transition name="fade">
            <div class="flex-row info" :class="{ hide: sourceSelected === '' }" v-if="typeof(remaining) === 'number'">
                <svg style="margin-right: 15px;" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13"><path style="fill:#0c5460;" d="M.406,7.313A.407.407,0,0,0,0,7.719v.813a.407.407,0,0,0,.406.406H3.25V7.313ZM12.822,2.666,10.337.178A.609.609,0,0,0,9.9,0H9.75V3.25H13V3.1A.607.607,0,0,0,12.822,2.666Zm-3.885.787V0H3.859A.608.608,0,0,0,3.25.609v6.7H6.5V5.657a.407.407,0,0,1,.7-.287L9.623,7.82a.432.432,0,0,1,0,.609l-2.43,2.448a.407.407,0,0,1-.7-.287V8.938H3.25v3.453A.608.608,0,0,0,3.859,13h8.531A.608.608,0,0,0,13,12.391V4.063H9.547A.611.611,0,0,1,8.938,3.453Z"/></svg>
                <p>此資料來源總數 {{ limit }} 筆，尚有 {{ remaining }} 筆可匯入。</p>
                <!-- <i class="el-icon-close" @click="closeInfo(index)"></i> -->
            </div>
        </transition>
        <div class="line"></div>
        <el-table :data="importLog"
                height="600"
                :default-sort="{ prop: 'time', order: 'null'}">
            <el-table-column
                label="#"
                type="index">
            </el-table-column>
            <el-table-column
                label="匯入時間"
                prop="time"
                sortable
                width="200">
            </el-table-column>
            <el-table-column
                label="資料來源"
                prop="source_name"
                width="200">
            </el-table-column>
            <el-table-column
                label="總數量"
                prop="total">                
            </el-table-column>
            <el-table-column
                label="匯入數量"
                prop="imported">
                
            </el-table-column>
            <el-table-column
                label="尚可匯入數"
                prop="remaining">                
            </el-table-column>
            <template slot="empty">
                <div></div>
            </template>
        </el-table>
    </div>
</template>

<script>
/* eslint-disable no-unused-vars */
    import { getDataSource, checkFilesImported, importFiles } from '@/api/index.js'
    import moment from 'moment'

    export default {
        name: "importData.vue",
        data() {
            return {
                sourceList: [],
                sourceSelected: '',
                sourceSelectedName: '',
                size: '',

                limit: 0,
                remaining: 0,

                canSave: true,

                importLog: []
            };
        },
        mounted() {
            this.getDataSource()
        },
        methods: {
            async getDataSource() {
                let result = await getDataSource()
                console.log('%c getDataSource', 'color: red;', result.source_list);
                
                this.setDataSource(result)                
            },
            setDataSource(result) {
              if(result.source_list.length !== 0) {
                  result.source_list.forEach(item => {
                      this.sourceList.push({
                            source_id: item.source_id,
                            source_name: item.source_name,
                            total_files: item.total_files,
                            disabled: (item.total_files === 0) ? true : false
                      })
                  })
              }  
            },
            changeSource() {
                this.size = ''
                if(this.sourceSelected !== '') {
                    const index = this.sourceList.findIndex(i => i.source_id === this.sourceSelected )
                    this.sourceSelectedName = this.sourceList[index].source_name
                    this.limit = this.sourceList[index].total_files
                    this.remaining = this.checkFilesImported(this.sourceSelected)
                }
                
            },
            async checkFilesImported(source_id) {
                let param = {
                    project_id: this.$store.state.nowProjectId,
                    source_id
                }
                console.log(param);

                let result = await checkFilesImported(param)
                console.log(result);

                this.remaining = result.total_available_files - result.files_imported_to_project

                return this.remaining
            },
            async importSource() {
                if(this.sourceSelected !== '' && this.size !== '' && this.size !== 0) {
                    if(this.canSave) {
                        this.canSave = !this.canSave
                        setTimeout(() => {
                            this.canSave = !this.canSave
                        }, 1000)

                        let param = {
                            project_id: this.$store.state.nowProjectId,
                            source_id: this.sourceSelected,
                            limit: parseInt(this.size, 10)
                        }

                        let result = await importFiles(param)
                        console.log(result);
                        if(result.result === true) {
                            this.importLog.push({
                                time: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                                source_name: this.sourceSelectedName,
                                total: this.limit,
                                imported: result.total_files_imported,
                                remaining: result.quota_left,
                            })
                            if(result.total_files_imported === 0) {
                                this.$message.error('匯入失敗, 已達到匯入上限！')
                            } else if (result.request_files_to_import !== result.total_files_imported) {
                                this.$message.success(`此專案剩餘筆數為 ${ result.total_files_imported } 筆, 已全數匯入！`)
                            } else if (result.request_files_to_import === result.total_files_imported && result.quota_left !== 0) {
                                this.$message.success(`已成功匯入 ${ result.request_files_to_import } 筆, 尚可匯入 ${ result.quota_left } 筆！`)
                            } else {
                                this.$message.success(`已成功匯入 ${ result.request_files_to_import } 筆, 已全數匯入！`)
                            }

                            this.size = ''
                            this.remaining = this.checkFilesImported(this.sourceSelected)
                        }
                    } else this.$message.warning('操作過於頻繁！')
                } else {
                    this.$message.error('請確認資料填寫是否完成 並 確認是否尚可匯入。')
                }
            },
            closeInfo(index) {
                this.response.splice(index, 1)
            },
        },
    }
</script>

<style scoped>
    * {
        box-sizing: border-box;
    }

    .el-select >>> .el-input .el-select__caret {
        color: #233044;
        font-size: 14px;
        font-weight: bold;
        transition: transform .3s;
        transform: rotateZ(180deg);
        cursor: pointer;
    }

    p {
        margin-bottom: 10px;
    }

    .flex-row {
        display: flex;
        align-items: center;
    }

    .flex-column {
        display: flex;
        flex-direction: column;
        padding: 0 10px;;
    }

    .subtitle {
        /* font-size: 16px; */
    }

    .import {
        width: 120px;
        height: 40px;
        line-height: 40px;
        background-color: #4481FF;
        box-shadow: 0px 3px 6px #4481FF33;
        border: 0;
        border-radius: 3px;
        margin: 0 10px;
        color: #ffffff;
        font-size: 16px;
        cursor: pointer;
        text-align: center;
    }

    .line {
        width: 100%;
        height: 1px;
        background-color: #DEE2E6;
    }
    
    .info {
        position: relative;
        background-color: #D1ECF1; 
        color: #0C5460;
        border-radius: 4px;
        color: #0C5460;
        margin: 24px 10px 30px;
        padding: 12px 20px;
        font-weight: 500;
        font-size: 16px;
        transition: all .3s;
    }

    .info p {
        margin: 0;
        line-height: 24px;
    }

    .info.hide {
        opacity: 0;
    }

    .el-icon-close {
        position: absolute;
        right: 20px;
        cursor: pointer;
        font-weight: bold;
        font-size: 18px;
        color: #98A6AD;
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
        }
    .fade-enter, .fade-leave-to {
        opacity: 0;
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

    .el-table >>> thead th:nth-child(1), .el-table >>> tbody td:nth-child(1) {
        color: #9C9C9C;
    }

    .el-table >>> thead th:nth-child(5), .el-table >>> tbody td:nth-child(5) {
        color: #4481FF;
    }

    .el-table >>> tbody td {
        padding: 20px 0;
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
</style>
