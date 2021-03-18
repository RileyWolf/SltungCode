<template>
    <div>
        <div v-for=" (item, index) in tag" :key="index">
            <div class="condition-div" @click="selectTag(item.tagname)">
                <div :class=" returnCondition( item.tagname )">
                    <div class="name"> {{ item.tagname }} </div>
                    <div class="amount"> {{item.tagamount}} </div>
                </div>
            </div>
        </div >
        <div class="detail-div">
            <el-table :data="databox" style="width: 100%" :default-sort = "{prop: 'date', order: 'descending'}">
                <el-table-column prop="releaseDate" label="Release date" sortable width="199">
                </el-table-column>
                <el-table-column prop="taskNumber" label="任務序號" sortable width="193">
                </el-table-column>
                <el-table-column prop="checkNumber" label="檢查序號" sortable width="193">
                </el-table-column>
                <el-table-column prop="annotator" label="標註人員" sortable width="193">
                </el-table-column>
                <el-table-column prop="status" label="狀態" >
                    <template slot-scope="scope" >
                        <div :class=" returnCondition(scope.row.status) " style="width: 70px;">
                            <div class="name"> {{scope.row.status}} </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="completionDate" label="標註完成" sortable v-if="showtable">
                </el-table-column>
                <el-table-column prop="completionStaff" label="確認人員" sortable v-if="showtable">
                </el-table-column>
                <el-table-column prop="qualityControlDate" label="品管日期" sortable v-if="showtable">
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination-div">
            <div class="pagination">
                {{ firstNo }}-{{ endNo }} of {{ pageNO }}
            </div>
            <div :class=" firstNo <= 1 ? 'new-icon-left-div' : 'icon-left-div'" @click="previous()">
                <i class="el-icon-arrow-left icon-div"></i>
            </div>
            <div :class=" endNo == dataLength ? 'new-icon-right-div' : 'icon-right-div'" @click="next()">
                <i class="el-icon-arrow-right icon-div"></i>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props:['taskList'],
        name: "labelProject",
        components: {
        },
        data() {
            return {
                firstNo:1, //初始
                endNo:12, //結束
                page:12, //每幾資料換頁
                pageNO:1, //目前頁數
                tag: [],
                showtable:false,
                dataLength:0,
                databox:[],
                allDatabox:[],
                selecttag:'',
                selectData:[],
                detailData:[ //使用者看到標註畫面
                   {id:'1',releaseDate:'2021/01/10',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅1',status:'待標註'},
                   {id:'2',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅2',status:'已標註'},
                   {id:'3',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅3',status:'待標註'},
                   {id:'4',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅4',status:'待標註'},
                   {id:'5',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅5',status:'待標註'},
                   {id:'6',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅6',status:'待標註'},
                   {id:'7',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅7',status:'待標註'},
                   {id:'8',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅8',status:'待標註'},
                   {id:'9',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅9',status:'已標註'},
                   {id:'10',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅10',status:'已標註'},
                   {id:'11',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅11',status:'已標註'},
                   {id:'12',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅12',status:'已標註'},
                   {id:'13',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅13',status:'已標註'},
                   {id:'14',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅14',status:'已標註'},
                   {id:'15',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅15',status:'已標註'},
                   {id:'16',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅16',status:'已標註'},
                   {id:'17',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅17',status:'已標註'},
                   {id:'18',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅18',status:'已標註'},
                   {id:'19',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅19',status:'已標註'},
                   {id:'20',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅20',status:'已標註'},
                   {id:'21',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅21',status:'已標註'},
                   {id:'22',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅22',status:'已標註'},
                   {id:'23',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅23',status:'已標註'},
                   {id:'24',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅24',status:'已標註'},
                   {id:'25',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅25',status:'已標註'},
                   {id:'26',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅26',status:'已標註'},
               ],
               alldetailData:[ //全部標註資料
                   {id:'1',releaseDate:'2021/01/10',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅1',status:'待標註'},
                   {id:'2',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅2',status:'已標註'},
                   {id:'3',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅3',status:'待標註'},
                   {id:'4',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅4',status:'待標註'},
                   {id:'5',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅5',status:'待標註'},
                   {id:'6',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅6',status:'已標註'},
                   {id:'7',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅7',status:'待標註'},
                   {id:'8',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅8',status:'待標註'},
                   {id:'9',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅9',status:'待標註'},
                   {id:'10',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅10',status:'已標註'},
                   {id:'11',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅11',status:'已標註'},
                   {id:'12',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅12',status:'已標註'},
                   {id:'13',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅13',status:'已標註'},
                   {id:'14',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅14',status:'已標註'},
                   {id:'15',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅15',status:'待標註'},
                   {id:'16',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅16',status:'已標註'},
                   {id:'17',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅17',status:'已標註'},
                   {id:'18',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅18',status:'已標註'},
                   {id:'19',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅19',status:'已標註'},
                   {id:'20',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅20',status:'待標註'},
                   {id:'21',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅21',status:'已標註'},
                   {id:'22',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅22',status:'待標註'},
                   {id:'23',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅23',status:'待標註'},
                   {id:'24',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅24',status:'已標註'},
                   {id:'25',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅25',status:'已標註'},
                   {id:'26',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅26',status:'已標註'},
               ],
               confirmedData:[ //使用者看到確認畫面
                   {id:'1',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅1',status:'待確認',completionDate:'2021/02/15',completionStaff:'李雙雙',qualityControlDate:'2021/02/15'},
                    {id:'2',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅2',status:'已確認',completionDate:'2021/02/15',completionStaff:'李雙雙',qualityControlDate:'2021/02/15'},
                    {id:'3',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅3',status:'已確認',completionDate:'2021/02/15',completionStaff:'李雙雙',qualityControlDate:'2021/02/15'},
                    {id:'4',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅4',status:'已確認',completionDate:'2021/02/15',completionStaff:'李雙雙',qualityControlDate:'2021/02/15'},
                    {id:'5',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅5',status:'已確認',completionDate:'2021/02/15',completionStaff:'李雙雙',qualityControlDate:'2021/02/15'},
                    {id:'6',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅6',status:'已確認',completionDate:'2021/02/15',completionStaff:'李雙雙',qualityControlDate:'2021/02/15'},
                    {id:'7',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅7',status:'已確認',completionDate:'2021/02/15',completionStaff:'李雙雙',qualityControlDate:'2021/02/15'},
                    {id:'8',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅8',status:'已確認',completionDate:'2021/02/15',completionStaff:'李雙雙',qualityControlDate:'2021/02/15'},
                    {id:'9',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅9',status:'已確認',completionDate:'2021/02/15',completionStaff:'李雙雙',qualityControlDate:'2021/02/15'},
                    {id:'10',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅10',status:'已確認',completionDate:'2021/02/15',completionStaff:'李雙雙',qualityControlDate:'2021/02/15'},
                    {id:'11',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅11',status:'已確認',completionDate:'2021/02/15',completionStaff:'李雙雙',qualityControlDate:'2021/02/15'},
                    {id:'12',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅12',status:'已確認',completionDate:'2021/02/15',completionStaff:'李雙雙',qualityControlDate:'2021/02/15'},
                    {id:'13',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅13',status:'已確認',completionDate:'2021/02/15',completionStaff:'李雙雙',qualityControlDate:'2021/02/15'},
                    {id:'14',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅14',status:'已確認',completionDate:'2021/02/15',completionStaff:'李雙雙',qualityControlDate:'2021/02/15'},
                    {id:'15',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅15',status:'已確認',completionDate:'2021/02/15',completionStaff:'李雙雙',qualityControlDate:'2021/02/15'},
                    {id:'16',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅16',status:'已確認',completionDate:'2021/02/15',completionStaff:'李雙雙',qualityControlDate:'2021/02/15'},
                    {id:'17',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅17',status:'已確認',completionDate:'2021/02/15',completionStaff:'李雙雙',qualityControlDate:'2021/02/15'},
                    {id:'18',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅18',status:'已確認',completionDate:'2021/02/15',completionStaff:'李雙雙',qualityControlDate:'2021/02/15'},
               ],
               allconfirmedData:[ //全部確認畫面
                    {id:'1',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅1',status:'待確認',completionDate:'2021/02/15',completionStaff:'李雙雙',qualityControlDate:'2021/02/15'},
                    {id:'2',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅2',status:'已確認',completionDate:'2021/02/15',completionStaff:'李雙雙',qualityControlDate:'2021/02/15'},
                    {id:'3',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅3',status:'已確認',completionDate:'2021/02/15',completionStaff:'李雙雙',qualityControlDate:'2021/02/15'},
                    {id:'4',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅4',status:'已確認',completionDate:'2021/02/15',completionStaff:'李雙雙',qualityControlDate:'2021/02/15'},
                    {id:'5',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅5',status:'已確認',completionDate:'2021/02/15',completionStaff:'李雙雙',qualityControlDate:'2021/02/15'},
                    {id:'6',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅6',status:'已確認',completionDate:'2021/02/15',completionStaff:'李雙雙',qualityControlDate:'2021/02/15'},
                    {id:'7',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅7',status:'已確認',completionDate:'2021/02/15',completionStaff:'李雙雙',qualityControlDate:'2021/02/15'},
                    {id:'8',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅8',status:'已確認',completionDate:'2021/02/15',completionStaff:'李雙雙',qualityControlDate:'2021/02/15'},
                    {id:'9',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅9',status:'已確認',completionDate:'2021/02/15',completionStaff:'李雙雙',qualityControlDate:'2021/02/15'},
                    {id:'10',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅10',status:'已確認',completionDate:'2021/02/15',completionStaff:'李雙雙',qualityControlDate:'2021/02/15'},
                    {id:'11',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅11',status:'已確認',completionDate:'2021/02/15',completionStaff:'李雙雙',qualityControlDate:'2021/02/15'},
                    {id:'12',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅12',status:'已確認',completionDate:'2021/02/15',completionStaff:'李雙雙',qualityControlDate:'2021/02/15'},
                    {id:'13',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅13',status:'已確認',completionDate:'2021/02/15',completionStaff:'李雙雙',qualityControlDate:'2021/02/15'},
                    {id:'14',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅14',status:'已確認',completionDate:'2021/02/15',completionStaff:'李雙雙',qualityControlDate:'2021/02/15'},
                    {id:'15',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅15',status:'已確認',completionDate:'2021/02/15',completionStaff:'李雙雙',qualityControlDate:'2021/02/15'},
                    {id:'16',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅16',status:'已確認',completionDate:'2021/02/15',completionStaff:'李雙雙',qualityControlDate:'2021/02/15'},
                    {id:'17',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅17',status:'已確認',completionDate:'2021/02/15',completionStaff:'李雙雙',qualityControlDate:'2021/02/15'},
                    {id:'18',releaseDate:'2021/01/15',checkNumber:'10000',taskNumber:'133455',annotator:'張瓊雅18',status:'已確認',completionDate:'2021/02/15',completionStaff:'李雙雙',qualityControlDate:'2021/02/15'},
               ]
            }
        },
        mounted() {
            this.changeName();
            this.splitData();
        },
        watch: {
        },
        methods: {
            returnCondition(status) {
                if( status == '已標註' ) {
                    return 'noted'
                }else if( status == '待標註' ) {
                    return 'tobe-remarks'
                }else if( status == '已確認' ) {
                    return 'confirmed'
                }else if( status == '待確認' ) {
                    return 'waiting-confirmed'
                }
            },
            changeName() {
                if( this.taskList == 'label' ) {
                    this.tag = []
                    this.tag.push ( 
                        { 'tagname' : '待標註', 'tagamount' : 56 },
                        { 'tagname' : '已標註', 'tagamount' : 1556 }
                    )
                    this.dataLength = this.alldetailData.length
                    this.databox = this.detailData
                    this.allDatabox = this.alldetailData
                    this.showtable = false
                } else if ( this.taskList == 'confirm' ) {
                    this.tag = []
                    this.tag.push ( 
                        { 'tagname' : '待確認', 'tagamount' : 5256 },
                        { 'tagname' : '已確認', 'tagamount' : 156 }
                    )
                    this.dataLength = this.allconfirmedData.length
                    this.databox = this.confirmedData
                    this.allDatabox = this.allconfirmedData
                    this.showtable = true
                }
                this.pageNO = 1
                this.firstNo = 1
                this.selecttag = ''

            },
            selectTag(tagname) {
                if( this.selecttag == '' || this.selecttag != tagname ) {
                    this.selecttag = tagname
                    this.databox = JSON.parse ( JSON.stringify ( this.allDatabox ) );
                    this.selectData = this.databox.filter( item => item.status === tagname )
                    this.databox = JSON.parse ( JSON.stringify ( this.selectData ) );
                    this.initialPage()
                }else{
                    this.selecttag = ''
                    this.databox = JSON.parse ( JSON.stringify ( this.allDatabox ) );
                    this.initialPage()
                }
            },
            splitData() {
                this.databox = this.databox.splice( ( this.firstNo-1 ) , this.page )
            },
            initialPage(){
                this.pageNO = 1
                this.firstNo = 1
                this.splitData()
                this.endNo = this.databox.length
            },
            initialData(){
                if(this.selecttag == ''){
                    this.databox = JSON.parse ( JSON.stringify ( this.allDatabox ) );
                    this.selectData = JSON.parse ( JSON.stringify ( this.allDatabox ) );
                }else{
                    this.databox = JSON.parse ( JSON.stringify ( this.selectData ) );
                }
            },
            async  next() {
                this.initialData()
                if(( this.firstNo += this.page ) < this.selectData.length ) {
                    if(( this.endNo += this.page ) > this.selectData.length ) {
                        this.endNo = this.selectData.length
                    }
                    this.pageNO = await this.pageNO + 1
                } else {
                    this.firstNo -= this.page
                }
                this.splitData()
            },
            async  previous() {
                this.initialData()
                if( ( this.firstNo-=this.page ) >= 1 ) {
                    this.endNo = this.firstNo + this.page - 1
                    this.pageNO = await this.pageNO - 1
                }else {
                    this.firstNo += this.page
                }
                this.splitData()
            }
        }
    }
</script>
<style scoped>
    .el-table >>> th.is-leaf {
        border-bottom: 2px solid #DEE2E6;
    }
    .el-table >>> th {
        font: normal normal bold 16px/25px Arial;
        color: #233044;
        font-size: 16px;
    }
    .el-table >>> tr {
        font: normal normal normal 16px/25px Arial;
        color: #334560;
        font-size: 16px;
    }
    .condition-div {
        display: flex;
        margin:5px auto 15px 5px;
        float: left;
        color: #233044;
        opacity: 1;
        position: relative;
    }
    .tobe-remarks {
        background: #FFF3D1;
        border-radius: 17px;
        display: flex;
    }
    .tobe-remarks .name {
        margin:5px 0px 5px 10px;
        font: normal normal normal 16px/25px ;
        color: #FFBC00;
    }
    .tobe-remarks .amount {
        background: #FFBC00;
        border-radius: 13px;
        font: normal normal normal 14px/16px Helvetica;
        color: #FFFFFF;
        margin:5px 7px;
        padding: 3px 7px;
    }
    .waiting-confirmed {
        background: #FEE1E7;
        border-radius: 17px;
        display: flex;
    }
    .waiting-confirmed .name {
        margin:5px 0px 5px 10px;
        font: normal normal normal 16px/25px ;
        color: #FA5C7C;
    }
    .waiting-confirmed .amount {
        background: #FA5C7C;
        border-radius: 13px;
        font: normal normal normal 14px/16px Helvetica;
        color: #FFFFFF;
        margin:5px 7px;
        padding: 3px 7px;
    }
    .confirmed {
        background: #E4E6E7;
        border-radius: 17px;
        display: flex;
    }
    .confirmed .name {
        margin:5px 0px 5px 10px;
        font: normal normal normal 16px/25px ;
        color: #6C757D;
    }
    .confirmed .amount {
        background: #6C757D;
        border-radius: 13px;
        font: normal normal normal 14px/16px Helvetica;
        color: #FFFFFF;
        margin:5px 7px;
        padding: 3px 7px;
    }
    .noted {
        background:#0ACF972E;
        border-radius: 17px;
        display: flex;
    }
    .noted .name {
        margin:5px 0px 5px 10px;
        font: normal normal normal 16px/25px ;
        color:#0ACF97;
    }
    .noted .amount {
        background:#0ACF97;
        border-radius: 13px;
        font: normal normal normal 14px/16px Helvetica;
        color: #FFFFFF;
        margin:5px 7px;
        padding: 3px 7px;
    }
    .pagination-div {
        width: 1510px;
        height: 61px;
        position: fixed;
        top:1000px;
        left: 350px;
    }
    .pagination {
        height: 61px;
        position: absolute;
        left: 1352px;
        top:22.71px
    }    
    .icon-div {
        width: 6.86px;
        height: 12px;
        position: absolute;
        left: 12.28px;
        top:10.84px;
    }
    .icon-left-div {
        width: 33px;
        height: 33px;
        position: absolute;
        left: 1443px;
        top:14.83px;
        cursor: pointer;
        color: #233044;
    }
    .new-icon-left-div {
        width: 33px;
        height: 33px;
        position: absolute;
        left: 1443px;
        top:14.83px;
        color: #DEE2E6;
    }
    .icon-right-div {
        width: 33px;
        height: 33px;
        position: absolute;
        left: 1476px;
        top:14.83px;
        color: #233044;
        cursor: pointer;
    }
    .new-icon-right-div {
        width: 33px;
        height: 33px;
        position: absolute;
        left: 1476px;
        top:14.83px;
        color: #DEE2E6;
    }
</style>