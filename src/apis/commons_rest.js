import request from '@/utils/request'
const SERVICE_NAME = '/commons_rest'

/**
 * 获取文章详情
 */
const getPagesInfo = (id) => {
   return request({
      url: `${SERVICE_NAME}/columnContent/getInfo`,
      method:'POST',
      data:{
         id
      }
   })
}

export {
   getPagesInfo
}