import React from 'react'
import QuestionCard from '../components/Question.jsx'
import { upperCaseChars, queryUrlParam } from '@/utils'
import { getResourceByInstanceId, taskSubmit } from '@/apis/taskplanning_service'
import { getPagesInfo } from '@/apis/commons_rest'
import { HEALTHPLAN_RESOURCETYPE } from '@/utils/enum'
import { JSDOM } from 'jsdom';

import './styles/index.less'

const _upperCaseChars = upperCaseChars()

export default class Course extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            questionDone: false,
            pages: {
                title: '',
                // author: 'XXXX',
                // origin: 'XXXX',
                content: ''
            },
            questionList: []
        }
    }


    componentWillMount() {
        let userId = queryUrlParam(this.props.location.search, 'userId')
        let courseId = queryUrlParam(this.props.location.search, 'courseId')
        let articleId = queryUrlParam(this.props.location.search, 'articleId')
        let planId = queryUrlParam(this.props.location.search, 'planId')
        let taskId = queryUrlParam(this.props.location.search, 'taskId')
        console.log(this.props.location.search)
        this.setState({
            userId,
            courseId,
            articleId,
            planId,
            taskId
        })
        this.getResourceByInstanceId({
            userId,
            courseId,
            planId,
            taskId
        })

        this.getPagesInfo(articleId)
    }

    componentDidMount() {
        document.title = '患教'
    }


    async getResourceByInstanceId({
        userId,
        courseId,
        planId,
        taskId
    }) {
        let res = await getResourceByInstanceId({
            userId,
            target: courseId,
            planId,
            taskId
        })

        let selectedAnswer = res.data ? res.data.userSubmit : null
        if (res.data && res.data.colValMap) {
            let data = res.data.colValMap
            let questionList = [
                {
                    title: data.question,
                    answerList: [
                        {
                            text: data.option1,
                            key: 'option1'
                        },
                        {
                            text: data.option2,
                            key: 'option2'
                        },
                        {
                            text: data.option3,
                            key: 'option3'
                        },
                        {
                            text: data.option4,
                            key: 'option4'
                        }
                    ],
                    selectedAnswer,
                    rightAnswer: data.rightanswer,
                    analyze: data.analyze
                }
            ]
            this.setState({
                questionList,
                questionDone: selectedAnswer ? true : false
            })

        }

    }

    async getPagesInfo(id) {
        let res = await getPagesInfo(id)
        if (res.data) {
            try {
                let { title, content, author, origin } = res.data;
                let html = new JSDOM(content)
                content = html.window.document.querySelector('.info-content').innerHTML;
                let pages = {
                    title,
                    content,
                    // author,
                    // origin
                }
                this.setState({
                    pages
                })
            } catch (e) {

            }
        }
    }

    scrollToAnchor = (anchorName) => {
        if (anchorName) {
            // 找到锚点
            let anchorElement = document.getElementById(anchorName);
            // 如果对应id的锚点存在，就跳转到锚点
            if (anchorElement) { anchorElement.scrollIntoView({ block: 'start', behavior: 'smooth' }); }
        }
    }


    handleSelectQuestion = (questionInd, answerKey) => {
        let { userId, planId, taskId, questionList, courseId } = this.state;
        questionList[questionInd].selectedAnswer = answerKey
        this.setState({
            questionList: questionList.concat([]),
            questionDone: true
        })
        let _taskSubmit = [{ taskId, achieved: courseId, addition: answerKey }]
        taskSubmit({
            userId,
            planId,
            taskSubmit: _taskSubmit
        })
    }


    render() {
        let { pages, questionList, questionDone } = this.state

        return <div className='course-container'>
            <div className="pages">
                <p className="title">{pages.title}</p>
                <div className="content" dangerouslySetInnerHTML={{ __html: pages.content }}></div>
                {/* <p className="copy"><span>版权声明版权声明版权声明，来源于{pages.origin}，作者{pages.author}</span></p> */}
            </div>
            <div id="questions">
                <p className="question-title">健康问答</p>
                <div className="list">
                    {
                        questionList.map((item, index) => {
                            return <QuestionCard key={index} selectQuestion={key => this.handleSelectQuestion(index, key)} questionDone={questionDone} data={item}></QuestionCard>
                        })
                    }
                </div>
            </div>
            {
                !questionDone ? <button className="question-btn" onClick={this.scrollToAnchor.bind(this, 'questions')}>去答题</button> : null
            }
        </div>
    }


}