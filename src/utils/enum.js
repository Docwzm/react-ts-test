//健康计划任务类型
export const HEALTHPLANTYPE = {
    BP: 1, //血压
    SPORT: 2, //运动锻炼
    REDUCE_PRESS: 3, //减压
    MEDICINE_RECORD: 4, //用药记录
    DIETARY: 5, //饮食
    COURSE: 6 //健康课堂
  }
  
  //健康计划任务状态
  export const HEALTHPLANTASKSTATUS = {
    INITIAL: 1, //去执行
    DOING: 2, //进行中
    FINISHED: 3, //已完成
    FAILED: 4 //未完成
  }