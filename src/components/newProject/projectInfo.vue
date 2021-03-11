<template>
    <div class="new-project-info-container">
        <div class="new-project-subtitle">專案資訊</div>
        <div class="info-detail">
            <div style="display: flex;justify-content: space-between">
                <div>專案名稱<span class="mustInput"> *</span></div>
                <template v-if="checkNameSts">
                    <div v-if="checkNameSts.result">
                        <img src="../../assets/icons/checkmark-circle.svg"/>
                    </div>
                    <div v-else style="display: flex;align-items: center">
                        <img style="margin-right: 5px" src="../../assets/icons/close-circle.svg"/>
                        <span>{{checkNameSts.message}}</span>
                    </div>
                </template>
            </div>
            <div class="text-div">
                <input type="text"
                       v-model.lazy="projectName"
                       class="text-format"
                       placeholder="請輸入..."
                       @change="checkProjectName">
            </div>
        </div>
        <div class="info-detail">
            <div>專案說明<span class="mustInput"> *</span> <i :class="(isview)?'el-icon-view':'el-icon-edit'"
                                                          @click="isview=!isview"/></div>
            <div class="textarea-div">
                <textarea v-if="!isview" class="textarea-format" v-model="projectDescription"></textarea>
                <div v-if="isview" v-html="compiledMarkdown"></div>
            </div>
        </div>
        <div class="info-detail" style="min-height: 180px">
            <div>標籤建立</div>
            <div class="text-div" style="position: relative">
                <input type="text" class="text-format" placeholder="請輸入..." v-model="newTag">
                <span class="add-tag" @click="addTag">添加</span>
            </div>
            <div style="display: flex; flex-wrap: wrap">
                <span class="tag-format" v-for="(tag, index) in tagList" :key="tag">
                    {{ tag }}
                    <i class="el-icon-close" @click="removeTag(index)"></i>
                </span>
            </div>
            <div class="setting-member-btn" @click="dialogVisible = true">
                <svg xmlns="http://www.w3.org/2000/svg" width="19.261" height="15.409" viewBox="0 0 19.261 15.409">
                    <path style="fill:#fff;"
                          d="M18.779,6.26H16.853V4.334a.483.483,0,0,0-.482-.482h-.963a.483.483,0,0,0-.482.482V6.26H13a.483.483,0,0,0-.482.482V7.7A.483.483,0,0,0,13,8.186h1.926v1.926a.483.483,0,0,0,.482.482h.963a.483.483,0,0,0,.482-.482V8.186h1.926a.483.483,0,0,0,.482-.482V6.741A.483.483,0,0,0,18.779,6.26ZM6.741,7.7A3.852,3.852,0,1,0,2.889,3.852,3.852,3.852,0,0,0,6.741,7.7Zm2.7.963h-.5a5.239,5.239,0,0,1-4.388,0h-.5A4.046,4.046,0,0,0,0,12.712v1.252a1.445,1.445,0,0,0,1.445,1.445H12.038a1.445,1.445,0,0,0,1.445-1.445V12.712A4.046,4.046,0,0,0,9.438,8.667Z"/>
                </svg>
                設定參與者
            </div>
            <change-member-list :dialogVisible.sync="dialogVisible" @updateDialogVisible="dialogVisible = $event"
                                @storeUser="storeUser"/>
        </div>
        <div>
            <div class="save-btn" @click="doSave()" :class="{ disabledStyle: $store.state.nowProjectId }">儲存</div>
        </div>
    </div>
</template>

