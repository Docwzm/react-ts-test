
import request from '@/utils/request'
const SERVICE_NAME = '/taskplanning_service'

/**
 * 获取文章详情
 */
const todayBpRecord = ({ userId, planId }) => {
    return request({
        url: `${SERVICE_NAME}/resource/todayBpRecord`,
        method: 'POST',
        data: {
            userId,
            planId
        }
    })
}


/**
 * 获取饮食|患教详情
 */
const getResourceByInstanceId = ({ userId, resourceType, target }) => {
    return request({
        url: `${SERVICE_NAME}/resource/getResourceByInstanceId`,
        method: 'POST',
        data: {
            userId,
            resourceType,
            target
        }
    })
}


/**
 * 任务执行结束
 */
const taskSubmit = ({
    userId,
    planId,
    taskType,
    taskSubmit
}) => {
    return request({
        url: `${SERVICE_NAME}/plan_task/taskSubmit`,
        method: 'POST',
        data: {
            userId,
            planId,
            taskType,
            taskSubmit
        }
    })
}

export {
    todayBpRecord,
    getResourceByInstanceId,
    taskSubmit
}