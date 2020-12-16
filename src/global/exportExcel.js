// import FileSaver from 'file-saver';
// import XLSX from 'xlsx';
// const exportExcel = {
//     exportExcel(List, name) {
//         var wopts = { bookType: 'xlsx', bookSST: true, type: 'binary' };
//         var workBook = { SheetNames: ['Sheet1'], Sheets: {}, Props: {} };
//         workBook.Sheets['Sheet1'] = XLSX.utils.json_to_sheet(List); 
//         let excelName = name + '.xlsx'
//         FileSaver.saveAs(new Blob([exportExcel.changeData(XLSX.write(workBook, wopts))], { type: 'application/octet-stream' }), excelName)
//     },
//     changeData(s) {
//         if (typeof ArrayBuffer !== 'undefined') {
//             var buf = new ArrayBuffer(s.length);
//             var view = new Uint8Array(buf);
//             for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
//             return buf;
//         }
//         else {
//             var buf = new Array(s.length);
//             for (var i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF;
//             return buf;
//         }
//     },
// }
// export default exportExcel

// export function export2Excel(columns,list){
//     require.ensure([], () => {
//         const { export_json_to_excel } = require('../../excel/Export2Excel');
//         let tHeader = []
//         let filterVal = []
//         columns.forEach(item =>{
//             tHeader.push(item.title)
//             filterVal.push(item.key)
//         })
//         const data = list.map(v => filterVal.map(j => v[j]))
//         export_json_to_excel(tHeader, data, '数据列表');
//     })
// }