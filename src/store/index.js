import Vuex from 'vuex'
import Vue from "vue"
import createPersistedState from "vuex-persistedstate"

Vue.use(Vuex)

const loginInfo = JSON.parse(window.localStorage.getItem('loginInfo'));


const state = {
    loginInfo: loginInfo ? loginInfo : '',
    functionList: [
        {type: 'work', name: '任務工作清單', component: 'workList'},
        {type: 'pro', name: '專案設定', component: 'projectList'},
        {type: 'search', name: '進階搜尋', component: 'advanceSearch'},
        {type: 'stt', name: '帳號管理', component: 'settingAccount'},
    ],
    choseSideBarFunc: '',
    nowProjectId: '',
    allUserList: [], // 全部人員清單
    allProjectList: [], // 全部專案清單
}

const mutations = {
    /*
    * 目前project id
    * */
    chgNowProjectId(state, payload) {
        state.nowProjectId = payload
    },
    /*
    * 登入資訊 包含user info、token
    * */
    setLoginInfo(state, payload) {
        state.loginInfo = payload
    },
    /*
    * 目前當下選定功能
    * */
    setNowFunc(state, payload) {
        state.choseSideBarFunc = payload
    },
    /*
    * 所有使用者清單
    * */
    setAllUserList(state, payload) {
        state.allUserList = payload
    },
    /*
    * 所有專案清單
    * */
    setProjectList(state, payload) {
        state.allProjectList = payload
    }
}

const actions = {}

const getters = {
    getNowFunction: state => state.choseSideBarFunc,
    getToken: state => state.loginInfo.access_token,
    getUserList: state => state.allUserList,
    projectList: state => state.allProjectList
}


export default new Vuex.Store({
    state,
    mutations,
    actions,
    getters,
    plugins: [createPersistedState({
        key: 'loginInfo',
        reducer(val) {
            return val.loginInfo
        },

    })]
})
