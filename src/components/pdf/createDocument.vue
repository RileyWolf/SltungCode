<template>
    <div>
        Create Document
        <iframe :src="pdf" style="width: 100%; height: 100%;"></iframe>
    </div>
</template>

<script>
    import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
    export default {
        name: "createDocument",
        mounted() {
            this.createPdf()
        },
        data() {
            return {
                pdf:''
            };
        },
        methods: {
            async createPdf() {
                const pdfDoc = await PDFDocument.create()
                const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)

                const page = pdfDoc.addPage()
                const {height } = page.getSize()
                const fontSize = 30
                page.drawText('Creating PDFs in JavaScript is awesome!', {
                    x: 50,
                    y: height - 4 * fontSize,
                    size: fontSize,
                    font: timesRomanFont,
                    color: rgb(0, 0.53, 0.71),
                })
                const pdfBytes = await pdfDoc.save()
                this.pdf = "data:application/pdf;base64," + btoa(String.fromCharCode.apply(null, pdfBytes))
            }
        }
    }
</script>

<style scoped>

</style>
