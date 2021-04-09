<template>
    <div>
        createForm
        <iframe :src="pdf" style="width: 550px; height: 750px;"></iframe>
    </div>
</template>

<script>
    import { PDFDocument } from 'pdf-lib'
    export default {
        name: "createForm",
        mounted() {
            this.createForm()
        },
        data() { 
            return {
                pdf:'',
                page:{}
            };
        },
        methods: {
            async createForm() {
                //創建一個新的PDFDocument
                const pdfDoc = await PDFDocument.create()
                //將空白頁添加到文檔
                this.page = pdfDoc.addPage([550, 750])
                //?
                const form = pdfDoc.getForm()

                //似乎不支援中文不支援全型
                this.page.drawText("Tungs' Taichung MetroHarbor Hospital Consent", { x: 50, y: 700, size: 20 })

                //createTextField - 建立新欄位衍生類別
                const InformationField = form.createTextField('Basic Information')
                this.page.drawText("Basic Information", { x: 50, y: 670, size: 18 })
                this.page.drawText("Patient’s name : ", { x: 50, y: 650, size: 16 })
                InformationField.setText('Please enter the name')
                // x位置 y位置 size大小 height文字框高度 borderWidth邊框寬度
                InformationField.addToPage(this.page, { x: 170, y: 647 , height:16 , borderWidth:0})

                this.page.drawText('Select your favorite rocket:', { x: 50, y: 600, size: 20 })

                this.page.drawText('Falcon Heavy', { x: 120, y: 560, size: 18 })
                this.page.drawText('Saturn IV', { x: 120, y: 500, size: 18 })
                this.page.drawText('Delta IV Heavy', { x: 340, y: 560, size: 18 })
                this.page.drawText('Space Launch System', { x: 340, y: 500, size: 18 })

                //addOptionToPage - 單選按鈕的集合
                const rocketField = form.createRadioGroup('favorite.rocket')
                rocketField.addOptionToPage('Falcon Heavy', this.page, { x: 55, y: 540 })
                rocketField.addOptionToPage('Saturn IV', this.page, { x: 55, y: 480 })
                rocketField.addOptionToPage('Delta IV Heavy', this.page, { x: 275, y: 540 })
                rocketField.addOptionToPage('Space Launch System', this.page, { x: 275, y: 480 })
                rocketField.select('Saturn IV')

                this.page.drawText('Select your favorite gundams:', { x: 50, y: 440, size: 20 })

                this.page.drawText('Exia', { x: 120, y: 400, size: 18 })
                this.page.drawText('Kyrios', { x: 120, y: 340, size: 18 })
                this.page.drawText('Virtue', { x: 340, y: 400, size: 18 })
                this.page.drawText('Dynames', { x: 340, y: 340, size: 18 })

                const exiaField = form.createCheckBox('gundam.exia')
                const kyriosField = form.createCheckBox('gundam.kyrios')
                const virtueField = form.createCheckBox('gundam.virtue')
                const dynamesField = form.createCheckBox('gundam.dynames')

                exiaField.addToPage(this.page, { x: 55, y: 380 })
                kyriosField.addToPage(this.page, { x: 55, y: 320 })
                virtueField.addToPage(this.page, { x: 275, y: 380 })
                dynamesField.addToPage(this.page, { x: 275, y: 320 })

                exiaField.check()
                dynamesField.check()

                this.page.drawText('Select your favorite planet*:', { x: 50, y: 280, size: 20 })

                const planetsField = form.createDropdown('favorite.planet')
                planetsField.addOptions(['Venus', 'Earth', 'Mars', 'Pluto'])
                planetsField.select('Pluto')
                planetsField.addToPage(this.page, { x: 55, y: 220 })

                this.page.drawText('Select your favorite person:', { x: 50, y: 180, size: 18 })

                const personField = form.createOptionList('favorite.person')
                personField.addOptions([
                    'Julius Caesar',
                    'Ada Lovelace',
                    'Cleopatra',
                    'Aaron Burr',
                    'Mark Antony',
                ])
                personField.select('Ada Lovelace')
                personField.addToPage(this.page, { x: 55, y: 70 })

                this.page.drawText(`* Pluto should be a planet too!`, { x: 15, y: 15, size: 15 })
                const pdfBytes = await pdfDoc.save()
                this.pdf = "data:application/pdf;base64," + btoa(String.fromCharCode.apply(null, pdfBytes))
            }
        }
    }
</script>

<style scoped>

</style>
