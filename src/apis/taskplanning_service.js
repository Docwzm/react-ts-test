
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
const getResourceByInstanceId = ({ userId, planId, taskId, target }) => {
    return request({
        url: `${SERVICE_NAME}/resource/getResourceByInstanceId`,
        method: 'POST',
        data: {
            userId,
            planId,
            taskId,
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
    taskSubmit
}) => {
    return request({
        url: `${SERVICE_NAME}/plan_task/taskSubmit`,
        method: 'POST',
        data: {
            userId,
            planId,
            taskSubmit
        }
    })
}

/**
 * 查询用户某个任务的执行记录
 */
const getUserTaskRecord = ({
    userId,
    planId,
    taskId
}) => {
    return request({
        url: `${SERVICE_NAME}/plan_task/getUserTaskRecord`,
        method: 'POST',
        data: {
            userId,
            planId,
            taskId
        }
    })
}


/**
 * 更新当前任务的目标
 */
const updateTaskTargetForPresent = ({
    userId,
    planId,
    taskId,
    target
}) => {
    return request({
        url: `${SERVICE_NAME}/plan_task/updateTaskTargetForPresent`,
        method: 'POST',
        data: {
            userId,
            planId,
            taskId,
            target
        }
    })
}
export {
    todayBpRecord,
    getResourceByInstanceId,
    taskSubmit,
    getUserTaskRecord,
    updateTaskTargetForPresent
}