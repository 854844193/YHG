// 获取当天时期
export function getCurrentDate() {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    let currentDate = year + seperator1 + month + seperator1 + strDate;
    return currentDate;
};
// 获取前七天
export function getWeek() {
    let dateArray = [];
    var myDate = new Date(); //获取今天日期
    myDate.setDate(myDate.getDate() - 7);
    var dateTemp;
    var flag = 1;
    let year = myDate.getFullYear();
    let month = (myDate.getMonth() + 1) < 10 ? "0" + (myDate.getMonth() + 1) : (myDate.getMonth() + 1);
    for (var i = 0; i < 7; i++) {
        let day = myDate.getDate() < 10 ? "0" + myDate.getDate() : myDate.getDate();
        dateTemp = year + "-" + month + "-" + day;
        dateArray.push(dateTemp);
        myDate.setDate(myDate.getDate() + flag);
    }
    return dateArray;
};
// 获取当月第一天和最后一天
export function getMonthDate() {
    let currentMonth = []
    let nowdays = new Date();
    let year = nowdays.getFullYear();
    let month = nowdays.getMonth() + 1;
    month = month > 9 ? month : "0" + month;
    let firstDayOfCurMonth = `${year}-${month}-01`;
    let lastDay = new Date(year, month, 0);
    let lastDayOfCurMonth = `${year}-${month}-${lastDay.getDate()}`;
    currentMonth[0] = firstDayOfCurMonth;
    currentMonth[1] = lastDayOfCurMonth;
    return currentMonth;
};
// 获取上个月起止日期
export function getLastMonthDate() {
    var lastmonth = [];
    var nowdays = new Date();
    var year = nowdays.getFullYear();
    var month = nowdays.getMonth();
    if (month == 0) {
        month = 12;
        year = year - 1;
    }
    if (month < 10) {
        month = '0' + month;
    }
    var myDate = new Date(year, month, 0);
    lastmonth[0] = year + '-' + month + '-01';//上个月第一天
    //若是闰年，二月最后一天是29号
    if (month == 2 && year % 4 == 0 && year % 100 != 0 || year % 400 == 0) {
        lastmonth[1] = year + '-' + month + '-' + '29';
    } else {
        lastmonth[1] = year + '-' + month + '-' + myDate.getDate();//上个月最后一天
    }
    return lastmonth;
}
// 获取当月、上月所有日期
export function getDaysInMonth(med) {
    const daysOfMonth = [];
    var nowdays = new Date();
    var year = nowdays.getFullYear();
    if (med == "current") {
        var month = nowdays.getMonth() + 1;
        if (month < 10) month = '0' + month;
        const lastDayOfMonth = new Date(year, month, 0).getDate();
        for (let i = 1; i <= lastDayOfMonth; i++) {
            if (i < 10) {
                daysOfMonth.push(year + "-" + month + "-" + "0" + i);
            } else {
                daysOfMonth.push(year + "-" + month + "-" + i);
            }
        }
        return daysOfMonth;
    }
    if (med == "last") {
        var month = nowdays.getMonth();
        if (month < 10) month = '0' + month;
        const lastDayOfMonth = new Date(year, month, 0).getDate();
        for (let i = 1; i <= lastDayOfMonth; i++) {
            if (i < 10) {
                daysOfMonth.push(year + "-" + month + "-" + "0" + i);
            } else {
                daysOfMonth.push(year + "-" + month + "-" + i);
            }
        }
        return daysOfMonth;
    }

}
// 时间戳转时间格式
export function formatDate(now) {
    var year = now.getFullYear();
    var month =
        now.getMonth() + 1 < 10
            ? "0" + (now.getMonth() + 1)
            : now.getMonth() + 1;
    var date = now.getDate() < 10 ? "0" + now.getDate() : now.getDate();
    var hour = now.getHours() < 10 ? "0" + now.getHours() : now.getHours();
    var minute =
        now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();
    var second =
        now.getSeconds() < 10 ? "0" + now.getSeconds() : now.getSeconds();
    return (
        year +
        "-" +
        month +
        "-" +
        date +
        " " +
        hour +
        ":" +
        minute +
        ":" +
        second
    );
}
export default {
    getCurrentDate,
    getWeek,
    getMonthDate,
    getLastMonthDate,
    getDaysInMonth,
    formatDate
}