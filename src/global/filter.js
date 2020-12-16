export function objReSet(obj) {
    var newObj = {};
    for (var i in obj) {
        if ((obj[i] === 0 || obj[i] === false || obj[i]) && obj[i].toString().replace(/(^\s*)|(\s*$)/g, '') !== '') {
            newObj[i] = obj[i];
        }
    }
    return newObj;
}
export default objReSet;