<template>
    <div>
        <el-radio-group v-model="radio">
            <el-radio :label="0">我是滑鼠</el-radio>
            <el-radio :label="1" :disabled="disabled">標註框
                <el-select v-model="value" clearable  placeholder="請選擇" v-show="radio==1">
                    <el-option v-for="item in nademoList" :key="item.id" :label="item.label" :value="item.label"></el-option>
                </el-select>
            </el-radio>
            <el-radio :label="2">勾選框</el-radio>
            <el-radio :label="3">測試div</el-radio>
        </el-radio-group>
        <br>
        <el-button @click="forMeSeeSee()">看狀況</el-button>
        <!-- <div id="drawbox-div">
            <div id="drawbox" draggable="true">
                <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike"/>
            </div>
        </div> -->
        <!-- <div id="container" @mousemove="Move">放置目標</div> -->
        <div class="tools">
            <bk-button :theme="'default'" type="submit" :title="'基礎按鈕'" @click.stop="prePage" class="mr10"> 上一頁</bk-button>
            <bk-button :theme="'default'" type="submit" :title="'基礎按鈕'" @click.stop="nextPage" class="mr10"> 下一頁</bk-button>
            <div class="page">{{pageNum}}/{{pageTotalNum}} </div>
            <bk-button :theme="'default'" type="submit" :title="'基礎按鈕'" @click.stop="clock" class="mr10"> 順時針</bk-button>
            <bk-button :theme="'default'" type="submit" :title="'基礎按鈕'" @click.stop="counterClock" class="mr10"> 逆時針</bk-button>
            <bk-button :theme="'default'" type="submit" :title="'基礎按鈕'" @click.stop="pdfPrint" class="mr10"> 列印</bk-button>
        </div>
        <!-- 
            page 當前顯示的頁數
            rotate 旋轉角度
            progress  當前頁面的加載進度
            page-loaded 頁面加載成功的回調函數
            num-pages 總頁數
            error 加載錯誤的回調
            link-clicked 單機pdf內的鏈接會觸發
         -->
        <div id='container' >
            <canvas id='canvas' width="1920" height="1080"  style="position: absolute;border: 1px solid #243146;z-index:2" @mousemove="Move" @mousedown="Draw" @mouseup="Done">
            </canvas>
            <pdf 
            id='pdf'
            :src="url" 
            :page="pageNum"
            :rotate="pageRotate"  
            @progress="loadedRatio = $event"
            @page-loaded="pageLoaded($event)" 
            @num-pages="pageTotalNum=$event" 
            @error="pdfError($event)" 
            @link-clicked="page = $event"
            style="display: inline-block; width: 80%">
            </pdf>
            <!-- <input id="new" style="width:100px; height:200px; left:0px; top:0px; position: absolute;z-index:2;"/> -->
        </div>
    </div>
