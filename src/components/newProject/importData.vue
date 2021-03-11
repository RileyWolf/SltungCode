<template>
    <div class="flex-column" style="padding: 0; padding-top:15px; height: 100%;">
        <div class="flex-row" style="margin-bottom: 26px;">
            <div class="flex-column">
                <p>資料來源</p>
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
            <div class="flex-column">
                <p>匯入數量</p>
                <el-input v-model="size" :disabled="sizeDisabled" />
            </div>
        </div>
        <div class="flex-row" style="margin-bottom: 26px; align-items: flex-end;">
             <div class="flex-column">
                <!-- <p>包含的關鍵字</p>
                <div class="flex-row">
                    <el-checkbox v-model="includeKeyWordChecked" style="margin-right: 20px;" />
                    <el-input v-model="includeKeyWord" 
                                placeholder="請輸入"/>
                </div> -->
            </div>
            <div class="flex-column">
                <!-- <p>不包含的關鍵字</p> -->
                <div class="flex-row" style="justify-content: flex-end;">
                    <!-- <el-checkbox v-model="notIncludeKeyWordChecked" style="margin-right: 20px;" />
                    <el-input v-model="notIncludeKeyWord" 
                                placeholder="請輸入" style="margin-right: 50px;" /> -->
                    <div class="import" @click="importSource()">匯入</div>
                </div>
            </div>
        </div>
        <div class="line"></div>
        <ul class="flex-column responseList" style="flex-direction: column-reverse;justify-content: flex-end; height: 100%; overflow-x: hidden;">
            <li v-for="(item, index) in response" :key="index" class="flex-row responseItem">
                <svg style="margin-right: 15px;" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13"><path style="fill:#0c5460;" d="M.406,7.313A.407.407,0,0,0,0,7.719v.813a.407.407,0,0,0,.406.406H3.25V7.313ZM12.822,2.666,10.337.178A.609.609,0,0,0,9.9,0H9.75V3.25H13V3.1A.607.607,0,0,0,12.822,2.666Zm-3.885.787V0H3.859A.608.608,0,0,0,3.25.609v6.7H6.5V5.657a.407.407,0,0,1,.7-.287L9.623,7.82a.432.432,0,0,1,0,.609l-2.43,2.448a.407.407,0,0,1-.7-.287V8.938H3.25v3.453A.608.608,0,0,0,3.859,13h8.531A.608.608,0,0,0,13,12.391V4.063H9.547A.611.611,0,0,1,8.938,3.453Z"/></svg>
                <p style="margin-right: 20px;">{{ item.date }}</p>
                <p style="margin-right: 100px;">{{ item.name }}</p>
                <p>{{ item.content }}</p>
                <i class="el-icon-close" @click="closeInfo(index)"></i>
            </li>
        </ul>
    </div>
</template>

<script>
    import { getDataSource, importFiles } from '@/api/index.js'

    export default {
        name: "importData.vue",
        data() {
            return {
                sourceList: [],
                sourceSelected: '',
                sourceSelectedName: '',
                size: '',

                // includeKeyWord: '',
                // notIncludeKeyWord: '',
                // includeKeyWordChecked: false,
                // notIncludeKeyWordChecked: false,

                response: [],
                canSave: true,

                sizeDisabled: false,
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
                if(this.sourceSelected === '') {
                    this.size = ''
                    this.sizeDisabled = false
                }
                else { 
                    const index = this.sourceList.findIndex(i => i.source_id === this.sourceSelected )
                    this.sourceSelectedName = this.sourceList[index].source_name
                    this.size = this.sourceList[index].total_files
                    this.sizeDisabled = (this.sourceList[index].disabled) ? true : false
                }
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
                            if(result.total_files_imported === 0) {
                                this.$message.error('匯入失敗, 已達到匯入上限！')
                            } else if (result.request_files_to_import !== result.total_files_imported) {
                                this.response.push({
                                    date: '2021-02-09',
                                    name: this.sourceSelectedName,
                                    content: `此專案剩餘筆數為 ${ result.total_files_imported } 筆, 已全數匯入！`
                                })
                            } else if (result.request_files_to_import === result.total_files_imported && result.quota_left !== 0) {
                                this.response.push({
                                    date: '2021-02-09',
                                    name: this.sourceSelectedName,
                                    content: `已成功匯入 ${ result.request_files_to_import } 筆, 尚可匯入 ${ result.quota_left } 筆！`
                                })
                            } else {
                                this.response.push({
                                    date: '2021-02-09',
                                    name: this.sourceSelectedName,
                                    content: `已成功匯入 ${ result.request_files_to_import } 筆, 已全數匯入！`
                                })
                            }
                        }
                    } else this.$message.warning('操作過於頻繁！')
                } else {
                    this.$message.error('資料未填寫完整 或 數值為 0 , 無法匯入資料。')
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
        flex: 1;
        padding: 0 10px;
    }

    .import {
        width: 120px;
        height: 40px;
        line-height: 40px;
        background-color: #4481FF;
        box-shadow: 0px 3px 6px #4481FF33;
        border: 0;
        border-radius: 3px;
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

    .responseList {
        overflow-y: scroll;
    }
    
    .responseItem {
        position: relative;
        background-color: #D1ECF1; 
        color: #0C5460;
        border-radius: 4px;
        color: #0C5460;
        margin: 5px 0;
        padding: 12px 20px;
        font-weight: 500;
        font-size: 16px;
    }

    .responseItem p {
        margin: 0;
        line-height: 24px;
    }

    .el-icon-close {
        position: absolute;
        right: 20px;
        cursor: pointer;
        font-weight: bold;
        font-size: 18px;
        color: #98A6AD;
    }
    
</style>
