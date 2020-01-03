
import request from '@utils/request'
const SERVICE_NAME = "/tianansp_service"


/**
 * 分享评测添加积分
 * @param {String}  userId
 * 
 */
const shareEvaluating = (userId,tenant) => {
   return request({
      url: SERVICE_NAME + '/columnContent/shareEvaluating',
      data: {
         userId
      },
      params:{
         isThirdServer:true,
         tenant
      },
      method: 'post'
   })
}


export {
   shareEvaluating
}