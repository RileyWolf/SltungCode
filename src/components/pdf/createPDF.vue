<template>
    <div>
        <div id="content">
            <div class="floor">
                <div class="title">童綜合醫院手術同意書</div>
                <div class="information">
                    <div>
                        病人姓名：<input/>
                    </div>
                    <div>
                        出生日期：<input/>
                    </div>
                    <div>
                        病歷號碼：<input/>
                    </div>
                </div>
                <div class="surgery-information">
                    <div class="information-title">一、擬實施之手術（以中文書寫，必要時醫學名詞得加註外文）</div>
                    <div>
                        1. 疾病名稱：
                        <input/>    
                        <el-divider></el-divider>
                    </div>
                    <div>
                        2. 建議手術名稱：
                        <input/>
                        <el-divider></el-divider>
                    </div>
                    <div>
                        3. 建議手術原因：
                        <input/>
                        <el-divider></el-divider>
                    </div>
                </div>
                <div class="statement">
                    <div class="information-title">二、醫師之聲明</div>
                    <div class="matter"> 
                        1. 我已經儘量以病人所能瞭解之方式，解釋這項手術之相關資訊，特別是下列事項：
                    </div>
                    <div  v-for="(item, index) in list"  :key="index">
                        <div>
                            <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike"/>
                            {{item.word}}
                        </div>
                    </div>
                    <div class="info-detail">
                        <div>2. 我已經給予病人充足時間，詢問下列有關本次手術的問題，並給予答覆：
                            <span class="mustInput"> *</span> 
                            <i :class=" (isview)? 'el-icon-view' : 'el-icon-edit' " @click=" isview=!isview "/>
                        </div>
                        <div class="textarea-div">
                            <textarea class="textarea-format" v-model="projectDescription"></textarea>
                            <div v-html="compiledMarkdown"></div>
                        </div>
                    </div>
                </div>
                <div>
                    <div>手術負責醫師</div>
                    <div>姓名：<input/></div>
                    <canvas class="canvas" width="300" height="150" style="border: 1px solid #243146;" @mousemove="Move" @mousedown="Draw" @mouseup="Done"></canvas>
                    <div>專科別：</div>
                    <div>（※衛生福利部授予之專科醫師證書科別；若無則免填</div>
                    
                    <div>
                        日期：
                            <el-date-picker
                            v-model="time"
                            type="datetime"
                            placeholder="选择日期时间"
                            :picker-options="pickerOptions">
                            </el-date-picker>
                    </div>

                </div>
            </div>
        </div>
        <!-- <button id="btnSave" class="btn btn-danger" onclick="html2canvas()">Download screenshot</button> -->
        <button type="button" onclick="printJS('content', 'html')">
            Print Form
        </button>
        <button @click="printScreen()" > Printing ... </button>
    </div>
