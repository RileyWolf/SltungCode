
<template>
  <div class="new-project-info-container">
    <div class="new-project-subtitle">專案資訊</div>
    <div class="info-detail">
      <div>
        專案名稱
        <div v-if="error == 'ProjectExists'">
          <p class="img">{{ error_message }}</p>
          <img class="img2" src="../../assets/icons/close-circle.svg" />
        </div>
        <div v-if="error == 'ProjectDetails'">
          <p class="img" style="color: green">可使用"{{ project_name }}"</p>
          <img class="img2" src="../../assets/icons/checkmark-circle.svg" />
        </div>
      </div>
      <div class="text-div">
        <input
          type="text"
          class="text-format"
          placeholder="請輸入..."
          v-model.lazy="project_name"
          @change="change"
        />
      </div>
    </div>
    <div class="info-detail">
      <div>
        專案說明
        <i
          :class="isview ? 'el-icon-view' : 'el-icon-edit'"
          @click="isview = !isview"
        />
      </div>
      <div class="textarea-div">
        <textarea
          v-if="!isview"
          class="textarea-format"
          v-model="project_description"
        ></textarea>
        <div v-if="isview" v-html="compiledMarkdown"></div>
      </div>
    </div>
    <div class="info-detail" style="min-height: 180px">
      <div>標籤建立</div>
      <div class="text-div" style="position: relative">
        <input
          type="text"
          class="text-format"
          placeholder="請輸入..."
          v-model="newTag"
        />
        <span class="add-tag" @click="addTag()">添加</span>
      </div>
      <div style="display: flex; flex-wrap: wrap">
        <span class="tag-format" v-for="(tag, index) in tagList" :key="tag">
          {{ tag }}
          <i class="el-icon-close" @click="removeTag(index)"></i>
        </span>
      </div>
    </div>
    <div>
      <div class="save-btn" @click="doSave()">儲存</div>
    </div>
    <el-button type="text" @click="openTask">點擊打開 影像管理平台</el-button>
    <el-dialog  :visible.sync="opentask"  :append-to-body='true' :lock-scroll="false" width="960px">
      <taskpop @update="selfUpdate"></taskpop>
    </el-dialog>
  </div>
</template>

<script>
import marked from "marked";
import taskpop from "./taskpop";
import { saveNewProject } from "../../api/index.js";
import { checkProName } from "../../api/index.js";
import { addPromembers } from "../../api/index.js";

export default {
  name: "projectInfo.vue",
  computed: {
    compiledMarkdown: function () {
      return marked(this.input, { sanitize: true });
    },
  },
  components: {
    taskpop,
  },
  data() {
    return {
      savauserlist:[],
      newTag: "",
      tagList: [],
      isview: false,
      input: "# hello",
      project_description: "",
      project_name: "",
      error: "",
      error_message: "",
      opentask : false,
      pro_id : ''
    };
  },
  methods: {
    selfUpdate(val){
      console.log("這裡是projectInfo")
      this.savauserlist = val
      console.log(this.savauserlist)
      this.opentask = false;
    },
    openTask(){
      this.opentask = true;
    },
    async change() {
      if (this.project_name == "") {
        this.error = "";
      } else {
        let nameObj = {
          project_name: this.project_name,
        };
        let result = await checkProName(nameObj);
        if (result.result == true) {
          this.error = "ProjectDetails";
        } else if (result.result == false) {
          this.error = "ProjectExists";
          this.error_message = result.message;
        }
      }
    },
    addTag() {
      if (this.newTag) {
        this.tagList.push(this.newTag);
        this.newTag = "";
      }
    },
    removeTag(index) {
      this.tagList.splice(index, 1);
    },
    async savaUser(){
      let savaObj = {
        members_info_list:this.savauserlist,
        project_id: this.pro_id
      }
      let result = await addPromembers(savaObj);
      if(result){
        console.log(result)
      }
    },
    async doSave() {
      if (this.error == "ProjectExists") {
        alert("項目名已存在");
      } else if (this.project_name == "") {
        alert("尚未填寫項目名稱");
      } else if (this.tagList.length == 0) {
        alert("尚未填寫標籤");
      } else if (this.project_description == "") {
        alert("尚未填寫內容");
      } else {
        let saveObj = {
          tags  : this.tagList,
          project_description: this.project_description,
          project_name: this.project_name,
        };
        let result = await saveNewProject(saveObj);
        if (result) {
          this.pro_id = result.project_id
          this.tagList = "",
          this.project_description = "",
          this.project_name = "";
          this.error_message = "";
          this.error = "";
          alert("新增完成");
          console.log(result)
          this.savaUser()
        }
      }
      
    },
  },
};
</script>

<style scoped>
.new-project-info-container {
  width: 585px;
  min-height: 945px;
  background-color: #ffffff;
  padding: 15px 20px;
  margin-top: 10px;
  margin-left: 20px;
  position: relative;
}

.new-project-subtitle {
  background-color: #f6f7fa;
  padding: 8px 0px 10px 10px;
  font-size: 18px;
  border-left: 5px solid #4481ff;
}
.info-detail {
  margin-top: 19px;
  position: relative;
  width: 545px;
}
.from {
  widows: 545px;
  height: 15px;
  position: relative;
}
.img {
  margin: 0px auto;
  position: absolute;
  right: 17px;
  top: -2px;
  color: red;
}
.img2 {
  margin: 0px auto;
  position: absolute;
  top: 2px;
  right: 0px;
}
.text-div {
  margin-top: 13px;
  display: flex;
  align-items: center;
  border: 1px solid #dee2e6;
  border-radius: 3px;
  height: 39px;
  padding: 2px 0px 2px 12px;
}

.text-format {
  border: 0px;
  outline: 0px;
  width: 80%;
  font-size: 16px;
}

.textarea-div {
  margin-top: 13px;
  min-height: 405px;
  background-color: #ffffff;
  border: 1px solid #dee2e6;
  border-radius: 3px;
  padding: 16px;
}

.textarea-format {
  min-height: 398px;
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
  background-color: #13d098;
  box-shadow: 0px 3px 6px #13d09833;
  border-radius: 0px 3px 3px 0px;
  right: -1px;
  color: #ffffff;
  text-align: center;
  line-height: 39px;
  cursor: pointer;
}

.add-tag:hover {
  background-color: #11ba88;
}

.add-tag:active {
  box-shadow: 0 0 0 2pt #13d09859;
}

.tag-format {
  background: #edf1f8;
  border-radius: 3px;
  height: 35px;
  line-height: 35px;
  padding: 0px 8px 0px 13px;
  margin-right: 8px;
  margin-top: 10px;
}

.el-icon-close {
  color: #a1aec3;
  font-size: 12px;
  margin-left: 5px;
  cursor: pointer;
}

.save-btn {
  position: absolute;
  bottom: 20px;
  width: 100px;
  height: 43px;
  background-color: #4481ff;
  box-shadow: 0px 3px 6px #4481ff33;
  border-radius: 3px;
  color: #ffffff;
  line-height: 43px;
  text-align: center;
  cursor: pointer;
  font-size: 16px;
}
</style>
