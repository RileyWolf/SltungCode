<template>
  <div class="container-labeling">
    <div class="labeling-sidebar">
      <div class="banner">
        <div @click="virusOpen">
          <i class="el-icon-top-right"></i>
          <div class="expand">Expand All</div>
        </div>
        <div class="back-div">
          <div class="back">Back</div>
        </div>
      </div>
      <el-collapse v-model="activeNames">
        <div
          v-for="virusDataItem in virusData"
          :key="virusDataItem.id"
          :label="virusDataItem"
          :value="virusDataItem"
        >
          <el-collapse-item :name="virusDataItem.id">
            <template slot="title">
              {{ virusDataItem.name }}
              <div class="Gram-amount">{{ virusDataItem.detail.length }}</div>
              <div class="delet-icon" @click="virusDelete(virusDataItem.id)">
                <img src="../assets/icons/delet icon.svg" alt="" />
              </div>
            </template>
            <div
              v-for="(detailItem, detailIndex) in virusDataItem.detail"
              :key="detailItem.id"
              :label="detailItem.size"
              :value="detailItem"
            >
              <div
                class="open-div"
                @click="detsilClick(virusDataItem.id, detailItem.id)"
              >
                <div
                  :class="
                    classname == virusDataItem.id + ' ' + detailItem.id
                      ? 'new-open-amount-div'
                      : 'open-amount-div'
                  "
                >
                  <div class="open-amount">{{ detailIndex + 1 }}</div>
                </div>
                <div class="open-text">{{ detailItem.size }}</div>
                <div class="open-time">{{ detailItem.date }}</div>
                <!-- <i class="el-icon-circle-plus-outline open-icon"></i> -->
                <div class="open-yesno">有(y)</div>
                <div class="open-yesno" style="top: 56px; left: 46px">樣式</div>
                <el-checkbox
                  class="checked"
                  v-model="detailItem.checked"
                ></el-checkbox>
                <div class="open-yesno" style="top: 56px; left: 115px">
                  矩形
                </div>
                <div
                  class="delet-icon"
                  @click="detailDelete(virusDataItem.id, detailItem.id)"
                >
                  <img src="../assets/icons/delet icon.svg" />
                </div>
              </div>
            </div>
          </el-collapse-item>
        </div>
      </el-collapse>
      <div class="save-div">
        <el-button type="primary" class="savebtn">儲存</el-button>
      </div>
    </div>
    <div class="wrap-content">
      <div class="labeling-toolbar">
        <div class="layout">
          <div class="icon">
            <img src="../assets/icons/navigator.svg" alt="" />
          </div>
          <div class="icon">
            <img src="../assets/icons/grid-view.svg" alt="" />
          </div>
          <div class="icon">
            <img src="../assets/icons/one-page-view.svg" alt="" />
          </div>
        </div>
        <div class="action">
          <div class="icon">
            <img src="../assets/icons/ruler.svg" alt="" />
          </div>
          <div class="icon">
            <img src="../assets/icons/pointer.svg" alt="" />
          </div>
          <div class="icon">
            <img src="../assets/icons/rectangle.svg" alt="" />
          </div>
          <div id="zoom-in" class="icon">
            <img src="../assets/icons/zoom-in.svg" alt="" />
          </div>
          <div id="zoom-out" class="icon">
            <img src="../assets/icons/zoom-out.svg" alt="" />
          </div>
          <div class="icon">
            <img src="../assets/icons/move.svg" alt="" />
          </div>
          <div class="icon">
            <img src="../assets/icons/reports.svg" alt="" />
          </div>
        </div>
      </div>

      <!-- <div id="navigatorDiv" >

                </div> -->
      <div style="position: relative; width: 100%">
        <div
          id="labelingDiv"
          style="width: 100%; height: calc(100vh - 54px)"
        ></div>
        <div style="position: absolute; top: 200px; left: 20px">
          <div>專案名稱: {{ projectName }}</div>
          <div>Task ID: {{ taskId }}</div>
          <div>Study ID: {{ studyId }}</div>
          <div>檢體編號: {{ specNo }}</div>
          <div>檢驗日期: {{ examDate }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import OpenSeadragon from 'openseadragon'  // npm install

import OpenSeadragon from "@/js/openseadragon.js"; // older version
// import '@/js/openseadragon-scalebar.js'
import "@/js/openseadragon-fabricjs-overlay.js";

import { fabric } from "fabric";
import "@/js/fabric.adapted.js";

export default {
  data() {
    return {
      activeNames: [], //存入當前展開的virusData的id
      detailOpen: false,
      checked: true,
      viewer: null,
      overlay: null,
      classname: "",
      virusData: [
        {
          id: 1,
          name: "革蘭式陽性球菌",
          detail: [
            { id: 1, size: "99.9x99.9", date: "2021/01/23", checked: true },
            { id: 2, size: "31513x515", date: "2021/01/25", checked: false },
            { id: 3, size: "55x848", date: "2021/01/25", checked: false },
            { id: 4, size: "54x51", date: "2021/01/27", checked: true },
          ],
        },
        {
          id: 2,
          name: "革蘭式陰性球菌",
          detail: [
            { id: 1, size: "9x56", date: "2021/01/21", checked: false },
            { id: 2, size: "55x489", date: "2021/01/25", checked: true },
            { id: 3, size: "33.9x2.9", date: "2021/01/26", checked: false },
          ],
        },
        {
          id: 3,
          name: "陰性球菌",
          detail: [
            { id: 1, size: "48x589", date: "2021/01/25", checked: false },
            { id: 2, size: "88.9x102.9", date: "2021/01/25", checked: true },
            { id: 3, size: "8x4646", date: "2021/01/26", checked: false },
            { id: 4, size: "9898x898", date: "2021/01/27", checked: true },
            { id: 5, size: "26.9x55.9", date: "2021/01/28", checked: true },
          ],
        },
      ],
      options: {
        id: "labelingDiv",
        prefixUrl: "http://10.5.71.209:9090/25129342_files",
        constrainDuringPan: true,
        showNavigator: true,
        // navigatorId:   "navigatorDiv",
        navigatorPosition: "TOP_LEFT",
        // navigatorTop:      "16px",
        // navigatorLeft:     "16px",
        // navigatorHeight:   "180px",
        // navigatorWidth:    "210px",

        zoomInButton: "zoom-in",
        zoomOutButton: "zoom-out",
        // homeButton:     "home",
        // fullPageButton: "full-page",
        // nextButton:     "next",
        // previousButton: "previous",

        // maxZoomPixelRatio: 2,
        // minZoomLevel: 11,
      },
      projectName: "CXR CVP1",
      taskId: "133455",
      studyId: "1234567890",
      specNo: "1356290",
      examDate: "2020/08/02",
      drawType: null,
      doDrawing: false,
      mouseFrom: {},
      mouseTo: {},
    };
  },
  mounted() {
    this.viewer = OpenSeadragon(this.options);
    this.viewer.addTiledImage({
      tileSource: "http://10.5.71.209:9090/25129342`.dzi",
    });

    this.viewer.addHandler("open", () => {
      this.viewer.source.minLevel = 11;
    });

    // this.viewer.scalebar({
    //     type: OpenSeadragon.ScalebarType.MAP,
    //     pixelsPerMeter: 2000000, //设置像素与实际的比值
    //     minWidth: "150px",
    //     location: OpenSeadragon.ScalebarLocation.BOTTOM_RIGHT,
    //     xOffset: 10,
    //     yOffset: 10,
    //     stayInsideImage: false,
    //     color: "rgb(35, 48, 68)",
    //     fontColor: "rgb(35, 48, 68)",
    //     backgroundColor: "rgba(255, 255, 255, 0.5)",
    //     fontSize: "middle",
    //     barThickness: 1,
    // })

    // Initialize overlay
    var options = {
      scale: 1000,
    };
    this.overlay = this.viewer.fabricjsOverlay(options);

    this.overlay.fabricCanvas().freeDrawingBrush.color = "#4481FF"; // 設定畫筆顏色
    this.overlay.fabricCanvas().freeDrawingBrush.width = 3; // 設定畫筆寬度

    this.overlay.fabricCanvas().on("mouse:down", this.mouseDown);
    this.overlay.fabricCanvas().on("mouse:move", this.mouseMove);
    this.overlay.fabricCanvas().on("mouse:up", this.mouseUp);

    // Add fabric rectangle
    var rect = new fabric.Rect({
      left: 0,
      top: 0,
      fill: "transparent",
      stroke: "red",
      width: 200,
      height: 200,
    });
    this.overlay.fabricCanvas().add(rect);
  },
  methods: {
    virusOpen: function () {
      console.log(this.activeNames);
      if (this.detailOpen == false) {
        this.virusData.forEach((element) => {
          this.activeNames.push(element.id);
        });
        this.detailOpen = true;
      } else {
        this.activeNames = [];
        this.detailOpen = false;
      }
    },
    virusDelete: function (virusdata_id) {
      console.log(virusdata_id);
      this.virusData = this.virusData.filter(
        (item) => item.id !== virusdata_id
      );
    },
    detailDelete: function (virusdata_id, detail_id) {
      let index = this.virusData.findIndex((elem) => elem.id === virusdata_id);
      this.virusData[index].detail = this.virusData[index].detail.filter(
        (item) => item.id !== detail_id
      );
    },
    detsilClick: function (virusdata_id, detail_id) {
      this.classname = virusdata_id + " " + detail_id;
    },
    mouseDown(event) {
      if (this.drawType) {
        let offset_x = this.overlay.fabricCanvas().calcOffset()
          .viewportTransform[4];
        let offset_y = this.overlay.fabricCanvas().calcOffset()
          .viewportTransform[5];
        this.viewer.setMouseNavEnabled(false); // Disable OSD mousevents
        this.mouseFrom.x = Math.round(event.e.offsetX - offset_x);
        this.mouseFrom.y = Math.round(event.e.offsetY - offset_y);
        this.doDrawing = true;
      }
    },
    mouseMove(event) {
      if (this.drawType) {
        let offset_x = this.overlay.fabricCanvas().calcOffset()
          .viewportTransform[4];
        let offset_y = this.overlay.fabricCanvas().calcOffset()
          .viewportTransform[5];
        this.mouseTo.x = Math.round(event.e.offsetX - offset_x);
        this.mouseTo.y = Math.round(event.e.offsetY - offset_y);
        this.drawing();
      }
    },
    mouseUp(event) {
      let offset_x = this.overlay.fabricCanvas().calcOffset()
        .viewportTransform[4];
      let offset_y = this.overlay.fabricCanvas().calcOffset()
        .viewportTransform[5];
      this.mouseTo.x = Math.round(event.e.offsetX - offset_x);
      this.mouseTo.y = Math.round(event.e.offsetY - offset_y);
      // groupObject = null
      this.doDrawing = false;
      this.drawType = null;
      this.viewer.setMouseNavEnabled(true);
    },
    drawing() {},
  },
};
</script>

<style scoped>
.el-checkbox >>> .el-checkbox__label {
  color: #eef1f6;
}
.el-collapse {
  border-top: 0px;
  background: #233044;
}
.el-collapse >>> .el-collapse-item {
  background: #233044;
}
.el-collapse >>> .el-collapse-item__header {
  background: #233044;
  color: #eef1f6;
  font: normal 16px/25px Arial;
  border-width: 0px;
  position: relative;
  padding-left: 48px;
}
.el-collapse >>> .el-collapse-item__arrow {
  margin: 0px 0px 0px -31px;
  position: absolute;
}
.el-collapse >>> .el-collapse-item .is-active {
  background: #415a7e;
}
.el-collapse >>> .el-collapse-item__wrap {
  padding-bottom: 0px;
  border-bottom: 2px solid #233044;
  background: #233044;
}
.el-collapse >>> .el-collapse-item__content {
  padding-bottom: 0px;
  background: #233044;
}

.container-labeling {
  height: 100%;
  display: flex;
}
.labeling-toolbar {
  width: 100%;
  height: 54px;
  background: #233044;
  display: flex;
  justify-content: space-between;
}
.wrap-content {
  width: 1299px;
}

.labeling-toolbar {
  display: flex;
  align-items: center;
}
.labeling-sidebar {
  width: 336px;
  background: #233044;
  height: 1080px;
  overflow-y: auto;
}
.toolbar,
.wrap-btn,
.layout,
.action {
  display: flex;
}
.save-div {
  height: 100px;
  top: 924px;
  position: relative;
  background-color: #202a39;
}
.savebtn {
  width: 258px;
  height: 48px;
  position: absolute;
  top: 27px;
  left: 39px;
}
.banner {
  position: relative;
  justify-content: space-between;
  align-items: center;
  height: 54px;
}
.banner .expand {
  letter-spacing: 0.12px;
  font: normal normal 300 12px/20px Arial Hebrew;
  color: #415a7e;
}
i {
  color: #415a7e;
}

.banner i {
  position: absolute;
  left: 10.46px;
  top: 35.5px;
  cursor: pointer;
}
.expand {
  position: absolute;
  left: 25.46px;
  top: 33px;
  margin-left: 5px;
  cursor: pointer;
}
.back-div {
  width: 70px;
  height: 55px;
  position: relative;
  left: 246px;
  background-color: #233044;
  position: relative;
  cursor: pointer;
}
.back-div:hover {
  width: 90px;
  height: 55px;
  position: relative;
  left: 246px;
  background-color: #466086;
}
.back {
  font: normal normal normal 17px/20px Arial;
  letter-spacing: 0px;
  color: #466086;
  top: 18px;
  left: 18px;
  position: absolute;
}
.back:before {
  content: "<";
  position: relative;
  left: -10px;
}
.back-div:hover .back {
  color: white;
}
.delet-icon {
  color: #eef1f6;
  position: absolute;
  left: 306.11px;
}
.Gram-amount {
  color: #4481ff;
  font: normal normal normal 20px/25px Arial;
  position: absolute;
  top: 11px;
  left: 267px;
}
.open-div {
  height: 82px;
  position: relative;
  margin-top: 2px;
  box-shadow: inset 0 -2px 0 #344865;
}
.open-amount-div {
  width: 35px;
  height: 82px;
  background-color: #344865;
}
.new-open-amount-div {
  width: 35px;
  height: 82px;
  background-color: #69c47e;
}
.open-amount {
  top: 6px;
  left: 13px;
  position: absolute;
  color: #eef1f6;
  font: normal normal normal 16px/25px Arial;
  letter-spacing: 0.48px;
}
.open-text {
  top: 6px;
  left: 46px;
  position: absolute;
  color: #5b7bad;
  font: normal normal normal 16px/25px Arial;
  letter-spacing: 0.48px;
}
.open-time {
  top: 6px;
  left: 256px;
  position: absolute;
  color: #5b7bad;
  font: normal normal normal 12px/25px Arial;
  letter-spacing: 0px;
}
.open-icon {
  width: 13px;
  height: 13px;
  position: absolute;
  top: 36px;
  left: 46px;
  color: #eef1f6;
}
.open-yesno {
  top: 29px;
  left: 69px;
  position: absolute;
  color: #eef1f6;
  font: normal normal normal 16px/28px Arial;
  letter-spacing: 0.36px;
}
.checked {
  top: 56px;
  left: 92px;
  position: absolute;
  color: #eef1f6;
}
.open-div .delet-icon {
  color: #eef1f6;
  position: absolute;
  top: 56px;
  left: 306.11px;
  cursor: pointer;
}
.zoom-in {
  width: 18px;
  height: 18px;
  color: aquamarine;
  font-size: 24px;
  padding: 0 10px;
  cursor: pointer;
}
.icon {
  width: 20px;
  height: 20px;
  padding: 0 17px;
}
.icon:hover {
  cursor: pointer;
}
.icon img {
  vertical-align: middle;
}

.layout .icon:nth-child(1) {
  border-right: 1px solid #394d6c;
  margin-right: 72px;
}

.layout .icon:nth-child(3) {
  padding-right: 25px;
  border-right: 1px solid #394d6c;
}

.action .icon:nth-child(1) {
  border-left: 1px solid #394d6c;
}

.action .icon:nth-child(3),
.action .icon:nth-child(6) {
  border-right: 1px solid #394d6c;
}
</style>