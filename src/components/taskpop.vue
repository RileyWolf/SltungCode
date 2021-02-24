<template>
  <div class="background">
    <div class="taskpop-container">
      <div class="icon-close-div">
        <font-awesome-icon :icon="['fas', 'times']" style="color: #737895" />
      </div>
      <div class="all-list-div">全部名單</div>
      <div class="icon-div">
        <font-awesome-icon :icon="['fas', 'circle']" class="icon-circle" />
        <font-awesome-icon
          :icon="['fas', 'circle']"
          class="icon-circle"
          style="top: 17px"
        />
        <font-awesome-icon
          :icon="['fas', 'circle']"
          class="icon-circle"
          style="top: 25px"
        />
      </div>
      <div class="selection-bar">
        <div style="color: #a9a9a9; left: 15px; position: absolute">
          Dropdownlist(Project)
        </div>
        <font-awesome-icon
          :icon="['fas', 'chevron-down']"
          class="icon-chevron-down"
        />
      </div>
      <div class="toright-div">
        <font-awesome-icon
          :icon="['fas', 'chevron-right']"
          class="icon-double-right"
        />
        <font-awesome-icon
          :icon="['fas', 'chevron-right']"
          class="icon-double-right"
          style="left: 125.21px"
        />
      </div>
      <div class="toright-div" style="left: 275px">
        <font-awesome-icon
          :icon="['fas', 'chevron-right']"
          class="icon-double-right"
          style="left: 226.21px"
        />
      </div>
      <div class="checkbox"></div>
      <span class="text-div">帳號</span>
      <span class="text-div" style="left: 262.5px">姓名</span>
      <span class="text-div" style="left: 362.75px">系統權限</span>
      <span class="text-div" style="left: 445.75px">參與專案</span>
        <!-- 
       <span class="box-div-left" v-for="(obj, index) in listarray" :key="obj" :index="index">
        <div class="cheach-array"></div>
        <div class="account-array">{{obj.account}}</div> 
        <div class="name-array">{{obj.name}}</div>   
        <div class="systemauthority-array">{{obj.systemauthority}}</div>
        <div class="participate-array">{{obj.participate}}</div>
        </span> -->
      <div class="box-div-left">
        <div class="listarray-div">
          <div class="cheach-array"></div>
          <div class="account-array">Wang@gmail.com</div>
          <div class="username-array">王</div>
          <div class="systemauthority-array">User</div>
          <div class="participate-array">10</div>
        </div>
        <div class="listarray-div">
          <div class="cheach-array"></div>
          <div class="account-array">Mooting@gmail.com</div>
          <div class="username-array">慕</div>
          <div class="systemauthority-array">User</div>
          <div class="participate-array">6</div>
        </div>
      </div>
      <div class="list-div">已加入名單</div>
      <div class="toright-div" style="width: 195px; left: 545px">
        <font-awesome-icon
          :icon="['fas', 'chevron-left']"
          class="icon-double-right"
          style="left: 17.79px"
        />
      </div>
      <div class="toright-div" style="width: 195px; left: 740px">
        <font-awesome-icon
          :icon="['fas', 'chevron-left']"
          class="icon-double-right"
          style="left: 90.79px"
        />
        <font-awesome-icon
          :icon="['fas', 'chevron-left']"
          class="icon-double-right"
          style="left: 96.79px"
        />
      </div>
      <div class="checkbox" style="left: 564px"></div>
      <span class="text-div" style="left: 598.75px">姓名</span>
      <span class="text-div" style="left: 758px">本專案權限設定</span>
      <div class="box-div-right"></div>
    </div>
  </div>
</template>
<script>
export default {
  name: "taskpop.vue",
  components: {},
//   listarray: {
//     account: "Wang@gmail.com",
//     name: "王",
//     systemauthority: "User",
//     participate: "100",
//   },
    account: "Wang@gmail.com",
    username: "王",
    systemauthority: "User",
    participate: "100"
};
</script>
<style scoped>
.icon-close-div {
  width: 30px;
  height: 30px;
  top: 22px;
  left: 908px;
  position: absolute;
}
.background {
  width: 1920px;
  height: 1080px;
  background-color: #233044;
  position: relative;
}
.taskpop-container {
  width: 960px;
  height: 910px;
  background-color: #ffffff;
  border-radius: 5px;
  margin-top: 68px;
  margin-left: 480px;
  position: relative;
}
.all-list-div {
  margin-top: 49px;
  margin-left: 25px;
  position: absolute;
  font-size: 18px;
  font-weight: bolder;
}
.list-div {
  margin-top: 49px;
  margin-left: 545px;
  position: absolute;
  font-size: 18px;
  font-weight: bolder;
}
.icon-div {
  width: 39px;
  height: 39px;
  position: absolute;
  background-color: #f6f7fa;
  top: 88px;
  left: 25px;
}
.icon-circle {
  width: 5px;
  height: 5px;
  top: 9px;
  left: 17px;
  position: absolute;
}
.selection-bar {
  width: 451px;
  height: 39px;
  top: 88px;
  left: 74px;
  position: absolute;
  display: flex;
  align-items: center;
  border: 1px solid #dee2e6;
  cursor: pointer;
}
.icon-chevron-down {
  width: 13px;
  left: 422px;
  position: absolute;
}
.toright-div {
  width: 250px;
  height: 39px;
  top: 142px;
  left: 25px;
  position: absolute;
  background-color: #f6f7fa;
  cursor: pointer;
}
.toright-div:hover {
  background-color: #4481ff;
}
.toright-div:hover .icon-double-right {
  color: #f6f7fa;
}
.icon-double-right {
  width: 8px;
  height: 13px;
  left: 119.21px;
  top: 13px;
  position: absolute;
}
.checkbox {
  width: 17px;
  height: 17px;
  top: 201px;
  left: 39px;
  position: absolute;
  align-items: center;
  border: 1px solid #dee2e6;
}
.text-div {
  font-size: 16px;
  color: #233044;
  top: 196.26px;
  left: 75px;
  position: absolute;
  margin: 0px auto;
}
.box-div-left {
  width: 500px;
  height: 571px;
  top: 231px;
  left: 23px;
  position: relative;
  border: 1px solid #dee2e6;
}
.box-div-left .listarray-div {
  width: 500px;
  height: 50px;
}
.listarray-div div {
    margin:0px auto;
}
.listarray-div .cheach-array {
  width: 50px;
  height: 50px;
  float: left;
  background-color: #edf1f8;
}
.listarray-div .account-array {
  width: 185px;
  height: 50px;
  float: left;
  background-color: #edf1f8;
}
.listarray-div .username-array {
  width: 100px;
  height: 50px;
  float: left;
  background-color: #edf1f8;
}
.listarray-div .systemauthority-array {
  width: 85px;
  height: 50px;
  float: left;
  background-color: #edf1f8;
}
.listarray-div .participate-array {
  width: 80px;
  height: 50px;
  float: left;
  background-color: #edf1f8;
}
.box-div-right {
  width: 390px;
  height: 571px;
  top: 231px;
  left: 545px;
  position: absolute;
  border: 1px solid #dee2e6;
}
</style>