import axios from 'axios'

import { setToken } from '../features/Login';


const url = {
    baseUrl : 'http://retaildev.digiwin.com.cn/dcpService_v3x',//https://retaildev.digiwin.com.cn/dcpService_3.0
    crmUrl: 'https://retaildev.digiwin.com.cn',
    promUrl:'https://retaildev.digiwin.com.cn',
    goodImagesUrl: 'https://retaildev.digiwin.com.cn',
    domain: 'https://retaildev.digiwin.com.cn',
    appId: 'wx81c1709e295c9b30',
    documentUploadUrl: 'https://retaildev.digiwin.com.cn',//单据上传图片统一文件夹
};
const Port = {
    defaultPort:'/DCP/services/invoke',//默认路径
    crmPort: '/crmService_3.0/DCP/services/invoke',
    promPort: '/promService_3.0/prom_rules/DCP/services/invoke',
    goodImagesPort:'/dcpService_3.0/goodsimages/DCP/services/invoke',
    domainPort:'/retailStore_3.0/dcpService_3.0/goodsimages/DCP/services/invoke',
    documentUploadPort:'/resource/shopimage/'
};
function guid(){
    let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    let uuid = [];
    const radix = 16;
    for (let i = 0; i < 16; i++)
        uuid[i] = chars[0 | Math.random() * radix];
    return uuid.join('');
}
let getTimeToMilliseconds = () =>{
    let myDate = new Date();
    let timestamp = '';
    //时间戳
    timestamp = myDate.getFullYear().toString() + (myDate.getMonth() > 8 ? (myDate.getMonth() + 1) :'0' + (myDate.getMonth() + 1)) + (myDate.getDate() > 9 ? myDate.getDate().toString() : '0' + myDate.getDate().toString()) + (myDate.getHours() > 9 ? myDate.getHours().toString() :'0' + myDate.getHours().toString()) + (myDate.getMinutes() > 9 ? myDate.getMinutes().toString(): '0'+ myDate.getMinutes().toString()) + (myDate.getSeconds() > 9 ? myDate.getSeconds().toString(): '0' + myDate.getSeconds().toString()) + myDate.getMilliseconds().toString();
    return timestamp;
}
const http = axios.create({
    baseURL:url.baseUrl,
    timeout:5000, 
    headers: {
    "Content-Type": 'application/json'
    }
})
http.interceptors.request.use((config)=>{
    //在发送请求之前做某事
    //let timestamp = new Date().getTime();
    config.data.timestamp = getTimeToMilliseconds()
    if(config.data.serviceId!== 'DCP_LoginRetail'){
        config.data.token = JSON.parse(sessionStorage.getItem('token'))||''
    }
    config.data.langType = 'zh_CN';
    config.data.plantType = 'retailStore';
    config.data.version = version + '-' + updateDay;
    config.data.requestId = guid();
    return config;
    },(error)=>{
        return Promise.reject(error);
    });
//添加响应拦截器
http.interceptors.response.use((response)=>{
    //对响应数据做些事
    return {
        data:response.data.datas,
        token:response.data.token,
        success:response.data.success,
        serviceDescription:response.data.serviceDescription,
        totalRecords:response.data.totalRecords
    };
    
    
},(error)=>{
    return Promise.reject(error);
});
//post请求
export default function post(url,params={}){
    return http.post(url,params)
}


export { Port }

