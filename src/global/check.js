import Vue from 'vue';

var _this = Vue.prototype;
let num = /^[0-9]*$/;
let phoneReg = /^1[345789]\d{9}$/;
let wxreg = /^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$/;
let regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
let identIdReg = /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/;
export function phone(phone) {
    if (phoneReg.test(phone)) {
        return true
    } else {
        _this.$message({
            type: "error",
            message: "电话号码输入有误！",
            center: true,
        })
        return false
    }
}
export function ident(identId) {
    if (identIdReg.test(identId)) {
        return true
    } else {
        _this.$message({
            type: "error",
            message: "身份证号码输入有误！",
            center: true,
        })
        return false
    }
}
export function email(email) {
    if (regEmail.test(email)) {
        return true
    } else {
        _this.$message({
            type: "error",
            message: "请输入合法的邮箱！",
            center: true,
        })
        return false
    }
}
export function wxnum(wx) {
    if (wxreg.test(wx)) {
        return true
    } else {
        _this.$message({
            type: "error",
            message: "请输入正确的微信号！",
            center: true,
        })
        return false
    }
}

export default {
    phone,
    ident,
    email,
    wxnum
};