import { baseUrl } from './env'
export default async(url = '', data = {}, method = 'GET', funName = 'fetch') => {
    if (funName == 'fetch') {
        url = baseUrl + url;
        const option = {
            method,
            headers: {
                'content-type': 'application/json'
            }
        }

        if (method == 'GET') {
            let dataStr = ''; //数据拼接字符串
            Object.keys(data).forEach(key => {
                dataStr += key + '=' + data[key] + '&';
            })
            url += dataStr
        }

        if ((method == 'POST') ||
            (method == 'PUT')) {
            option.body = JSON.stringify(data)
        }
        const res = await fetch(url, option)
        return res.json()
    } else {
        // debugger;
        url = baseUrl + url;
        const option = {
            method,
            body: data,
        }

        const res = await fetch(url, option);
        return res.json()
    }
}