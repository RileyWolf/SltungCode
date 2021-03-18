<template>
    <div>
        <div class="projectList-div">
            <div class = "peoject-search-div">
                <div class="peoject-div">專案</div>
                <div class="search-div">
                    <el-input placeholder="Filter" v-model="search" />
                </div>
            </div>
            <div v-for=" (projectItem) in projectList " :key=" projectItem.id " :label=" projectItem.id " :value=" projectItem" >
                <div :class=" projectId == projectItem.projectname ? 'new-project-div' : 'project-div'" 
                @click=" projectItemClick( projectItem.projectname ) ">
                    <div class="list-name-div">{{ projectItem.projectname }}</div>
                    <div class="list-detailamount-div">{{ projectItem.detail_amount }}</div>
                    <i class="el-icon-arrow-right list-icon-div"></i>
                </div>
            </div>
        </div>
        <div class="header-div">
            <div class="header-all-div">全部</div>
            <div class="header-recently-div">近期完成</div>
        </div>
        <details-project :project-id='projectId'></details-project>
    </div>
</template>

<script>
import detailsProject from "@/components/workList/detailsProject.vue";
    export default {
        name: "workList",
        components: {
            detailsProject,
        },
        data() {
            return {
                search:'',
                projectId:'CXR CVP 1',
                projectList: [
                   {id:'1',projectname:'CXR CVP 1',detail_amount:'9999'},
                   {id:'2',projectname:'院內CXR CVP 2',detail_amount:'990'},
                   {id:'3',projectname:'CXR CVP 3',detail_amount:'990'},
                   {id:'4',projectname:'CXR CVP 4',detail_amount:'10'},
                   {id:'5',projectname:'CXR CVP 5',detail_amount:'10'},
                   {id:'6',projectname:'CXR CVP 6',detail_amount:'10'},
                   {id:'7',projectname:'CXR CVP 7',detail_amount:'999'},
                   {id:'8',projectname:'CXR CVP 8',detail_amount:'9929'},
                   {id:'9',projectname:'CXR CVP 9',detail_amount:'9929'},
                   {id:'10',projectname:'CXR CVP 10',detail_amount:'9959'},
                   {id:'11',projectname:'CXR CVP 11',detail_amount:'999'},
                   {id:'12',projectname:'CXR CVP 12',detail_amount:'999'},
               ],
               allprojectList: [
                   {id:'1',projectname:'CXR CVP 1',detail_amount:'9999'},
                   {id:'2',projectname:'院內CXR CVP 2',detail_amount:'990'},
                   {id:'3',projectname:'CXR CVP 3',detail_amount:'990'},
                   {id:'4',projectname:'CXR CVP 4',detail_amount:'10'},
                   {id:'5',projectname:'CXR CVP 5',detail_amount:'10'},
                   {id:'6',projectname:'CXR CVP 6',detail_amount:'10'},
                   {id:'7',projectname:'CXR CVP 7',detail_amount:'999'},
                   {id:'8',projectname:'CXR CVP 8',detail_amount:'9929'},
                   {id:'9',projectname:'CXR CVP 9',detail_amount:'9929'},
                   {id:'10',projectname:'CXR CVP 10',detail_amount:'9959'},
                   {id:'11',projectname:'CXR CVP 11',detail_amount:'999'},
                   {id:'12',projectname:'CXR CVP 12',detail_amount:'999'},
               ]
            }
        },
        watch: {
            search() {
                this.projectList = this.allprojectList;
                if(this.search != '') {
                    this.projectList = this.projectList.filter (
                        (data) => !this.search || data.projectname.toLowerCase().includes(this.search.toLowerCase()) 
                    )
                }
            },
        },
        mounted() {
            this.$nextTick(function() {
                this.style()
            })
        },
        updated() {
            this.$nextTick(function() {
                this.style()
            })
        },
        methods: {
            projectItemClick: function( projectItem_id ) {
                this.projectId = projectItem_id
            },
            handleSelect( key , keyPath ) {
                console.log( key , keyPath );
            },
            style() {
                document.querySelector( '.el-tabs .el-tabs__active-bar.is-top' ).style.width = "90px"
            }
        }
    }
</script>

<style scoped>
    .el-input >>> .el-input__inner {
        background-color:#233044;
        font-size: 16px;
        line-height: 18px;
        border: 0px;
        height: 29px;
    }
    .el-input >>> .el-input__inner::placeholder {
        color: #394D6C;
    }
    .projectList-div {
        width: 270px;
        height: 1025px;
        background-color: #202A39;
        position: relative;
        float:left;
    }
    .peoject-search-div {
        width: 270px;
        height: 80px;
        position: relative;
    }
    .peoject-div {
        color: #EEF1F6;
        line-height: 24px;
        position: absolute;
        top: 15px;
        left: 20px;
        font-size: 16px ;
    }
    .search-div {
        width: 231.29px;
        position: absolute;
        left: 20px;
        top: 43px;
    }
    .projectDetail-div {
        width: 1590px;
        height: 1025px;
        background-color: #F6F7FA;
        position: relative;
        margin-left: 270px;
    }
    .project-div {
        width: 270px;
        height: 60px;
        background-color: #202A39;
        position: relative;
    }
    .list-name-div {
        height: 24px;
        padding: 2px 0px;
        color: #EEF1F6;
        font-size: 16px;
        position: absolute;
        top: 18px;
        left: 20px;
    }
    .list-icon-div {
        width: 5.72px;
        height: 10px;
        color: #FFFFFF;
        position: absolute;
        top: 26.5px;
        left: 244.28px;
    }
    .list-detailamount-div {
        background: #4782DA;
        border-radius: 13px;
        font: normal normal normal 14px/16px Helvetica;
        color: #FFFFFF;
        position: absolute;
        padding: 3px 7px;
        top: 19px;
        left: 190px;
    }
    .new-project-div {
        width: 270px;
        height: 60px;
        background-color: #081B2B;
        position: relative;
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
    .icon-div {
        width: 6.86px;
        height: 12px;
        position: absolute;
        left: 12.28px;
        top:10.84px;
    }
    .header-div {
        height: 35px;
        position: relative;
        margin-left: 281px;
        margin-top: -35px;
    }
    .header-recently-div {
        height: 35px;
        color: #EEF1F6;
        position: absolute;
        padding:0px 9px 0px 10px;
        margin-left: 3px;
        float: left;
        left: 55px;
    }

    .header-all-div-show {
        color: #4782DA;
    }
    .header-all-div {
        height: 35px;
        color: #EEF1F6;
        position: absolute;
        padding:0px 9px 0px 10px;
        margin-left: 3px;
        float: left;
    }
</style>
