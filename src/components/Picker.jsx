import React, { Component } from 'react'
import { PickerView } from 'antd-mobile'
import './styles/picker.less'

class Picker extends Component {
    state = {
        value: [],
        pickerItemHeight: 51,
        pickerHeight: 153
    };

    componentDidMount() {
        this.setState({
            value:this.props.data
        })
    }

    handleCancle = () => {
        // this.setState({
        //     // value:[]
        // })

        this.props.cancle()
    }

    handleSave = () => {
        this.props.save(this.state.value)
    }

    handleChange = (val) => {
        this.setState({
            value: val
        })
    }


    render() {
        let {
            title,
            prefixCls,
            rangedata
        } = this.props

        let {
            pickerItemHeight,
            pickerHeight
        } = this.state


        return <div className="pickerview-wrap">
            <div className="mask"></div>
            <div className="ls-picker-wrap">
                <div className="top">
                    <p onClick={this.handleCancle} style={{
                        color: '#999'
                    }}>取消</p>
                    <p className="title">{title}</p>
                    <p onClick={this.handleSave}>保存</p>
                </div>
                <div className={`picker-wrap ${prefixCls}-wrap`} style={{ height: `${pickerHeight}px` }}>
                    <PickerView
                        onChange={this.handleChange.bind(this)}
                        // onScrollChange={this.onScrollChange}
                        value={this.state.value}
                        prefixCls={`ls-picker ${prefixCls}`}
                        data={rangedata}
                        cascade={false}
                        itemStyle={{ height: `${pickerItemHeight}px`, lineHeight: `${pickerItemHeight}px` }}
                        indicatorStyle={{ height: `${pickerItemHeight}px` }}
                    />
                    {
                        this.props.children
                    }    
                </div>
            </div>
        </div>
    }
}

export default Picker