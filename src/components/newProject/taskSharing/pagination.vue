<template>
     <div class="page flex-row"  style="justify-content: flex-end;">
        <span>{{ nowPagination.nowRange }} of {{ nowPagination.total }}</span>
        <i class="el-icon-arrow-left" @click="prePage()" :class="{ disabled : nowPagination.nowPage === 1 }"></i>
        <i class="el-icon-arrow-right" @click="nextPage()" :class="{ disabled : nowPagination.nowPage === nowPagination.total }"></i>
    </div>
</template>

<script>
export default {
    name: 'pagination',
    props: {
        nowPagination: Object
    },
    data() {
        return {

        };
    },
    methods: {
        //  上一頁
        prePage() {
            if(this.nowPagination.nowPage !== 1) {
                this.nowPagination.nowPage -= 1
                this.nowPagination.nowRange = `${ (this.nowPagination.nowPage - 1) * 10 + 1 } - ${ (this.nowPagination.nowPage - 1) * 10 + 10 }`
                //  emit 更新後的頁數
                this.updatePage(this.nowPagination.nowPage)
            }
        },
        //  下一頁
        nextPage() {
            if(this.nowPagination.nowPage !== this.nowPagination.total) {
                this.nowPagination.nowPage += 1
                this.nowPagination.nowRange = `${ (this.nowPagination.nowPage - 1) * 10 + 1 } - ${ (this.nowPagination.nowPage - 1) * 10 + 10 }`
                //  emit 更新後的頁數
                this.updatePage(this.nowPagination.nowPage)
            }
        },
        updatePage(val) {
            this.$emit('updatePage', val)
        }
    },
}
</script>

<style scoped>
    .flex-row {
        display: flex;
        align-items: center;
    }

    .page span {
        display: block;
        margin-right: 40px;
        color: #233044;
    }

    .page i {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 30px;
        height: 30px;
        font-weight: bold;
        cursor: pointer;
        color: #233044;
    }

    .page i.disabled {
        cursor: not-allowed;
        color: #DEE2E6;
    }
</style>