import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const mutations = {
    saveAdminInfo(state, adminInfo) {
        state.adminInfo = adminInfo;
    },
    setLoginState(state, value) {
        state.loginIn = value;
    },
    saveManagerPermission(state, value) {
        state.ManagerPermission = value;
    },
    setIsAdmin(state, value) {
        state.admin = value;
    }
}

const getters = {
    getAdminInfo: state => state.adminInfo,
    getLoginState: state => state.loginIn,
    getManagerPermission: state => state.ManagerPermission,
    getIsAdmin: state => state.admin,
}

const actions = {}

const store = new Vuex.Store({
    state: sessionStorage.getItem('state') ? JSON.parse(sessionStorage.getItem('state')) : {
        adminInfo: {
            avatar: 'default.jpg'
        },
        loginIn: false,
        admin: false,
        ManagerPermission: {},
    },
    actions,
    getters,
    mutations,
})

export default store