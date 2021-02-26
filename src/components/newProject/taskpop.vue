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
            <div class="leftbtn-div left-bg-purple" @click="selectuserdata">
              <font-awesome-icon :icon="['fas', 'chevron-right']" class="icon-toright" />
              <font-awesome-icon :icon="['fas', 'chevron-right']" class="icon-toright" style="left: 125.21px" />
            </div>
            <div class="rightbtn-div left-bg-purple">
              <div class="select-quantity">{{allamount}}</div>
              <font-awesome-icon
                :icon="['fas', 'chevron-right']"
                class="icon-toright"
                style="left: 226.21px"
              />
            </div>
        </el-row>
        <el-table ref="multipleTable" height="610" class="leftlist-div" :data="all_userData" tooltip-effect="dark"
          content="width=device-width, initial-scale=1"
          @selection-change="handleSelectionChange" >
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column prop="account" label="帳號" width="140" sortable ></el-table-column>
          <el-table-column prop="username" label="姓名" width="90" sortable ></el-table-column>
          <el-table-column  prop="systemauthority" label="系統權限" width="85" ></el-table-column>
          <el-table-column prop="participate" label="參與專案" show-overflow-tooltip sortable ></el-table-column>
        </el-table>
      </el-col>
      <el-col style="margin-left: 20px">
        <div class="title-div">已加入名單</div>
        <el-row type="flex">
          <div class="leftbtn-div right-bg-purple" style="margin-top: 66px">
            <font-awesome-icon :icon="['fas', 'chevron-left']" class="icon-toleft" />
            <div class="select-quantity" style="left: 50px">{{selectamount}}</div>
          </div>
          <div class="rightbtn-div right-bg-purple" style="margin-top: 66px">
            <font-awesome-icon :icon="['fas', 'chevron-left']" class="icon-toleft" style="left: 90.79px" />
            <font-awesome-icon :icon="['fas', 'chevron-left']" class="icon-toleft" style="left: 96.79px" />
          </div>
        </el-row>
        <el-table ref="multipleTable" height="610" class="rightlist-div" :data="individual_userData" tooltip-effect="dark"
          content="width=device-width, initial-scale=1"
          @selection-change="handleSelectionChange" >
          <el-table-column type="selection" width="50" :cell-style="{padding: '0', height: '20px'}"></el-table-column>
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
      components: {},
      all_userData: [
        { id:1,account: "loodaminne@mail.com",username: "John John Willam",systemauthority: "Admin",participate: "100",remarks: true,confirm: false },
        { id:2,account: "Wangshouminne@mail.com",username: "王曉明",systemauthority: "User",participate: "10",remarks: true,confirm: false },
        { id:3,account: "Mootingting@mail.com",username: "穆曉亭",systemauthority: "User",participate: "6",remarks: false,confirm: true },
        { id:4,account: "examplemail@youemaha.com",username: "熊本大大",systemauthority: "User",participate: "30",remarks: true,confirm: false },
        { id:5,account: "examplemail@youemaha.com",username: "熊本大大",systemauthority: "User",participate: "30",remarks: true,confirm: false },
        { id:6,account: "examplemail@youemaha.com",username: "徐三石",systemauthority: "User",participate: "33",remarks: false,confirm: false },
        { id:7,account: "examplemail@youemaha.com",username: "蘇美珠",systemauthority: "User",participate: "20",remarks: true,confirm: true },
        { id:8,account: "examplemail@youemaha.com",username: "吳三桂",systemauthority: "User",participate: "21",remarks: true,confirm: false },
        { id:9,account: "examplemail@youemaha.com",username: "唐舞靈",systemauthority: "User",participate: "11",remarks: true,confirm: false },
      ],
      individual_userData:[],
      projectlist: [
        { id:1,proname: "1",},
        { id:2,proname: "2",},
        { id:3,proname: "3",},
      ],
      all_selectbox: [],
      individual_selectbox:[],
      value: "",
      allamount:0,
      selectamount:0
    };
  },
  methods: {
    selectuserdata:function () {

          this.individual_userData.push.apply(this.individual_userData,this.all_selectbox)
          //在返回push数据后剩余的待选列表所有数据赋值到resetData中，然后再在待选列表中显示检索删除被剩余的数据
          this.all_userData = this.all_userData.splice(this.all_selectbox)
            // this.resetData = this.filterBeforeData;
          //删除左边被选中的数据,返回待选列表中被剩余的数据
        //   this.tableData = this.overlap(this.tableData,this.single_userdat);
          
        },
    toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
    handleSelectionChange(val) {
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