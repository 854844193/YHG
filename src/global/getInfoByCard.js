//根据身份证获取出生日期
export function getBirth(idCard) {
    var birthday = "";
    if (idCard != null && idCard != "") {
        if (idCard.length == 15) {
            birthday = "19" + idCard.substr(6, 6);
        } else if (idCard.length == 18) {
            birthday = idCard.substr(6, 8);
        }
        birthday = birthday.replace(/(.{4})(.{2})/, "$1-$2-");
    }
    return birthday;
}
// 根据出生日期获取年龄
export function getAge(strAge) {
    var birArr = strAge.split("-");
    var birYear = birArr[0];
    var birMonth = birArr[1];
    var birDay = birArr[2];

    d = new Date();
    var nowYear = d.getFullYear();
    var nowMonth = d.getMonth() + 1; //记得加1
    var nowDay = d.getDate();
    var age = "";

    if (birArr == null) {
        return false;
    }
    var d = new Date(birYear, birMonth - 1, birDay);
    if (
        d.getFullYear() == birYear &&
        d.getMonth() + 1 == birMonth &&
        d.getDate() == birDay
    ) {
        if (nowYear == birYear) {
            returnAge = 0; //
        } else {
            var ageDiff = nowYear - birYear; //
            if (ageDiff > 0) {
                if (nowMonth == birMonth) {
                    var dayDiff = nowDay - birDay; //
                    if (dayDiff < 0) {
                        age = ageDiff - 1;
                    } else {
                        age = ageDiff;
                    }
                } else {
                    var monthDiff = nowMonth - birMonth; //
                    if (monthDiff < 0) {
                        age = ageDiff - 1;
                    } else {
                        age = ageDiff;
                    }
                }
            } else {
                return "出生日期晚于今天，数据有误"; //返回-1 表示出生日期输入错误 晚于今天
            }
        }
        return age;
    } else {
        console.log("出生日期格式错误！");
    }
}
//获取性别
export function getGender(idCard) {
    if (parseInt(idCard.slice(-2, -1)) % 2 == 1) {
        return "1";
    } else {
        return "2";
    }
}
export default {
    getBirth, getAge, getGender
}