<template>
    <div>
        <el-button type="text"  @click="pdfFile = true">點擊打開 手術同意書</el-button>
        <el-dialog :visible.sync="pdfFile">
            <create-p-d-f />
        </el-dialog>
        
        <!-- <modify-document/> -->
        <!-- <create-form/>
        <create-document/> -->
    </div>
</template>

<script>
// import modifyDocument from "@/components/pdf/modifyDocument.vue";
// import createDocument from "@/components/pdf/createDocument.vue";
// import createForm from "@/components/pdf/createForm.vue";
import createPDF from "@/components/pdf/createPDF.vue";
    export default {
        name: "advanceSearch",
        components: {
            // modifyDocument,
            // createDocument,
            // createForm,
            createPDF,
        },
        mounted() {
        },
        data() {
            return {
                pdfFile:false,
                fileList: [], //上傳的文件列表
            }
        },
        methods: {
        }
    }
</script>

<style scoped>

</style>
