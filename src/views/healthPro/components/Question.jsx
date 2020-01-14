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

    
    handleClickQuestion = (key) => {
        this.props.selectQuestion(key)
    }

    render() {
        const { data,questionDone } = this.props
        let rightAnswerIndex = data.answerList.findIndex(item => item.key === data.rightAnswer)
        console.log(data.rightAnswer)
        console.log(rightAnswerIndex)
        let rightAnswerChars = _upperCaseChars[rightAnswerIndex]
        let rightAnswerText = data.answerList[rightAnswerIndex].text

        const AnswerContent = (props) => {
            const {
                ind
            } = props;
            let _item = data.answerList[ind]

            if (!questionDone) {
                return <p onClick={this.handleClickQuestion.bind(this, _item.key)}>
                    <span>{_upperCaseChars[ind]}. {_item.text}</span>
                </p>
            } else {
                if (data.rightAnswer === _item.key) {
                    return <p className="active">
                        <span>{_upperCaseChars[ind]}. {_item.text}</span>
                        <Icon type="check" color="#6F6DFD"></Icon>
                    </p>
                } else {
                    if (data.selectedAnswer !== data.rightAnswer && data.selectedAnswer === _item.key) {
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
                        <p className="tag">正确答案：{rightAnswerChars}. {rightAnswerText}</p>
                        <p className="desc">{data.analyze}</p>
                    </div>
                    {/* <button className="share-btn">分享给好友</button> */}
                </> : null
            }
        </div>
    }
}