</template>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.7.570/pdf.min.js"></script>
<script>
    import pdf from 'vue-pdf';
    import html2pdf from 'html2pdf.js'
    export default {
        name: "settingAccount",
        data() { 
            return {
                url: "/pdf/F1427-介入性動態腎泌尿功能測定說明書.pdf",
                pageNum: 1,
                pageTotalNum: 1,
                pageRotate: 0,
                loadedRatio: 0,
                curPageNum: 0,
                rect: {},
                radio: 0,
                value:'',
                disabled:false,
                containerbox: {},
                firstX: 0,
                firstY: 0,
                currX: 0, //開始x
                currY: 0, //開始y
                prevX: 0, //結束x
                prevY: 0, //結束y
                width:0,
                height:0,
                ctx:{},
                color: "black",
                drawbox:{},
                opt : {
                    // margin: 1, //PDF邊距
                    filename: 'myfile.pdf', //導出的PDF的默認文件名
                    image: { type: 'jpeg', quality: 1 }, //生成PDF的圖像類型和質量
                    html2canvas: { scale: 2 }, //配置選項直接發送到html2canvas
                    jsPDF: { unit: 'in', format: 'a4' } //配置選項直接發送到jsPDF
                },
                container : '',
                getcontainer : '',
                save:'',
                targetMarkArray: [],
                targetMarkIndex: -1,
                nademoList: [
                    { id:0, label:'id', disabled: false },
                    { id:1, label:'name', disabled: false },
                    { id:2, label:'病歷號', disabled: false }
                ]
            }
        },
        components: {
            pdf
        },
        mounted() {
            // this.dragover() //拖離監聽
            // this.dragstart() //拖進監聽
            this.init() //確認位置
            this.getNumPages()
        },
        methods: {
            forMeSeeSee(){
                console.log(this.targetMarkArray)
            },
            dragstart(){
                this.container = document.querySelector('#container');
                this.container.addEventListener('drop', this.dropped);
                this.container.addEventListener('dragenter', this.cancelDefault);
                this.container.addEventListener('dragover', this.cancelDefault);
            },
            init() {
                //初始化
                this.containerbox = document.getElementById('canvas');
                console.log(this.containerbox)
                this.ctx = this.containerbox.getContext("2d");
                this.rect = this.containerbox.getBoundingClientRect()
                this.width = this.containerbox.width
                this.height = this.containerbox.height
            },
            canvasOnDraw(){
                //繪製中
                const getArray = this.targetMarkArray[this.targetMarkIndex]
                const FinalPointListNow = this.findWhichIsFirstPoint( 
                    getArray.x1 ,
                    getArray.y1 , 
                    getArray.x2 , 
                    getArray.y2 
                );
                getArray.tmpX1 = FinalPointListNow[0];
                getArray.tmpY1 = FinalPointListNow[1];
                getArray.tmpX2 = FinalPointListNow[2];
                getArray.tmpY2 = FinalPointListNow[3];

                getArray.wid = getArray.tmpX2 - getArray.tmpX1
                getArray.hei = getArray.tmpY2 - getArray.tmpY1

                // this.ctx.fillStyle = '#FF6600';
                // this.ctx.fillText( "ㄜ...總之放個提示字" , tmpX1, tmpY1 - 6 );

                this.canvasClearColor( 0 , 0 , 1920 , 1080 )
                this.canvasBorderColor( '#FF6600' , getArray.tmpX1 , getArray.tmpY1 , getArray.wid , getArray.hei );
                this.canvasInnerColor( 'rgba(255, 0, 0, 0.3)' , getArray.tmpX1 , getArray.tmpY1 , getArray.wid , getArray.hei );
            },
            findWhichIsFirstPoint( x1 , y1 , x2 , y2 ){
                //頂角變換
                if( x1 <= x2 ){
                    if( y1 <= y2 ){
                        return [ x1 , y1 , x2 , y2 ]
                    }else{
                        return [ x1 , y2 , x2  ,y1 ]
                    }
                }else{
                    if( y1 <= y2 ){
                        return [ x2 , y1 , x1 , y2 ]
                    }else{
                        return [ x2 , y2 , x1  ,y1 ]
                    }
                }

            },
            canvasInnerColor( color , x , y , w , h ) {
                //框選內顏色
                this.ctx.fillStyle = color; //填充顏色
                this.ctx.fillRect( x , y , w , h );
            },
            canvasBorderColor( color , x , y , w , h)  {
                //框選外邊顏色
                this.ctx.strokeStyle = color; //筆觸顏色
                this.ctx.strokeRect( x , y , w , h );
            },
            canvasClearColor( x , y , w , h)  {
                //清除顏色
                this.ctx.clearRect( x , y , w , h );
            },
            Draw(e) {
                //按下
                if(this.radio != 0){
                    this.drawing = true;
                    if(this.radio == 1 ){
                        if(this.value == 0){
                            this.$message({
                            message: '請選擇一項標籤',
                            type: 'warning'
                            });
                            this.drawing = false;
                        }else{
                            label = 'input-' + this.value
                            this.nademoList = this.nademoList.filter( item => item.label !== this.value )
                        }
                    }else if(this.radio == 2){
                        label = 'checkbox'
                    }
                    else if(this.radio == 3){
                        label = 'trydiv'
                    }
                    if(this.drawing == true){
                        var label
                        var data = {
                            x1 : e.layerX,
                            y1 : e.layerY,
                            x2 : 0,
                            y2 : 0,
                            sort : label,
                            //--- 整理過後
                            tmpX1 : 0,
                            tmpY1 : 0,
                            tmpX2 : 0,
                            tmpY2 : 0,
                            wid : 0,
                            hei : 0,
                        }
                        this.targetMarkIndex = this.targetMarkIndex + 1;
                        this.targetMarkArray.push(data)
                        console.log(this.targetMarkArray[this.targetMarkIndex])
                    }
                }
            },
            Move(e){
                if( this.radio != 0 && this.drawing == true){
                    this.currentX = e.layerX;
                    this.currentY = e.layerY;
                    
                    this.targetMarkArray[this.targetMarkIndex].x2 = this.currentX;
                    this.targetMarkArray[this.targetMarkIndex].y2 = this.currentY;
                    
                    // 执行渲染操作
                    try {
                        this.canvasOnDraw();
                    } catch (err) {
                        console.log(err);
                    }
                }
            },
            Done() {
                if(this.radio != 0){
                    if(this.drawing == true){
                        if(this.radio == 1){
                            this.getcontainer = document.getElementById('container');
                            var input = document.createElement("input");
                            input.setAttribute("v-model", this.value)
                            input.setAttribute(
                                "style",
                                this.style()
                            );
                            input.setAttribute("placeholder", this.value)
                            this.getcontainer.append(input)
                            this.value = ''
                            console.log(this.nademoList)
                            if(this.nademoList.length == 0){
                                this.disabled = true
                                this.radio = 0
                            }
                        }
                        else if(this.radio == 2){
                            this.getcontainer = document.getElementById('container');
                            var checkbox = document.createElement("input");
                            checkbox.setAttribute("type", "checkbox");
                            checkbox.setAttribute(
                                "style",
                                this.style()
                            );
                            this.getcontainer.append(checkbox)
                        }
                        // else if(this.radio == 3){
                        //     this.getcontainer = document.getElementById('container');
                        //     var p = document.createElement("p");
                        //     p.setAttribute(
                        //         "style",
                        //         this.style()
                        //         + "background-color: red; "
                        //     );
                        //     this.getcontainer.append(p)
                        // }
                    }
                    this.drawing = false
                }
            },
            style(){
                return "width:" + this.targetMarkArray[this.targetMarkIndex].wid+
                        "px; height:" + this.targetMarkArray[this.targetMarkIndex].hei +
                        "px; top:" + this.targetMarkArray[this.targetMarkIndex].tmpY1 +
                        "px; left:" + this.targetMarkArray[this.targetMarkIndex].tmpX1 + 
                        "px; position:absolute; z-index:2; "
            },
            dragover(){
                this.drawbox = document.querySelector('#drawbox');
                this.drawbox.addEventListener('dragstart', this.dragStart);
            },
            dropped(e) {
                this.cancelDefault(e)
                let id = e.dataTransfer.getData('text/plain');
                e.target.appendChild(document.querySelector(`#${id}`));
                // this.drawbox.style = '"margin-top=' + this.prevY + ' margin-left="' + this.prevX + '"'
                // this.drawbox.style = "margin-top:" + this.prevY + "px; margin-left:" + this.prevX +"px;"
                // console.log(this.prevY + '  ' + this.prevX)
                // console.log(this.drawbox)
            },
            cancelDefault(e) {
                e.preventDefault();
                e.stopPropagation();
                return false
            },
            dragStart(e) {
                e.dataTransfer.setData('text/plain', e.target.id)
                console.log(e)
            },
            getNumPages() {
                var loadingTask = pdf.createLoadingTask(this.url)
                this.pageRotate -= 90
                this.pageRotate += 90
                loadingTask.promise.then(pdf => {
                    this.url = loadingTask
                    this.numPages = pdf.numPages
                }).catch((err) => {
                    console.log(err)
                    console.error('pdf加載失敗')
                })
            },
            // 上一頁函數，
            prePage() {
                var page = this.pageNum
                page = page > 1 ? page - 1 : this.pageTotalNum
                this.pageNum = page
            },
            // 下一頁函數
            nextPage() {
                var page = this.pageNum
                page = page < this.pageTotalNum ? page + 1 : 1
                this.pageNum = page
            },
            // 頁面逆時針翻轉90度。
            counterClock() {
                this.pageRotate -= 90
            },
            clock(){
                this.pageRotate += 90
            },
            // 頁面加載回調函數，其中e為當前頁數
            pageLoaded(e) {
                this.curPageNum = e
            },
            // 其他的一些回調函數。
            pdfError(error) {
                console.error(error)
            },
            pdfPrint() {
                var element = document.getElementById('container');
                html2pdf().from(element).set(this.opt).save();
                // document.body.innerHTML=document.getElementById('container').innerHTML; 
                // window.print(); 
            },
            
        }
    }
</script>

<style scoped>
    #container{
        position: relative;
    }
    #drawbox{
        position: absolute;
    }
    #pdf{
        position: absolute;
    }
    /* #drawbox-div{
        position: relative;
    } */
</style>
