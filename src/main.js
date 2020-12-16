import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/'
import objReSet from './global/filter'
import GetInfoByCard from './global/getInfoByCard'
import GetDate from "global/getDate"
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import ElTableBar from 'el-table-bar-base'
import 'el-table-bar-base/lib/ElTableBar.css'
import { scrollY } from "./global/scorllbar"; //滚动条
Vue.prototype.escrollY = scrollY //滚动条
Vue.prototype.objReSet = objReSet //去除对象里为空的属性
Vue.prototype.GetInfoByCard = GetInfoByCard //根据身份证得到平台用户的信息
Vue.prototype.GetDate = GetDate //获取时间的方法

Vue.config.productionTip = false;

// 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 图标库
import './assets/icon-fonts/iconfont.css'
import './assets/icon-fonts/iconfont'
import './assets/fonts/iconfont.css'
import './assets/fonts/iconfont'

Vue.use(ElementUI);
Vue.use(ElTableBar);
Vue.use(VueQuillEditor);

Vue.directive('has', {
    inserted: function (el, binding) {
        let type = binding.value.type;
        let permission = permissionJudge(binding.value.name);
        // console.log(permission);
        if (!(permission & type)) {
            el.parentNode.removeChild(el);
        }

        function permissionJudge(value) {
            if (store.getters.getIsAdmin)
                return 7;

            console.log("权限查找：" + value);
            let findSubRet = store.getters.getManagerPermission.find(v => v.name === value);
            if (findSubRet != undefined) {
                // 查找到
                // console.log("权限查找成功" + findSubRet);
                // console.log(findSubRet);
                return findSubRet.permission;
            }

            // console.log("权限查找失败");
            return 0;
        }
    }
});
Vue.filter('formateProp', function (value) {
    if (value) {
        return value;
    } else {
        return "--";
    }
})

new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
})