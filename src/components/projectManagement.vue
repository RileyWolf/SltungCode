<template>
  <div>
    <Header></Header>
    <side-bar></side-bar>
    <div class="project-management-info-container">
        <div class="project-management-subtitle">專案管理</div>
        <div class="new-search-div" >
            <div class="new-project-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="11.015" height="11.015" viewBox="0 0 11.015 11.015" >
                    <g transform="translate(-6.6 -6.6)">
                        <path class="new-project-btn-a" d="M18,7.5v9.215" transform="translate(-5.893 0)" />
                        <path class="new-project-btn-a" d="M7.5,18h9.215" transform="translate(0 -5.893)" />
                    </g>
                </svg>
                新增專案
            </div>
            <el-divider direction="vertical" class="divider"></el-divider>
            <div>
                <el-input placeholder="请输入專案名稱" v-model="search" class="search">
                    <el-button slot="append" style="whigh: 102px">搜尋</el-button>
                </el-input>
                <svg xmlns="http://www.w3.org/2000/svg" class="search-icon" width="19" height="19" viewBox="0 0 19 19" >
                <g transform="translate(0.035 0.535)">
                    <rect class="search-a" width="19" height="19" transform="translate(-0.035 -0.535)" />
                    <path class="search-b" d="M15.824,14.979l-3.169-3.169a7.2,7.2,0,1,0-.846.845l3.169,3.169a.6.6,0,0,0,.846-.845ZM1.2,7.179a5.981,5.981,0,1,1,10.239,4.2c-.011.01-.023.016-.034.028a.262.262,0,0,0-.027.033A5.979,5.979,0,0,1,1.2,7.179Z" transform="translate(1.965 1.465)" />
                </g>
                </svg>
            </div>
        </div>
        <div class="project-list-div">
        <template>
            <el-table ref="projectData" :data="projectData" style="width: 100%" >
                <el-table-column prop="project_name" label="專案名稱" sortable >
                    <template slot="header">
                        專案名稱
                        <el-select v-model="projectname_scope" class="filter-div" clearable placeholder="Filter" style="width: 195px; height: 29px;" >
                            <el-option
                                v-for="item in allprojectData"
                                :key="item.project_name"
                                :label="item.project_name"
                                :value="item.project_name"
                            />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column prop="modified_datetime" label="日期" sortable column-key="date" >
                    <template slot="header" >
                        日期
                        <el-date-picker
                            class="date-div"
                            type="daterange"
                            v-model="dataRange"
                            start-placeholder="Start"
                            value-format="yyyy/MM/dd"
                            range-separator="-"
                            end-placeholder="End"
                            style=" width: 195px; height: 29px; padding:0px 10px;"
                        />
                    </template>
                </el-table-column>
                <el-table-column prop="amount" label="數量" sortable > </el-table-column>
                <el-table-column prop="completed" label="已完成數量" sortable > </el-table-column>
                <el-table-column prop="personnel" label="人員" > </el-table-column>
                <el-table-column label="進度">
                    <template slot-scope="scope">
                        <el-progress
                        :percentage="scope.row.schedule"
                        :color="customColor"
                        ></el-progress>
                    </template>
                </el-table-column>
            </el-table>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
