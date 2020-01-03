import request from '@utils/request'
import uuid from 'uuid'
const SERVICE_NAME = '/'

/**
 * 保存评估
 */
const saveEvaluates = (data) => {
   return request({
      url: "/healthevaluate_service/healthevaluate/submitReport/v2",
      method:'POST',
      data
   })
}

/**
 * 获取评估结果
 */
const getEvaluatesResult = (thirdUserId) => {
   return request({
      url: "/healthevaluate_service/healthevaluate/loadEvaluateResult",
      method:'GET',
      params:{
         thirdUserId
      }
   })
}

const getToken = () => {
   return request({
      url: SERVICE_NAME + ""
   })
}

const getWxConfig = (url) => {
   return request({
      url: 'health_service/wx/jsapi_signature',
      method:'post',
      params:{
         requestId:`${uuid.v1().replace(/-/g, '')}`,
         appType:1
      },
      data:{
         url
      }
   })
}



/**
 POST /planIndexPage/getUserInfo
 获取计划首页的数据
 * @param {*} data
 */
const getIndexUserInfo = (data) => {
   return request({
       url: '/saasactivity_service/planIndexPage/getUserInfo',
       data,
       method: "post"
   })
};

export {
   saveEvaluates,
   getEvaluatesResult,
   getToken,
   getWxConfig,
   getIndexUserInfo
}