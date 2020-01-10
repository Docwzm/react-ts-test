import React from 'react';
import { Icon } from 'antd-mobile'
import { upperCaseChars } from '@/utils'
import './styles/questionCard.less'

const _upperCaseChars = upperCaseChars()

export default class QuestionCard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    componentDidMount() {

    }

    
    handleClickQuestion = (text) => {
        this.props.selectQuestion(text)
    }

    render() {
        const { data,questionDone } = this.props
        let rightAnswerChars = _upperCaseChars[data.answerList.findIndex(item => item.text === data.rightAnswer)]
        console.log(data)
        console.log(data.answerList.findIndex(item => item.text === data.rightAnswer))
        const AnswerContent = (props) => {
            const {
                ind
            } = props;
            let _item = data.answerList[ind]

            if (!questionDone) {
                return <p onClick={this.handleClickQuestion.bind(this, _item.text)}>
                    <span>{_upperCaseChars[ind]}. {_item.text}</span>
                </p>
            } else {
                if (data.rightAnswer === _item.text) {
                    return <p className="active">
                        <span>{_upperCaseChars[ind]}. {_item.text}</span>
                        <Icon type="check" color="#6F6DFD"></Icon>
                    </p>
                } else {
                    if (data.seletedAnswer !== data.rightAnswer && data.seletedAnswer === _item.text) {
                        return <p className="error">
                            <span>{_upperCaseChars[ind]}. {_item.text}</span>
                            <Icon type="cross" color="#FD726F"></Icon>
                        </p>
                    } else {
                        return <p>
                            <span>{_upperCaseChars[ind]}. {_item.text}</span>
                        </p>
                    }
                }
            }
        }

        return <div className="question-card">
            <p className="title">{data.title}</p>
            <div className="answer-list">
                {
                    data.answerList.map((_item, _index) => {
                        return <AnswerContent key={_index} ind={_index}></AnswerContent>
                    })
                }
            </div>
            {
                questionDone ? <>
                    <div className="right-answer">
                        <p className="tag">正确答案：{rightAnswerChars}. {data.rightAnswer}</p>
                        <p className="desc">{data.analyze}</p>
                    </div>
                    {/* <button className="share-btn">分享给好友</button> */}
                </> : null
            }
        </div>
    }
}