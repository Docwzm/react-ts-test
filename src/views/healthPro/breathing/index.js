import React, { Component } from 'react'
import { Modal } from 'antd-mobile'
import { countDown, gotoPage, queryUrlParam } from '@/utils'
import Picker from '@/components/Picker'
import LongTapProgress from '@/components/LongTapProgress'
import { taskSubmit, getUserTaskRecord, updateTaskTargetForPresent } from '@/apis/taskplanning_service'
import { HEALTHPLANTASKSTATUS } from '@/utils/enum'
import './styles/index.less'

const timeRangeData = []
for (let x = 1; x <= 30; x++) {
   timeRangeData.push({
      label: x,
      value: x
   })
}

class Breathing extends Component {
   constructor(props) {
      super(props);
      this.state = {
         pageStatus: 1,
         countRange: [3, 0],
         count: 3,
         animationState: 'play',
         complate: false,
         showPicker: false,
         targetTime: 2,//单位分钟
         timeLong: 0,
         trainModalVisible: false,
         update: false,
         trueDoValue: 0,
         loading: true
      }
   }

   componentWillMount() {
      document.title = '呼吸训练'
      let userId = queryUrlParam(this.props.location.search, 'userId')
      let planId = queryUrlParam(this.props.location.search, 'planId')
      let taskId = queryUrlParam(this.props.location.search, 'taskId')

      this.setState({
         userId,
         planId,
         taskId
      })

      this.getUserTaskRecord({
         userId,
         planId,
         taskId
      })
   }

   componentWillUnmount() {
      clearInterval(this.breathTimer)
   }

   async getUserTaskRecord({
      userId,
      planId,
      taskId
   }) {
      console.log('./.')
      try {
         let res = await getUserTaskRecord({
            userId,
            planId,
            taskId
         })
         let data = res.data;
         if (data && data.taskAchieve) {
            let timeLong = data.taskAchieve
            let trueDoValue = Math.ceil(timeLong / 60)
            let targetTime = parseInt(data.taskTarget / 60)
            this.setState({
               timeLong,
               trueDoValue,
               targetTime,
               complate: true,
               animationState: 'pause',
               pageStatus: 3,
               loading: false
            })
         } else {
            this.setState({
               loading: false
            })
         }
      } catch (e) {
         this.setState({
            loading: false
         })
      }
   }

   handleStartBreathPractic() {
      let { timeLong, targetTime } = this.state;
      if (timeLong < targetTime * 60) {
         this.setState({ trainModalVisible: true, animationState: 'pause' })
      } else {
         let trueDoValue = Math.ceil(timeLong / 60)
         this.actionFinishPlanOnce()
         this.setState({ complate: true, animationState: 'pause', update: true, trueDoValue })
      }
   }

   handleBreathingOneMoreTime() {
      this.setState({
         targetTime: 1,

         pageStatus: 1,
      })
   }

   handleTimeSave = (val) => {
      this.setState({
         showPicker: false,
         targetTime: val[0]
      })
   }

   handleTimeCancle = () => {
      this.setState({
         showPicker: false
      })
   }

   handleStartBtn() {
      let self = this;
      let { countRange, targetTime } = this.state
      this.setState({ startTime: new Date().getTime(), pageStatus: 2 })

      countDown(countRange, (count) => {
         self.setState({ count })
         if (count === countRange[1]) {
            self.setState({ pageStatus: 3, animationState: 'play', complate: false, timeLong: 0 })
            this.runBreath()
         }
      })
   }

   runBreath() {
      let { update, timeLong } = this.state
      clearInterval(this.breathTimer)
      this.breathTimer = setInterval(() => {
         if (this.state.animationState === 'pause') {
            clearInterval(this.breathTimer)
         } else {
            timeLong++
            this.setState({ timeLong })
         }
      }, 1000)
   }

   changeTarget = () => {
      this.setState({
         showPicker: true
      })
   }

   handleExit = () => {
      gotoPage(null, { jumpType: 'navigateBack' })
   }

