<template>
    <div style="position: relative;padding-top: 15px; height: 100%;">
        <div class="label-setting-container">
            <span class="shrink-btn" @click="shrinkAll">
                <svg xmlns="http://www.w3.org/2000/svg" width="8.626" height="8.592" viewBox="0 0 8.626 8.592"><g transform="translate(0.707 0.708)"><path class="shrink-all" d="M12.784,10.5,10.5,12.784" transform="translate(12.784 17.677) rotate(180)"/><path class="shrink-all" d="M12.784,12.784H10.5V10.5" transform="translate(12.784 17.677) rotate(180)"/><path class="shrink-all" d="M2.286,0,0,2.286" transform="translate(4.926 -0.001)"/><path class="shrink-all" d="M2.286,2.286H0V0" transform="translate(4.926 -0.001)"/></g></svg>
                Shrink All
            </span>
            <transition-group name="fade">
                <div class="setting-item" v-for="(item, index) in items" :key="`L + ${index}`" :class="{ 'item-expend' : !item.shrink  }">
                    <div class="setting-item-title">
                        <div class="descirbe">
                            <i class="el-icon-arrow-right" @click="item.shrink = !item.shrink"></i>
                            <el-input class="kind-name" v-model="item.class_name" placeholder="請輸入類別名稱" clearable />
                        </div>
                        <div class="toolbox">
                            <i class="el-icon-error" v-if="items.length > 1" @click="deleteSettingItem(index)"></i>
                            <i class="el-icon-circle-plus" @click="addSettingItem(index)"></i>
                        </div>
                    </div>
                    <div class="setting-item-content" v-if="!item.shrink">
                        <div class="content-list">
                            <ul>
                                <li v-for="( oItem, oIndex) in item.attrs" :key="oIndex">
                                    <i class="el-icon-remove" @click="deleteOption(index, oIndex)"></i>
                                    <div class="content-list-item-text">
                                        <el-input v-model="oItem.class_value" placeholder="請輸入選項名稱" clearable /> <span class="separatorBar">|</span>
                                        <el-input v-model="oItem.shortcut_key" placeholder="快速健設定" clearable />
                                    </div>
                                </li>
                            </ul>
                            <div class="add-option-btn" @click="addOption(index)">
                                <i class="el-icon-circle-plus"></i>
                                <span>新增選項</span>
                            </div>
                        </div>
                        <div class="content-style">
                            <div class="inside">
                                <p>圈選樣式</p>
                                <el-select v-model="item.roi_type"
                                            placeholder="請選擇 ...">
                                    <el-option
                                        v-for="(soItem, soIndex) in styleOptions"
                                        :key="soIndex"
                                        :label="soItem.roi_name"
                                        :value="soItem.roi_type">
                                    </el-option>
                                </el-select>
                            </div>
                        </div>
                    </div>
                </div>
            </transition-group>
        </div>
        <div class="save-btn" @click="doSave">儲存</div>
    </div>
</template>

<script>
    import {saveLabelSetting} from '@/api/index.js'

    export default {
        name: "labelSetting.vue",
        data() {
            return {
                items: [
                    { class_name: '', shrink: false, attrs: [], roi_type: 'box' },
                ],
                styleOptions: [ { roi_name: '矩形', roi_type: 'box'} ],
                canSave: true,
            };
        },
        methods: {
            shrinkAll() {
                this.items.forEach(item => { item.shrink = true })
            },
            addOption(index) {
                this.items[index].attrs.push({ class_value: '', shortcut_key: '' })
            },
            deleteOption(index, oIndex) {
                this.items[index].attrs.splice(oIndex, 1)
            },
            addSettingItem(index) {
                const newOne = { class_name: '', shrink: false, attrs: [], roi_type: 'box' }
                this.items.splice(index + 1, 0, newOne)
            },
            deleteSettingItem(index) {
                this.items.splice(index, 1)
            },

            checkData() {
                let errMsg = ''
                let kindList = []
                let shortcutList = []

                try {
                    //  檢查空白 （ 皆必填
                    this.items.forEach((item, index) => {
                        if(item.class_name === '') errMsg = `第 ${index + 1} 個類別： 類別名稱 為必填`
                        else if(item.attrs.length === 0) errMsg = `第 ${index + 1} 個類別： 類別選項 至少須新增一項`
                        else if(item.attrs.length !== 0) {
                            this.items[index].attrs.forEach((oItem, oIndex) => {
                                if(oItem.class_value === "") errMsg = `第 ${index + 1} 個類別： 第 ${oIndex + 1} 個選項的 名稱 為必填`
                                // else if(oItem.shortcut_key === "") errMsg = `第 ${index + 1} 個類別： 第 ${oIndex + 1} 個選項的 快速鍵 為必填`
                                shortcutList.push(oItem.shortcut_key)
                            })
                        }
                        else if(item.roi_type === '') errMsg = `第 ${index + 1} 個類別： 圈選樣式 為必選`
                        kindList.push(item.class_name)
                        if(errMsg !== '') throw new Error(errMsg)
                    })

                    //  shortcutkey改非必填 -> 先把空值去掉
                    shortcutList = shortcutList.filter((i) => { return i !== "" })

                    //  檢查重複 （ 1. 類別 2. 快速鍵
                    const kindList_Deduplication = [...new Set(kindList)]
                    const shortcutList_Deduplication = [...new Set(shortcutList)]
                    if(kindList_Deduplication.length !== kindList.length) errMsg = '類別名稱 不可重複'
                    else if(shortcutList_Deduplication.length !== shortcutList.length) errMsg = '快速鍵 不可重複'
                    if(errMsg !== '') throw new Error(errMsg)

                } catch (e) {
                    this.$message.error(errMsg)
                }

                return errMsg
            },
            formatData() {
                let sendData = []

                this.items.forEach(item => {
                    sendData.push({
                        attrs: item.attrs,
                        class_name: item.class_name,
                        roi_type: item.roi_type,
                    })
                })

                return sendData
            },
            async doSave() {
                const checkResult =  this.checkData()
                console.log('----------->', checkResult);
                const items =  this.formatData()
                console.log('----------->', items);

                if(checkResult === '' && this.canSave) {
                    /*
                        初始 canSave = true  -> 執行存檔
                        把 canSave 變 false -> setTimeOut 2秒後 才變回true
                        ** 避免連點 多次 call api **
                    */
                    this.canSave = !this.canSave
                    setTimeout(() => {
                        this.canSave = !this.canSave
                    }, 2000)

                    let paramObj = {
                        items,
                        project_id: this.$store.state.nowProjectId
                    }
                    console.log(paramObj);
                    let result = await saveLabelSetting(paramObj)
                    if(result) this.$message.success('已儲存 標注設定！')
                }
            },
        },
    }
