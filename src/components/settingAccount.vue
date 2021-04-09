<template>
    <div>
        <el-switch
        v-model="label"
        active-text="輸入框">
        </el-switch>
        <div id="drawbox-div">
            <div id="drawbox" draggable="true">
                <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike"/>
            </div>
        </div>
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
                rect:{},
                label:false,
                containerbox:{},
                firstX: 0,
                firstY: 0,
                currX: 0, //開始x
                currY: 0, //開始y
                prevX: 0, //結束x
                prevY: 0, //結束y
                endX: 0,
                endY:0,
                width:0,
                height:0,
                lineW: 2,
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
                save:'',
                targetMarkArray:[],
                targetMarkIndex: -1,
            }
        },
        components: {
            pdf
        },
        mounted() {
            this.dragover() //拖離監聽
            this.dragstart() //拖進監聽
            this.init() //確認位置
            this.getNumPages()
        },
        watch: {
        },
        methods: {
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

                const FinalPointListNow = this.findWhichIsFirstPoint( 
                    this.targetMarkArray[this.targetMarkIndex].x1 ,
                    this.targetMarkArray[this.targetMarkIndex].y1 , 
                    this.targetMarkArray[this.targetMarkIndex].x2 , 
                    this.targetMarkArray[this.targetMarkIndex].y2 
                );
                const tmpX1 = FinalPointListNow[0];
                const tmpY1 = FinalPointListNow[1];
                const tmpX2 = FinalPointListNow[2];
                const tmpY2 = FinalPointListNow[3];

                this.ctx.fillStyle = '#FF6600';
                this.ctx.fillText( "ㄜ...總之放個提示字" , tmpX1, tmpY1 - 6 );

                this.canvasClearColor(tmpX1 , tmpY1 , tmpX2 - tmpX1 , tmpY2 - tmpY1)

                if( this.label == true ){
                    this.canvasBorderColor( '#FF6600' , tmpX1 , tmpY1 , tmpX2 - tmpX1 , tmpY2 - tmpY1 );
                    this.canvasInnerColor( 'rgba(255, 0, 0, 0.3)' , tmpX1 , tmpY1 , tmpX2 - tmpX1 , tmpY2 - tmpY1 );
                }
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
                this.drawing = true;
                if(this.label == true){
                    console.log(e.layerX , e.layerY)
                    var data = {
                        x1 : e.layerX,
                        y1 : e.layerY,
                        x2 : 0,
                        y2 : 0,
                        wid : 0,
                        hei : 0,
                    }
                    this.targetMarkIndex = this.targetMarkIndex + 1;
                    this.targetMarkArray.push(data)
                }
            },
            Move(e){
                if( this.label == true && this.drawing == true){

                    this.currentX = e.layerX;
                    this.currentY = e.layerY;
                    
                    this.targetMarkArray[this.targetMarkIndex].x2 = this.currentX;
                    this.targetMarkArray[this.targetMarkIndex].y2 = this.currentY;
                    this.targetMarkArray[this.targetMarkIndex].wid = this.currentX - this.targetMarkArray[this.targetMarkIndex].x1; // 宽度值
                    this.targetMarkArray[this.targetMarkIndex].hei = this.currentY - this.targetMarkArray[this.targetMarkIndex].y1; // 高度
                    
                    // 执行渲染操作
                    try {
                        this.canvasOnDraw();
                    } catch (err) {
                        console.log(err);
                    }
                }
            },
            Done(e) {
                if(this.label == true){
                    console.log('Done')
                    this.endX = e.clientX - this.rect.left
                    this.endY = e.clientY - this.rect.top
                    this.drawing = false
                    // this.ctx.beginPath();
                    // this.ctx.fillStyle = this.color;
                    // this.ctx.strokeRect(this.firstX, this.firstY, (this.endX-this.firstX), (this.endY-this.firstY));
                    // this.ctx.closePath();
                }
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
