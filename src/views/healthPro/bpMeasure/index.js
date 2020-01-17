import React from 'react'
import { Modal } from 'antd-mobile'
import { gotoPage, setLocal, getLocal, queryUrlParam } from '@/utils'
import { todayBpRecord, taskSubmit } from '@/apis/taskplanning_service'
import Loading from '@/views/layout/loading'
import moment from 'moment'
import './styles/index.less'

export default class Measure extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            hintCheck: false,//下次不再提示check标识
            measureWayModal: false,//测量方式弹窗标识
            measureModal: false,//测量引导弹窗标识
            measureStep: 0, //测量引导状态0-未开始 1-进行中
            measureStatus: 0,//测量的进度 0-进行中 1-完成
            time: 60, //测量引导时间倒计时
            morningBpRecord: {
                name: '晨起血压测量',
                recomendTime: '6:00-10:00'
            },
            nightBpRecord: {
                name: '睡前血压测量',
                recomendTime: '20:00-24:00'
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

        this.runBpTimer({
            userId,
            planId
        })
    }

    componentDidMount() {
        document.title = '测量'
    }


    componentWillUnmount() {
        clearInterval(this.timer)
        clearInterval(this.bpTimer)
    }

    runBpTimer({ userId, planId }) {
        //首次触发
        this.getTodayBpRecord({
            userId,
            planId
        })

        clearInterval(this.bpTimer);
        this.bpTimer = setInterval(() => {
            this.getTodayBpRecord({
                userId,
                planId
            })
        }, 3000)
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
                    morningBpRecord = {
                    },
                    nightBpRecord = {
                    },
                } = data
                morningBpRecord.measurementDate = moment(morningBpRecord.measurementDate).format('YYYY.MM.DD HH:mm')
                if (morningBpRecord.systolicPressure && morningBpRecord.diastolicPressure) {
                    morningBpRecord = { ...this.state.morningBpRecord, ...morningBpRecord }
                } else {
                    morningBpRecord = {
                        ...{
                            name: '晨起血压测量',
                            recomendTime: '6:00-10:00'
                        },
                        ...morningBpRecord
                    }
                }

                if (nightBpRecord.systolicPressure && nightBpRecord.diastolicPressure) {
                    nightBpRecord = { ...this.state.nightBpRecord, ...nightBpRecord }
                } else {
                    nightBpRecord = {
                        ...{
                            name: '睡前血压测量',
                            recomendTime: '20:00-24:00'
                        },
                        ...nightBpRecord
                    }
                }
                this.setState({
                    loading: false,
                    morningBpRecord,
                    nightBpRecord: { ...this.state.nightBpRecord, ...nightBpRecord },
                })
                callback && callback(data)
            } else {
                this.setState({
                    loading: false
                })
            }
        } catch (e) {
            callback && callback({})
            this.setState({
                loading: false
            })
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
                measureWayModal: false,
                measureModal: true,
                measureStep: 1,
                time: 60,
                measureStatus: 0,
            }, () => {
                this.timeRun()
            })

        } else {
            this.setState({
                measureWayModal: false,
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
            time: 60,
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
                } else {
                    morningBpRecord = { ...this.state.morningBpRecord, ...morningBpRecord, checkNone: false }
                }
                this.setState({
                    morningBpRecord
                })
            } else if (currentBp === 1) {
                if (!(nightBpRecord.systolicPressure && nightBpRecord.diastolicPressure)) {
                    //睡前血压无数值
                    nightBpRecord = { ...this.state.nightBpRecord, ...nightBpRecord, checkNone: true }
                } else {
                    nightBpRecord = { ...this.state.nightBpRecord, ...nightBpRecord, checkNone: false }
                }
                this.setState({
                    nightBpRecord
                })
            }
            // this.submitTask(data)
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
        this.setState({
            measureWayModal: false
        })
        gotoPage(`/pages/home/bloodpressure/edit/index?returnPath=pages/webview/index`)
    }

    handleCheckHistory = () => {
        gotoPage('/pages/home/bloodpressure/index')
    }

    render() {
        let { loading, measureWayModal, measureModal, measureStep, measureStatus, time, morningBpRecord, nightBpRecord, hintCheck } = this.state

        return !loading ? <div className="bp-measure-container">

            <Modal
                className="measure-way-modal"
                visible={measureWayModal}
                transparent
                onClose={() => {
                    this.setState({
                        measureWayModal: false
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
                // onClose={() => {
                //     this.setState({
                //         measureModal: false
                //     })
                // }}
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
                        <div className="hint" onClick={this.handleHintClick}><span className={'check-box' + (hintCheck ? ' check' : '')}></span>下次不再提示</div>
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
                return <div key={index} className={'card ' + (index ? 'night' : 'morning')}>
                    <p className="title">{item.name}</p>
                    {
                        !(item.systolicPressure && item.diastolicPressure) || item.status === 4 ? <>
                            <p className="recomend-time">推荐测量时间：{item.recomendTime}</p>

                        </> : null
                    }

                    {
                        item.status === 4 ? <div className="info-out-time">今日晨测错过啦，请明日再来</div> : <>
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
                                        <p className="bp">{item.systolicPressure}/{item.diastolicPressure}<span className="unit">mmHg</span></p>
                                        <p className="heart"><span className="heart-icon"></span>{item.heartRate}<span className="unit">mbp</span></p>
                                        <p className={'status' + (item.level != 2 && item.level != 3 ? ' abnormal' : '')}>{item.levelName}</p>
                                    </div>
                                </> : null
                            }
                        </>
                    }
                    {
                        !(item.systolicPressure && item.diastolicPressure) || item.status === 4 ? <button className="measure-btn" onClick={this.handleOpenMeasureWay.bind(this, index)}>去测量</button> : null
                    }
                    <p className="check-history" onClick={this.handleCheckHistory}>查看近期血压数据&gt;&gt;</p>
                </div>
            })
        }
        </div > : null
    }
}

