<template>
    <div>
        <div @click="toNewProject">新增專案</div>
        <div v-for="(item) in projectList" :key="item.project_id" class="project-item" @click="showProjectDetail(item.project_id)">
            <div>{{item.project_id}}</div>
            <div>{{item.project_name}}</div>
            <div>{{timeFormat(item.create_datetime)}}</div>
        </div>
    </div>
</template>

<script>
    import {getProjectList, getUserList} from '@/api/index'
    import {mapGetters} from 'vuex'
    import moment from 'moment'

    export default {
        name: "projectList.vue",
        computed: {
            ...mapGetters({
                projectList: 'projectList'
            })
        },
        data() {
            return {
                // list: ''
            }
        },
        mounted() {
            this.getProjectList()
            this.getUserList()
        },
        methods: {
            async getProjectList() {
                let result = await getProjectList()
                if (result.result) {
                    // this.list = result.data
                    this.$store.commit('setProjectList', result.data)
                    console.log(result.data)
                } else {
                    console.log(result)
                }
            },
            async getUserList() {
                let result = await getUserList()
                if (result.result) {
                    this.$store.commit('setAllUserList', result.data)
                } else {
                    console.log(result)
                }

            },
            timeFormat(time) {
                return moment(time).format('YYYY-MM-DD')
            },
            toNewProject() {
                this.$store.commit('chgNowProjectId', '')
                this.$store.commit('setNowFunc', 'newProject')
            },
            showProjectDetail(id) {
                this.$store.commit('chgNowProjectId', id)
                this.$store.commit('setNowFunc', 'editProject')
            }
        }
    }
</script>

<style scoped>
    .project-item {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin: 5px 5px;
    }

    .project-item > div {
        margin-right: 5px;

    }
</style>