</script>

<style scoped>
    * {
        box-sizing: border-box;
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }

    .fade-enter, .fade-leave-to {
        opacity: 0;
    }

    .label-setting-container {
        height: 670px;  /* 先寫死qq */
        padding-right: 5px;
        overflow: hidden;
        overflow-y: scroll;
    }

    .shrink-btn {
        position: relative;
        left: calc(100% - 105px);
        display: inline-block;
        padding: 10px 15px;
        margin: 12px 5px 12px 0;
        color:#415A7E;
        cursor: pointer;
        transition: all .3s;
    }

    .shrink-btn svg {
        margin-right: 5px;
    }

    .shrink-btn:hover {
        color:#547FBC;
    }

    .shrink-all {
        fill:none;
        stroke:#415A7E;
        stroke-linecap:round;
        stroke-linejoin:round;
        transition: all .3s;
    }

    .shrink-btn:hover .shrink-all {
        stroke:#547FBC;
    }

    .setting-item {
        min-height: 57px;
        position: relative;
        border: 1px solid #DEE2E6;
        border-radius: 3px;
        margin-bottom: 10px;
        transition: all .3s;
    }

    .setting-item:hover {
        background-color: #EDF3FC;
    }

    .setting-item-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 57px;
    }

    .descirbe {
        flex: 3;
        display: flex;
        align-items: center;
        height: 100%;
    }

    .toolbox {
        flex: 2;
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }

    .el-icon-arrow-right {
        position: relative;
        width: 57px;
        height: 100%;
        cursor: pointer;
        transition: all .3s;
    }

    .el-icon-arrow-right:before {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 13px;
        font-weight: bold;
        color: #233044;
    }

    .item-expend .el-icon-arrow-right {
        transform: rotate(90deg);
    }

    .kind-name >>> .el-input__inner {
        line-height: 24px;
        font-weight: bold;
        color: #233044;
        background-color: transparent;
        border: 1px solid transparent;
    }

    .kind-name >>> .el-input__inner:focus {
        border: 1px solid #DEE2E6;
    }

    .el-icon-error {
        margin-left: 25px;
        margin-right: 10px;
        cursor: pointer;
    }

    .el-icon-error:before {
        color: #D5DAE2;
        font-size: 25px;
        transition: all .3s;
    }

    .el-icon-error:hover::before {
        color: #C9D0D6;
    }

    .el-icon-circle-plus {
        margin-right: 25px;
        cursor: pointer;
    }

    .el-icon-circle-plus::before {
        color: #6EC856;
        font-size: 25px;
        transition: all .3s;
    }

    .el-icon-circle-plus:hover::before, .add-option-btn:hover .el-icon-circle-plus::before  {
        color: #50B136;
    }

    .setting-item-content {
        display: flex;
        flex-direction: row;
    }

    .content-list {
        flex: 3;
        padding: 0 5px 20px 57px;
    }

    .content-list i {
        margin-right: 10px;
    }

    .content-list ul {
        max-width: 100%;
        padding-left: 0;
        list-style: none;
    }

    .content-list ul li {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: 5px;
    }

    .el-icon-remove::before {
        cursor: pointer;
        color: red;
        transition: all .3s;
    }

    .el-icon-remove:hover:before {
        color: #d50404;
    }

    .content-list-item-text {
        display: flex;
        justify-content: space-around;
        align-items: center;
    }

    .content-list-item-text .el-input {
        width: 48%;
    }

    .content-list-item-text .el-input >>> .el-input__inner {
        background-color: transparent;
        border: 1px solid transparent;
        color: #233044;
        transition: all .3s;
    }

    .content-list-item-text .el-input >>> .el-input__inner:focus {
        border: 1px solid #DEE2E6;
    }

    .separatorBar {
        color: #DCDFE6;
        font-weight: bold;
    }

    .add-option-btn {
        cursor: pointer;
    }

    .add-option-btn i {
        display: inline-block;
        margin-right: 10px;
    }

    .add-option-btn i:before {
        font-size: 15px;
    }

    .content-style {
        flex: 2;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        padding: 0 25px 20px;
    }

    .content-style .inside {
        padding: 9px 18px;
        border: 1px solid #DEE2E6;
        border-radius: 3px;
    }

    .content-style .inside .el-select {
        width: 100%;
    }

    .el-select >>> .el-input.is-focus .el-input__inner {
        border-color: #4481FF;
    }

    .save-btn {
        position: absolute;
        right: 20px;
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
</style>
