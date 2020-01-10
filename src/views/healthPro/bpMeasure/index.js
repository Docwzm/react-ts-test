import React from 'react'
import { Modal, Icon } from 'antd-mobile'
import { gotoPage, setLocal, getLocal, queryUrlParam } from '@/utils'
import { todayBpRecord, taskSubmit } from '@/apis/taskplanning_service'
import Loading from '@/views/layout/loading'
import moment from 'moment'
import './styles/index.less'
const wx = window.wx

export default class Measure extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            hintCheck: false,//下次不再提示check标识
            measureWayModal: false,//测量方式弹窗标识
            measureModal: false,//测量引导弹窗标识
            measureStep: 0, //测量引导状态0-未开始 1-进行中
            measureStatus: 0,//测量的进度 0-进行中 1-完成
            time: 5, //测量引导时间倒计时
            morningBpRecord: {
                name: '晨起血压测量',
                recomendTime: '6:00-10:00',
                // "measurementDate": moment().format('YYYY-MM-DD HH:mm'),//测量时间
                // "systolicPressure": 120,//高
                // "diastolicPressure": 80,//低
                // "heartRate": 76,//心率
                // "levelName": "h1高血压"
            },
            nightBpRecord: {
                name: '睡前血压测量',
                recomendTime: '20:00-24:00',
                // "measurementDate": moment().format('YYYY-MM-DD HH:mm'),
                // "systolicPressure": 120,
                // "diastolicPressure": 80,
                // "heartRate": 76,
                // "levelName": "正常"
            }
        }
    }

    componentWillMount() {

        let userId = queryUrlParam(this.props.location.search, 'userId')
        let planId = queryUrlParam(this.props.location.search, 'planId')
        this.setState({
            userId,
            planId
        })
        this.getTodayBpRecord({
            userId,
            planId
        })
    }

    componentDidMount() {
        document.title = '测量'
    }

    componentWillUnmount() {
        clearInterval(this.timer)
    }


    async getTodayBpRecord({
        userId,
        planId
    }, callback) {
        try {
            let res = await todayBpRecord({
                userId,
                planId
            })
            let data = res.data
            if (data) {
                let {
                    morningBpRecord = {},
                    nightBpRecord = {},
                    taskType
                } = data
                this.setState({
                    morningBpRecord: { ...this.state.morningBpRecord, ...morningBpRecord },
                    nightBpRecord: { ...this.state.nightBpRecord, ...nightBpRecord },
                    taskType
                })
                callback && callback(data)
            }
        } catch (e) {
            callback && callback({})
        }
    }

    handleOpenMeasureWay = (ind) => {
        this.setState({
            measureWayModal: true,
            currentBp: ind
        })
    }

    hanldeMeasure = () => {
        let hintCheck = getLocal('bp-hint')
        if (hintCheck) {
            //之前操作过下次不再提示  直接跳到第二步
            this.setState({
                measureWayModal:false,
                measureModal: true,
                measureStep: 1,
                time: 5,
                measureStatus: 0,
            }, () => {
                this.timeRun()
            })

        } else {
            this.setState({
                measureWayModal:false,
                measureModal: true
            })
        }

    }

    beginMeasure = () => {
        let { hintCheck } = this.state;
        if (hintCheck) {
            setLocal('bp-hint', true)
        }
        this.setState({
            measureStep: 1,
            time: 5,
            measureStatus: 0
        }, () => {
            this.timeRun()
        })


    }


    //引导测量倒计时
    timeRun = () => {
        let { time } = this.state
        clearInterval(this.timer)
        this.timer = setInterval(() => {
            if (time === 0) {
                clearInterval(this.timer)
                this.setState({
                    measureStatus: 1
                })
            } else {
                time--;
                this.setState({
                    time
                })
            }
        }, 1000)
    }

    //完成引导倒计时，检查数据
    handleCheckData = () => {
        let { userId, planId, currentBp } = this.state
        this.setState({
            measureStep: 0,
            measureModal: false
        })

        this.getTodayBpRecord({
            userId,
            planId
        }, data => {
            let {
                morningBpRecord = {},
                nightBpRecord = {},
            } = data
            if (currentBp === 0) {
                if (!(morningBpRecord.systolicPressure && morningBpRecord.diastolicPressure)) {
                    //晨起血压无数值
                    morningBpRecord = { ...this.state.morningBpRecord, ...morningBpRecord, checkNone: true }
                }
                this.setState({
                    morningBpRecord
                })
            } else if (currentBp === 1) {
                if (!(nightBpRecord.systolicPressure && nightBpRecord.diastolicPressure)) {
                    //睡前血压无数值
                    nightBpRecord = { ...this.state.nightBpRecord, ...nightBpRecord, checkNone: true }
                }
                this.setState({
                    nightBpRecord
                })
            }
            this.submitTask(data)
        })
    }

    submitTask(data) {
        let { userId, planId, taskType } = this.state
        let {
            morningBpRecord = {},
            nightBpRecord = {},
        } = data
        if ((morningBpRecord.systolicPressure && morningBpRecord.diastolicPressure) || (nightBpRecord.systolicPressure && nightBpRecord.diastolicPressure)) {
            let _taskSubmit = [];
            if (morningBpRecord.systolicPressure && morningBpRecord.diastolicPressure) {
                _taskSubmit.push({
                    achieved: `${morningBpRecord.systolicPressure}/${morningBpRecord.diastolicPressure}`
                })
            }
            if (nightBpRecord.systolicPressure && nightBpRecord.diastolicPressure) {
                _taskSubmit.push({
                    achieved: `${nightBpRecord.systolicPressure}/${nightBpRecord.diastolicPressure}`
                })
            }
            taskSubmit({
                userId,
                planId,
                taskType,
                taskSubmit: _taskSubmit
            })
        }
    }

    returnGuide = () => {
        clearInterval(this.timer)
        this.setState({
            measureStep: 0
        })
    }

    //下次不再提示check时间
    handleHintClick = () => {
        this.setState({
            hintCheck: !this.state.hintCheck
        })
    }

    handleHandInput = () => {
        let {
            planId,
            taskType
        } = this.state
        gotoPage(`/pages/home/bloodpressure/edit/index?returnPath=pages/webview/index&planId=${planId}&taskType=${taskType}`)
    }

    handleCheckHistory = () => {
        gotoPage('/pages/home/bloodpressure/index')
    }

    render() {
        let { measureWayModal, measureModal, measureStep, measureStatus, time, morningBpRecord, nightBpRecord, hintCheck } = this.state

        return <div className="bp-measure-container">
            <Modal
                className="measure-way-modal"
                visible={measureWayModal}
                transparent
                onClose={() => {
                    this.setState({
                        measureWayModal:false
                    })
                }}
                title={false}
                footer={false}
            >
                <div className="content-wrap">
                    <p onClick={this.hanldeMeasure}>我有乐心血压计</p>
                    <p onClick={this.handleHandInput}>手动输入</p>
                    <span>没有乐心血压计</span>
                </div>
            </Modal>

            <Modal
                className="bp-measure-modal"
                visible={measureModal}
                transparent
                maskClosable={false}
                title={false}
                footer={false}
            >
                {
                    measureStep === 0 ? <div className="step-one">
                        <p className="title">血压计测量测量</p>
                        <img className="bg" />
                        <div className="guide-list">
                            1. 静坐5分钟后开始测量，如上图所示<br />
                            2. 建议测量2次以上，取平均值记录；
                        </div>
                        <button className="begin-btn" onClick={this.beginMeasure}>我知道了，开始测量</button>
                        <div className="hint" onClick={this.handleHintClick}><span className="check-box">{hintCheck ? <b>√</b> : null}</span>下次不再提示</div>
                    </div> : null
                }
                {
                    measureStep === 1 ? <div className="step-two">
                        <p className="guide-btn" onClick={this.returnGuide}>操作指引</p>
                        <Loading />
                        <p className="time-run">{time}s</p>
                        <p className="hint">请取出血压计，开始测量</p>
                        {
                            measureStatus === 0 ? <p className="measuring-text">测量中，请稍后…</p> : null
                        }
                        {
                            measureStatus === 1 ? <button className="done-btn" onClick={this.handleCheckData}>完成测量，查看数据</button> : null
                        }
                    </div> : null
                }
            </Modal>

            {
                [morningBpRecord, nightBpRecord].map((item, index) => {
                    return <div key={index} className="card">
                        <p className="title">{item.name}</p>
                        {
                            !(item.systolicPressure && item.diastolicPressure) ? <>
                                <p className="recomend-time">推荐测量时间：{item.recomendTime}</p>

                            </> : null
                        }

                        {
                            !(item.systolicPressure && item.diastolicPressure) && !item.checkNone ? <>
                                <div className={'icon ' + (index === 0 ? 'day' : 'night')}></div>
                            </> : null
                        }

                        {
                            (!(item.systolicPressure && item.diastolicPressure)) && item.checkNone ? <div className="info-none">未获取到您的血压数据 <span onClick={this.handleHandInput}>手动输入</span></div> : null
                        }

                        {
                            item.systolicPressure && item.diastolicPressure ? <>
                                <p className="measure-time">{item.measurementDate}</p>
                                <div className="info">
                                    <p className="bp">{item.systolicPressure}/{item.diastolicPressure}<span className="unit">mmHG</span></p>
                                    <p className="heart">{item.heartRate}<span className="unit">mbp</span></p>
                                    <p className="status danger">{item.levelName}</p>
                                </div>
                            </> : null
                        }

                        {
                            !(item.systolicPressure && item.diastolicPressure) ? <button className="measure-btn" onClick={this.handleOpenMeasureWay.bind(this, index)}>去测量</button> : null
                        }
                        <p className="check-history" onClick={this.handleCheckHistory}>查看近期血压数据&gt;&gt;</p>
                    </div>
                })
            }
        </div >
    }
}

