<template>
    <div>
        Modify Document
        <!-- <iframe :src="pdf" type="application/pdf" style="width: 100%; height: 100%;"></iframe> -->
        <canvas class="canvas" width="300" height="300" style="border: 1px solid #243146;" @mousemove="Move" @mousedown="Draw" @mouseup="Done"></canvas>
    </div>
</template>

<script>
    // import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib';
    export default {
        // props: ['clientX','clientY'],
        name: "modifyDocument",
        data() {
            return {
                pdf : '',
                canvas:{},
                ctx : {},
                prevX : 0, //滑鼠當下
                prevY : 0,
                currX : 0, //移過去
                currY : 0,
                width: 0,
                height: 0,
                color: "black",
                lineW: 2,
            };
        },
        mounted() {
            // this.modifyPdf(),
            this.init()
        },
        methods: {
            init() {
                //取得所有class為canvas的元素
                this.canvas = document.getElementsByClassName('canvas');
                //渲染環境為2D,判定有無資源<canvas>
                if(this.canvas[0].getContext){
                    this.ctx = this.canvas[0].getContext("2d");
                    this.width = this.canvas[0].width
                    this.height = this.canvas[0].height
                }else{
                    this.$message({
                        message: '警告，版本不資源canvas',
                        type: 'warning'
                    });
                }
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
                 console.log(this.currY , this.prevY)
                this.ctx.stroke();  //畫出圖形的邊框
                this.ctx.closePath();  //閉合路徑好讓新的繪圖指令來設定路徑
            },
            Move(e) {
                // console.log(e)
                // console.log(this.canvas[0].offsetTop)
                // console.log(this.canvas[0].offsetLeft)
                this.currX = this.prevX
                this.currY = this.prevY
                this.prevX = e.clientX - this.canvas[0].offsetLeft
                this.prevY = e.clientY  - this.canvas[0].offsetTop
                if (this.drawing == true) {
                    this.Paint()
                }
            },
            Draw() {
                // console.log("Draw")
                this.drawing = true
                this.Dot()
            },
            Done() {
                // console.log("Done")
                this.drawing = false
            },
            // async modifyPdf() {
            //     const url = 'https://pdf-lib.js.org/assets/with_update_sections.pdf'
            //     // const url = this.pfdFile
            //     // console.log(this.pfdFile)
            //     const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer())
            //     // 從現有的PDF字節加載PDFDocument 
            //     const pdfDoc = await PDFDocument.load(existingPdfBytes)
            //     // 嵌入Helvetica字體
            //     const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
            //     const pages = pdfDoc.getPages()
            //     // 獲取文檔的第一頁
            //     const firstPage = pages[0]
            //     // 獲取第一頁的寬度和高度
            //     const { height } = firstPage.getSize()

            //     // 從現有的PDF字節加載PDFDocument 
            //     firstPage.drawText('This text was added with JavaScript!', {
            //         x : 5,
            //         y : height / 2 + 300,
            //         size : 50,
            //         font : helveticaFont,
            //         color : rgb(0.95, 0.1, 0.1),
            //         rotate : degrees(-45),  //選轉
            //     })
            //     //將PDFDocument序列化為字節
            //     const pdfBytes = await pdfDoc.save()

            //     // let newpdf = "data:application/pdf;base64," + btoa(String.fromCharCode.apply(null, pdfBytes))
            //     this.pdf = "data:application/pdf;base64," + btoa(String.fromCharCode.apply(null, pdfBytes))
            //     // console.log(newpdf)
            //     // document.getElementById("newpdf").src = newpdf
            // }
        }
    }
</script>

<style scoped>
</style>
