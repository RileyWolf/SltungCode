<template>
  <div>
    <el-row type="flex" justify="space-around">
      <el-col>
        <div class="title-div">全部名單</div>
        <el-row type="flex">
          <el-col>
                <div class="icon-div">
                <font-awesome-icon :icon="['fas', 'circle']" class="icon-circle"/>
                <font-awesome-icon :icon="['fas', 'circle']" class="icon-circle" style="top: 17px"/>
                <font-awesome-icon :icon="['fas', 'circle']" class="icon-circle" style="top: 25px" />
                </div>
            <el-select v-model="value" placeholder="Dropdownlist(Project)" class="dropdownlist" >
              <el-option v-for="(item, index) in projectlist" :key="item.key" :index="index" :value="item.proname">
                <span style="float: left">{{ item.proname }}</span>
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row type="flex">
            <div class="leftbtn-div left-bg-purple"  @click="alluserdata_all">
              <font-awesome-icon :icon="['fas', 'chevron-right']" class="icon-toright" />
              <font-awesome-icon :icon="['fas', 'chevron-right']" class="icon-toright" style="left: 125.21px" />
            </div>
            <div class="rightbtn-div left-bg-purple" @click="alluserdata">
              <div class="select-quantity">{{this.all_selectbox.length}}</div>
              <font-awesome-icon
                :icon="['fas', 'chevron-right']"
                class="icon-toright"
                style="left: 226.21px"
              />
            </div>
        </el-row>
        <el-table ref="multipleTable" height="610" class="leftlist-div" :data="all_userData" tooltip-effect="dark"
          content="width=device-width, initial-scale=1"
          @selection-change="leftChange" >
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column prop="account" label="帳號" width="140" sortable ></el-table-column>
          <el-table-column prop="username" label="姓名" width="90" sortable >
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="right">
                備註品質
                <el-rate v-model="scope.row.rate" disabled score-template="{scope.row.rate}"></el-rate>
                <div slot="reference">
                {{ scope.row.username }}
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column  prop="systemauthority" label="系統權限" width="85" ></el-table-column>
          <el-table-column prop="participate" label="參與專案" show-overflow-tooltip sortable ></el-table-column>
        </el-table>
      </el-col>
      <el-col style="margin-left: 20px">
        <div class="title-div">已加入名單</div>
        <el-row type="flex">
          <div class="leftbtn-div right-bg-purple" style="margin-top: 66px" @click="selectuserdata()">
            <font-awesome-icon :icon="['fas', 'chevron-left']" class="icon-toleft" />
            <div class="select-quantity" style="left: 50px">{{this.individual_selectbox.length}}</div>
          </div>
          <div class="rightbtn-div right-bg-purple" style="margin-top: 66px" @click="selectuserdata_all()">
            <font-awesome-icon :icon="['fas', 'chevron-left']" class="icon-toleft" style="left: 90.79px" />
            <font-awesome-icon :icon="['fas', 'chevron-left']" class="icon-toleft" style="left: 96.79px" />
          </div>
        </el-row>
        <el-table ref="multipleTable2" height="610" class="rightlist-div" :data="individual_userData" tooltip-effect="dark"
          content="width=device-width, initial-scale=1"
          @selection-change="rightChange" >
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column prop="username" label="姓名" width="90" ></el-table-column>
          <el-table-column width="20"><el-divider direction="vertical"></el-divider></el-table-column>
          <el-table-column label="本專案權限設定" >
            <template slot-scope="scope">
                <el-switch  v-model="scope.row.remarks" active-color="#84CD36" active-text="標註" ></el-switch>
                <el-switch  v-model="scope.row.confirm" active-color="#84CD36" active-text="確認" ></el-switch>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" class="savetbn">儲存</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: "taskpop.vue",
  data() {
    return {
      value1: null,
      value2: null,
      colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
      components: {},
      all_userData: [
        { id:1,account: "loodaminne@mail.com",username: "John John Willam",systemauthority: "Admin",participate: "100",remarks: true,confirm: false,rate:2  },
        { id:2,account: "Wangshouminne@mail.com",username: "王曉明",systemauthority: "User",participate: "10",remarks: true,confirm: false,rate:5 },
        { id:3,account: "Mootingting@mail.com",username: "穆曉亭",systemauthority: "User",participate: "6",remarks: false,confirm: true,rate:3 },
        { id:4,account: "examplemail@youemaha.com",username: "熊本大大",systemauthority: "User",participate: "30",remarks: true,confirm: false,rate:2 },
        { id:5,account: "examplemail@youemaha.com",username: "熊大大",systemauthority: "User",participate: "30",remarks: true,confirm: false,rate:4 },
        { id:6,account: "examplemail@youemaha.com",username: "徐三石",systemauthority: "User",participate: "33",remarks: false,confirm: false,rate:2 },
        { id:7,account: "examplemail@youemaha.com",username: "蘇美珠",systemauthority: "User",participate: "20",remarks: true,confirm: true,rate:1 },
        { id:8,account: "examplemail@youemaha.com",username: "吳三桂",systemauthority: "User",participate: "21",remarks: true,confirm: false,rate:2 },
        { id:9,account: "examplemail@youemaha.com",username: "唐舞靈",systemauthority: "User",participate: "11",remarks: true,confirm: false,rate:4 },
      ],
      individual_userData:[],
      projectlist: [
        { id:1,proname: "1",},
        { id:2,proname: "2",},
        { id:3,proname: "3",},
      ],
      all_selectbox: [],
      individual_selectbox:[],
      value: ""
    };
  },
  methods: {
    alluserdata_all:function () {
      this.individual_userData.push.apply(this.individual_userData,this.all_userData)
      this.all_userData=[]
    },
    selectuserdata_all:function () {
      this.all_userData.push.apply(this.all_userData,this.individual_userData)
      this.individual_userData=[]
    },
    selectuserdata:function () {
          this.all_userData.push.apply(this.all_userData,this.individual_selectbox)
          this.individual_userData = this.individual_userData.filter(item => { return this.all_userData.every(data => data.id !== item.id) })
          this.$refs.multipleTable.clearSelection();
        },
    alluserdata:function () {
      this.individual_userData.push.apply(this.individual_userData,this.all_selectbox)
      this.all_userData = this.all_userData.filter(item => { return this.individual_userData.every(data => data.id !== item.id) })
      this.$refs.multipleTable2.clearSelection();
    },
    rightChange(val){
      this.individual_selectbox = val;
    },
    leftChange(val) {
      this.all_selectbox = val;
    },
  },
};
</script>
<style scoped>
.el-table >>> .el-table__body-wrapper::-webkit-scrollbar {
    width: 17px;
}
.el-table >>>.el-table__body-wrapper::-webkit-scrollbar-thumb {
    background-color: #00000029;
}
.el-col {
  border-radius: 5px;
}
.item {
  margin: 4px;
}
.right {
      float: right;
      width: 60px;
    }