// import newProject from "./newProject";
import Header from "@/components/header.vue";
import sideBar from "@/components/sideBar.vue";
import {getProjectList} from '../api/index.js';
import moment from 'moment'
export default {
  name: "projectManagement.vue",
  components: {
    Header,
    sideBar,
  },
  computed: {},
  data() {
    return {
      formatdate:new Date(),
      projectname_scope: "",
      projectData: [
        // {
        //   id: 1,
        //   project_name: "CXR CVP1",
        //   date: "2020/08/10",
        //   amount: "99999",
        //   completed: "99999",
        //   personnel: "2",
        //   schedule: 13,
        // },
        // {
        //   id: 2,
        //   project_name: "CXR CVP CXR CVP 2",
        //   date: "2021/08/10",
        //   amount: "99999",
        //   completed: "99999",
        //   personnel: "2",
        //   schedule: 13,
        // },
      ],
      allprojectData: [],
      customColor: "#DEE2E6",
      search: "",
      scope: "",
      dataRange: [],
    };
  },
  watch: {
    toNewProject() {
        this.$router.push({name: 'newProject'})
    },
    search(){
        this.projectData = this.allprojectData;
        if(this.search != ''){
            this.projectData = this.projectData.filter(
                (data) => !this.search || data.project_name.toLowerCase().includes(this.search.toLowerCase()) 
            )
        }
    },
    dataRange() {
      if (this.dataRange != null) {
        this.projectData = this.projectData.filter(
          (data) => Date.parse(data.modified_datetime).valueOf() >= Date.parse(this.dataRange[0]).valueOf() &&
                    Date.parse(data.modified_datetime).valueOf() <= Date.parse(this.dataRange[1]).valueOf()
        );
      } else {
        this.projectData = this.allprojectData;
      }
    },
    projectname_scope() {
      this.projectData = this.allprojectData;
      if (this.projectname_scope != "") {
        this.projectData = this.projectData.filter(
          (data) => data.project_name == this.projectname_scope
        );
      }
    },
  },
  mounted() {
    // var moment = require('moment');
    // console.log(moment(new Date).format('YYYY-MM-DD, HH:mm:ss'))
    this.getProjectList()
  },
  methods: {
    async getProjectList() {
      let result = await getProjectList()
      if (result) {
        console.log(result.data)
        this.allprojectData = result.data
        this.formatProjectList()
      }
    },
    formatProjectList() {
      this.allprojectData.forEach(element => {
        this.projectData.push({
          "modified_datetime":moment(element.modified_datetime).format('YYYY/MM/DD'), //修改時間
          "project_name":element.project_name
        })
      });
      this.allprojectData = this.projectData
    },
  } 
};
</script>

<style scoped>
.el-table >>> .cell{
    padding-left: 7px;
    font-size: 16px;
    font: normal normal normal 16px/25px Arial;
    color: #233044;
}
.el-select >>> .el-input__inner {
  width: 195px;
  height: 29px;
  font-size: 16px;
}
.el-select >>> i {
  opacity: 0;
}
.el-date-editor >>> .el-range-input {
  font-size: 16px;
}
.el-date-editor >>> .el-icon-date {
  opacity: 0;
}
.el-date-editor >>> .el-range-separator {
  padding-bottom: 7px;
  color: #a9a9a9;
}
.el-table >>> .is-leaf {
  font: normal normal medium 16px/25px;
  color: #233044;
  padding-top: 46px;
  padding-bottom: 18px;
}
.el-input-group >>> .el-input__inner {
  font: normal normal normal 16px/25px;
  color: #a9a9a9;
  background-color: #f6f7fa;
  padding: 0px 0px 0px 48px;
}
.el-input-group >>> .el-button {
  color: #ffffff;
  background-color: #4481ff;
  border: 1px solid #4481ff;
  width: 102px;
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
}
.new-project-btn-a {
  fill: none;
  stroke: #fff;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8px;
}
.search-a {
  fill: #fff;
  opacity: 0;
}
.search-b {
  fill: #233044;
}
.project-management-info-container {
  width: 1920px;
  height: 1080px;
  background-color: #f6f7fa;
  margin-left: 60px;
  position: relative;
}
.filter-div{
    position: absolute;
    left: 94px;
}
.date-div{
    position: absolute;
    top: 2px;
    left: 69px;
}
.project-management-subtitle {
  color: #233044;
  font-size: 20px;
  top: 20px;
  left: 45px;
  position: absolute;
  font-weight: bold;
}
.new-search-div {
  width: 1820px;
  height: 80px;
  background-color: #ffffff;
  border-radius: 5px;
  top: 58px;
  left: 20px;
  position: absolute;
}
.new-project-btn {
  width: 154.18px;
  height: 39px;
  background-color: #13d098;
  box-shadow: 0px 3px 6px #13d09833;
  border-radius: 3px;
  color: #ffffff;
  position: absolute;
  line-height: 43px;
  text-align: center;
  cursor: pointer;
  font-size: 16px;
  margin: 19px 0px 0px 20px;
}
.divider {
  height: 39px;
  border: 0px solid #dee2e6;
  opacity: 1;
  position: absolute;
  top: 19px;
  left: 195px;
}
.search {
  width: 444px;
  height: 39px;
  margin: 19px 0px 0px 216px;
  background-color: #f6f7fa;
}
.search-icon {
  left: 231px;
  top: 29px;
  position: absolute;
}
.project-list-div {
  width: 1820px;
  height: 856px;
  background-color: #ffffff;
  border-radius: 5px;
  padding: 0px 40px;
  position: relative;
  top: 147px;
  left: 20px;
}
</style>
