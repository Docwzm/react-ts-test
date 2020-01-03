import React, { useState, useEffect } from 'react'
import { gotoPage } from '@/utils'
const wx = window.wx

export default function Measure(props) {

    const [wakeUpBp, setWakeUpBp] = useState({

    })
    const [sleepBeforeBp, setSleepBeforeBp] = useState({

    })


    const handleTest = () => {
        gotoPage('/pages/home/bloodpressure/edit/index?returnPath=pages/webview/index')
    }

    console.log('../..../show')


    useEffect(() => {
        document.title = '测量'
        // console.log(wx.miniProgram)
        // wx.miniProgram.getEnv(function (res) {
        //     console.log(res.miniprogram) // true
        // })
    }, [])

    return <div className="bp-measure-container">
        {
            [wakeUpBp, sleepBeforeBp].map(item => {
                return ''
            })
        }
        measure
        <button onClick={handleTest}>test</button>
    </div>
}