<script>
    import marked from "marked";
    import {saveNewProject, checkProName, addProjectMember} from "../../api";

    import changeMemberList from "./changeMemberList.vue";

    export default {
        name: "projectInfo.vue",
        components: {
            changeMemberList,
        },
        computed: {
            compiledMarkdown: function () {
                return marked(this.projectDescription, {sanitize: true});
            }
        },
        data() {
            return {
                projectName: '', //專案名稱
                projectDescription: '',
                newTag: '',
                tagList: [],
                isview: false,
                saved: false,
                dialogVisible: false,
                checkNameSts: '',
                memberListObj: '',
                userList: '' // 選擇的人員清單
            }
        },
        methods: {
            addTag() {
                if (this.newTag) {
                    this.tagList.push(this.newTag)
                    this.newTag = ''
                }
            },
            removeTag(index) {
                this.tagList.splice(index, 1)
            },
            storeUser(param) {
                this.userList = param
                this.dialogVisible = false
            },
            async checkProjectName() {
                if (this.projectName) {
                    let nameObj = {
                        project_name: this.projectName,
                    };
                    let result = await checkProName(nameObj);
                    console.log('確認專案名稱=>', result)
                    this.checkNameSts = result
                } else {
                    this.checkNameSts = ''
                }
            },
            async doSave() {
                if (!this.saved) {
                    let checkInput = this.checkInput()

                    if (checkInput) {
                        let paramObj = {
                            project_name: this.projectName,
                            project_description: this.projectDescription,
                            tags: this.tagList
                        }
                        let result = await saveNewProject(paramObj)
                        console.log('新增專案=>', result);
                        if (result.result) {
                            this.$store.commit('chgNowProjectId', result.project_id)
                            this.saved = true
                            this.doSaveMember()
                            this.$message({
                                message: '新增專案成功',
                                type: 'success'
                            });

                        } else {
                            this.$message.error('新增專案失敗');
                        }
                    }
                }
            },
            async doSaveMember() {
                let paramObj = this.userList
                paramObj.project_id = this.$store.state.nowProjectId
                let result = await addProjectMember(paramObj)
                console.log(result)
            },
            checkInput() {
                let errMsg = '尚未填寫：'
                let sts = true

                if (this.projectName == '') {
                    errMsg += '項目名稱 ';
                    sts = false;
                }
                if (this.projectDescription == '') {
                    errMsg += '專案說明 ';
                    sts = false;
                }
                // if (this.tagList.length == 0) {
                //     errMsg += '標籤 ';
                //     sts = false
                // }

                if (this.userList.members_info_list.length==0) {
                    errMsg += '參與人員'
                    sts = false
                }

                if (typeof(this.checkNameSts)=='object' && !this.checkNameSts.result) {
                    errMsg = '專案名稱重複'
                    sts = false
                }

                if (!sts) {
                    this.$message.error(errMsg)
                }
                return sts
            }
        }
    }
</script>

<style scoped>
    .new-project-info-container {
        /*width: 585px;*/
        /*min-height: 100vh;*/
        background-color: #FFFFFF;
        padding: 15px 20px;
        margin-top: 10px;
        margin-left: 32px;
        position: relative;
        overflow-y: scroll;
    }

    .new-project-subtitle {
        background-color: #F6F7FA;
        padding: 8px 0px 10px 10px;
        font-size: 18px;
        border-left: 5px solid #4481FF;
    }

    .info-detail {
        margin-top: 19px;
    }

    .text-div {
        display: flex;
        align-items: center;
        border: 1px solid #DEE2E6;
        border-radius: 3px;
        height: 35px;
        padding: 2px 0px 2px 12px;
        margin-top: 10px;
    }

    .text-format {
        border: 0px;
        outline: 0px;
        width: 80%;
        font-size: 16px;
    }

    .textarea-div {
        min-height: 325px;
        max-height: 325px;
        background-color: #ffffff;
        border: 1px solid #DEE2E6;
        border-radius: 3px;
        padding: 16px;
        margin-top: 10px;
        overflow: scroll;
    }

    .textarea-format {
        min-height: 313px;
        outline: 0px;
        border: 0px;
        width: 98%;
        resize: none;
        font-family: Arial;
        font-size: 14px;
        line-height: 20px;
        color: #233044;
    }

    .add-tag {
        position: absolute;
        width: 100px;
        height: 39px;
        background-color: #13D098;
        box-shadow: 0px 3px 6px #13D09833;
        border-radius: 0px 3px 3px 0px;
        right: -1px;
        color: #FFFFFF;
        text-align: center;
        line-height: 39px;
        cursor: pointer;
    }

    .add-tag:hover {
        background-color: #11BA88;
    }

    .add-tag:active {
        box-shadow: 0 0 0 2pt #13D09859;
    }

    .tag-format {
        background: #EDF1F8;
        border-radius: 3px;
        height: 35px;
        line-height: 35px;
        padding: 0px 8px 0px 13px;
        margin-right: 8px;
        margin-top: 10px;
    }

    .el-icon-close {
        color: #A1AEC3;
        font-size: 12px;
        margin-left: 5px;
        cursor: pointer;
    }

    .setting-member-btn {
        margin-top: 18px;
        width: 150px;
        height: 43px;
        background-color: #09ABB8;
        box-shadow: 0px 3px 6px #09ABB833;
        border-radius: 3px;
        color: #ffffff;
        line-height: 43px;
        text-align: center;
        cursor: pointer;
        font-size: 16px;
    }

    .save-btn {
        position: relative;
        left: calc(100% - 150px);
        bottom: 0;
        width: 150px;
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

    .disabledStyle {
        background-color: #E0E0E0;
        color: #A6A6A6;
        cursor: not-allowed;
    }

    .mustInput {
        color: red;
    }
</style>