   /**
    * 完成计划
    * @param {*} data 
    */
   async actionFinishPlanOnce() {
      let {
         userId,
         planId,
         taskId,
         timeLong,
         targetTime
      } = this.state;

      let _taskSubmit = [
         {
            taskId,
            achieved: timeLong,
         }
      ]

      await taskSubmit({
         userId,
         planId,
         taskSubmit: _taskSubmit
      })

      await updateTaskTargetForPresent({
         userId,
         planId,
         taskId,
         target: targetTime * 60
      })

   }

   render() {
      const { loading, timeLong, pageStatus, count, animationState, complate, showPicker, targetTime, trainModalVisible, trueDoValue } = this.state;
      let pickerData = [targetTime]
      const timeLongStr = () => {
         return <>
            {
               timeLong < 60 ? <>{timeLong}<span className='unit'>秒</span></> : timeLong % 60 === 0 ? <>{timeLong / 60}<span className="unit">分</span></> : <>{parseInt(timeLong / 60)}<span className="unit">分</span>{timeLong % 60}<span>秒</span></>
            }
         </>
      }
      const timeLongNum = (timeLong < 60 ? '00' : parseInt(timeLong / 60)) + ':' + ((timeLong % 60) < 10 ? ('0' + (timeLong % 60)) : timeLong % 60);

      return !loading ? <div className='breathing'>

         {/* <img className="bg" src={require('@/assets/images/breathing_bg.jpg')}></img> */}

         {
            showPicker ? <Picker cancle={this.handleTimeCancle} save={this.handleTimeSave} prefixCls="time-picker" title="时间" data={pickerData} rangedata={timeRangeData}>
               <div className="unit" style={{ right: '1.4rem' }}>分钟</div>
            </Picker> : null
         }

         {
            pageStatus === 1 ? <div className="page-status">
               <div className='title'>推荐目标</div>
               <div className='time-wrap' onClick={this.changeTarget}>
                  <div>
                     <span className='time'>{targetTime}</span>
                     <span className='unit'>分钟</span>
                  </div>
               </div>
               <div className='tips'>请跟随小气泡的节奏呼吸与吸气</div>
               <div className='btn' onClick={this.handleStartBtn.bind(this)}>
                  <span>开始</span>
               </div>
            </div> : null
         }

         {
            pageStatus === 2 ? <div className='page-status-2'>
               <div className='count-dowm-num'>{count}</div>
               <div className='tips'>请跟随小气泡的节奏呼吸与吸气</div>
            </div> : null
         }

         {
            pageStatus === 3 ? <div className='page-status-3 '>
               <div className='shape'>
                  {complate ? (
                     <div className='result'>
                        <div className='result-title'>本次训练</div>
                        <div className='result-center'>
                           {timeLongStr()}
                        </div>
                        <div className='result-info'>{(trueDoValue > 0 && trueDoValue < targetTime) ? trueDoValue * 10 : targetTime * 10}次呼吸</div>
                     </div>
                  ) : (
                        <div className='words'>
                           <div className={'words-1 ' + animationState}>吸气</div>
                           <div className={'words-2 ' + animationState}>呼气</div>
                        </div>
                     )}
                  <div className={'shape-wrap ' + animationState}>
                     <div className={'shape-1 ' + animationState}></div>
                     <div className={'shape-2 ' + animationState}></div>
                  </div>
               </div>
               {
                  !complate ? <div className="time-run">{timeLongNum}</div> : null
               }
               {complate ? null : <div className='btn-group'><LongTapProgress onComplate={this.handleStartBreathPractic.bind(this)} /></div>}
            </div> : null
         }

         <Modal
            className="train-modal"
            visible={trainModalVisible}
            transparent
            maskClosable={false}
            title={false}
            footer={[{
               text: '结束', onPress: () => {
                  let trueDoValue = Math.ceil(timeLong / 60)
                  this.actionFinishPlanOnce()
                  this.setState({ trainModalVisible: false, complate: true, animationState: 'pause', update: true, trueDoValue })
               }
            }, {
               text: '继续', onPress: () => {
                  this.setState({ animationState: 'play', trainModalVisible: false })
                  this.runBreath()
               }
            }]}
         >
            <div className="title">您练习了{timeLongStr()}，未完成目标，再努努力吧！</div>
         </Modal>
      </div > : null
   }
}

export default Breathing