</template>
<script>
    import printJS from "print-js";
    import html2pdf from 'html2pdf.js'
    export default {
        name: "createPDF",
        data() { 
            return {
                doc : {},
                canvas : {},    
                ctx : {},
                prevX : 0, //滑鼠當下
                prevY : 0,
                currX : 0, //移過去
                currY : 0,
                width: 0,
                height: 0,
                color: "black",
                lineW: 2,   
                rect:{},
                input:'',
                time:'',
                firstX: 0,
                firstY: 0,
                list:[
                    { id:1 , word:'需實施手術之原因、手術步驟與範圍、手術之風險及成功率、輸血之可能性'},
                    { id:2 , word:'手術併發症及可能處理方式'},
                    { id:3 , word:'不實施手術可能之後果及其他可替代之治療方式'},
                    { id:4 , word:'預期手術後，可能出現之暫時或永久症狀'},
                    { id:5 , word:'其他與手術相關說明資料，已交付病人'},
                ],
                inquiryList:[
                    { id:1 , word:''},
                    { id:2 , word:''},
                    { id:3 , word:''},
                ],
                pickerOptions: {
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                        picker.$emit('pick', new Date());
                        }
                    }, {
                        text: '昨天',
                        onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24);
                        picker.$emit('pick', date);
                        }
                    }, {
                        text: '一周前',
                        onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', date);
                        }
                    }]
                },
            };
        },
        mounted() {
            this.init()
            let selt = this
            document.addEventListener('scroll', function(){
                selt.init()
            }, true)
        },
        methods: {
            async printScreen()
            {
                var element = document.getElementById('content');
                html2pdf().from(element).save();
            },
            printJS(){
                var image = this.canvas[0].toDataURL("image/png");
                this.doc.addImage(image, 'JPEG', 0, 0, this.width, this.height);
                console.log(123)
                this.doc.save('test.pdf');
                printJS('content', 'html')
            },
            init() {
                //取得所有class為canvas的元素
                this.canvas = document.getElementsByClassName('canvas');
                //渲染環境為2D,判定有無資源<canvas>
                // if(this.canvas[0]){
                this.ctx = this.canvas[0].getContext("2d");
                //返回元素的大小及其相對的位置
                this.rect = this.canvas[0].getBoundingClientRect()
                console.log(this.rect)
                this.width = this.canvas[0].width
                this.height = this.canvas[0].height
                // }else{
                //     this.$message({
                //         message: '警告，版本不資源canvas',
                //         type: 'warning'
                //     });
                // }
            },
            Dot() {
                this.ctx.beginPath();
                this.ctx.fillStyle = this.color;
                // this.ctx.fillRect(this.prevX, this.prevY, this.lineW, this.lineW);
                this.ctx.closePath();
            },
            Paint() {
                // console.log("Paint")
                this.ctx.beginPath();  //產生一個新路徑，產生後再使用繪圖指令來設定路徑
                this.ctx.moveTo(this.currX, this.currY); //起點
                this.ctx.lineTo(this.prevX, this.prevY); //終點
                this.ctx.strokeStyle = this.color; //顏色
                this.ctx.lineWidth = this.lineW; //線條粗細
                this.ctx.stroke();  //畫出圖形的邊框
                this.ctx.closePath();  //閉合路徑好讓新的繪圖指令來設定路徑
            },
            //移動
            Move(e) {
                this.currX = this.prevX
                this.currY = this.prevY
                this.prevX = e.clientX - this.rect.left
                this.prevY = e.clientY - this.rect.top
                if (this.drawing == true) {
                    this.Paint()
                }
            },
            //點下
            Draw(e) {
                // console.log("Draw")
                // this.drawing = true
                this.drawing = false
                this.currX = this.prevX
                this.currY = this.prevY
                this.prevX = e.clientX - this.rect.left
                this.prevY = e.clientY - this.rect.top
                this.firstX = this.prevX
                this.firstY = this.prevY
                this.Dot()
            },
            //離開
            Done() {
                // console.log("Done")
                
                this.drawing = false
                this.ctx.beginPath();
                this.ctx.fillStyle = this.color;
                this.ctx.fillRect(this.firstX, this.firstY, (this.prevX-this.firstX), (this.prevY-this.firstY));
                this.ctx.closePath();
            },

        }
    }
</script>

<style scoped>
    #content{
        border: 1px solid #243146;
    }
    .floor{
        position:relative;
        padding:10px 20px;
    }
    .title{
        font-size: 20px;
        margin-left: 30%;
    }
    .information{
        border: 1px solid #243146;
        padding:5px;
        margin-top: 10px;
        display: flex;
    }
    .information input{
        border:none;
        width: 100px;
    }
    .information div{
        margin-right: 5px;
        float: left;
    }
    .surgery-information input{
        border:none;
        width: 100%;
        color: #4481FF;
    }
    .surgery-information div{
        margin: 5px auto;
    }
    .information-title{
        font-size: 16px;
    }
    .statement .matter{
        margin: 7px auto;
    }
    .info-detail {
        margin-top: 19px;
    }
    .mustInput {
        color: red;
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
</style>