.icon-close-div {
  width: 30px;
  height: 30px;
  top: 22px;
  left: 908px;
  position: absolute;
}
.title-div {
  font-size: 18px;
  font-weight: bolder;
}
.icon-div {
  width: 39px;
  height: 39px;
  background-color: #f6f7fa;
  margin-top: 12px;
  position: relative;
  float: left;
}
.icon-circle {
  width: 5px;
  height: 5px;
  top: 9px;
  left: 17px;
  position: absolute;
}
.dropdownlist {
  width: 451px;
  height: 39px;
  margin-top: 12px;
  margin-left: 10px;
}
.left-bg-purple {
  background: #f6faf8;
  width: 250px;
  height: 39px;
  position: relative;
  cursor: pointer;
}
.left-bg-purple:hover {
  background: #4481ff;
  width: 250px;
  height: 39px;
}
.right-bg-purple {
  background: #f6faf8;
  width: 195px;
  height: 39px;
  position: relative;
  cursor: pointer;
}
.right-bg-purple:hover {
  background: #4481ff;
  width: 195px;
  height: 39px;
}
.leftbtn-div {
  margin-top: 15px;
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
}
.rightbtn-div {
  margin-top: 15px;
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
}
.icon-toright {
  width: 8px;
  height: 13px;
  left: 119.21px;
  top: 13px;
  position: absolute;
}
.icon-toleft {
  width: 8px;
  height: 13px;
  left: 15px;
  top: 13px;
  position: absolute;
}
.left-bg-purple:hover .icon-toright {
  color: #f6f7fa;
}
.left-bg-purple:hover .select-quantity {
  color: #f6f7fa;
}
.right-bg-purple:hover .icon-toleft {
  color: #f6f7fa;
}
.right-bg-purple:hover .select-quantity {
  color: #f6f7fa;
}
.select-quantity {
  font-size: 15px;
  color: #4481ff;
  top: 11px;
  left: 194px;
  position: absolute;
}
.leftlist-div {
  width: 500px;
  height: 571px;
  color: #233044;
}

.rightlist-div {
  width: 390px;
  height: 571px;
  color: #233044;
}
.savetbn{
    width: 158px;
    height: 48px;
    margin-top: 40px;
    float: right;
}
.el-table >>> thead .cell {
    color: #233044;
    font-size: 16px;
    font-weight:normal;
}
.el-table >>> .is-scrolling-none{
    border: 1px solid #161B2E33;
}
.el-table >>> tr {
    height: 70px;
}
.el-table >>> tr .el-switch{
    margin-left: 15px;
}
.el-table >>> tr .el-switch__label{
    color: #233044;
}
</style>