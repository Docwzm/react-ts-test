import React, { Component } from 'react'
import { Modal } from 'antd-mobile'
import { countDown, gotoPage } from '@/utils'
import Picker from '@/components/Picker'
import LongTapProgress from '@/components/LongTapProgress'

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
         targetTime: 1,
         timeLong: 0,
         trainModalVisible: false,
         update: false,
         trueDoValue: 0
      }
   }

   componentWillMount() {
      document.title = '呼吸训练'
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
      window.location.reload()
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
            self.setState({ pageStatus: 3 })
            let targetSec = targetTime * 60;
            this.runBreath(targetSec)
         }
      })
   }

   runBreath(targetSec) {
      let { update, timeLong } = this.state
      countDown([targetSec, 0], (res, timer) => {
         if (this.state.animationState === 'pause') {
            clearInterval(timer)
         } else {
            timeLong++
            this.setState({ timeLong })
         }
         if (res === 0 && !update) {
            console.log('倒计时结束');

            this.actionFinishPlanOnce()
            this.setState({ complate: true, animationState: 'pause' })
         }
      })
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
   async actionFinishPlanOnce(data) {

   }

   render() {
      const { timeLong, pageStatus, count, animationState, complate, showPicker, targetTime, trainModalVisible, trueDoValue } = this.state;
      let pickerData = [targetTime]
      const timeLongStr = timeLong < 60 ? (timeLong + '秒') : (timeLong % 60 === 0 ? (timeLong / 60 + '分') : (parseInt(timeLong / 60) + '分' + (timeLong % 60) + '秒'))
      const timeLongNum = (timeLong < 60 ? '00' : parseInt(timeLong / 60)) + ':' + ((timeLong % 60) < 10 ? ('0' + (timeLong % 60)) : timeLong % 60);

      return (
         <div className='breathing'>

            {
               showPicker ? <Picker cancle={this.handleTimeCancle} save={this.handleTimeSave} prefixCls="time-picker" title="时间" data={pickerData} rangedata={timeRangeData}>
                  <div className="unit" style={{ right: '1.4rem' }}>分钟</div>
               </Picker> : null
            }

            {
               pageStatus === 1 ? <div className="page-status">
                  <div className='title'>推荐目标</div>
                  <div className='time-wrap' onClick={this.changeTarget}>
                     <div className='time'>{targetTime}</div>
                     <div className='unit'>分钟</div>
                     <img src={require('@/assets/images/icn_right@2x.png')} alt="" />
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
                              <span className='number'>{(trueDoValue > 0 && trueDoValue < targetTime) ? trueDoValue : targetTime}</span>
                              <span className='unit'>分钟</span>
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
                  {complate ? <div className="btn-wrap"><div className='one-more-time' onClick={this.handleBreathingOneMoreTime.bind(this)}>再来一次</div><div className='exit' onClick={this.handleExit}>结束</div></div> : <div className='btn-group'><LongTapProgress onComplate={this.handleStartBreathPractic.bind(this)} /></div>}
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
                     this.handleExit()
                  }
               }, {
                  text: '继续', onPress: () => {
                     this.setState({ animationState: 'play', trainModalVisible: false })
                     this.runBreath(targetTime * 60 - timeLong)
                  }
               }]}
            >
               <div className="title">您练习了{timeLongStr}，未完成目标，再努努力吧！</div>
            </Modal>
         </div>
      )
   }
}

export default Breathing