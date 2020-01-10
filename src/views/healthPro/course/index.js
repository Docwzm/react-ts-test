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
                content: ''
            },
            questionList: []
        }
    }


    componentWillMount() {
        let userId = queryUrlParam(this.props.location.search, 'userId')
        let courseId = queryUrlParam(this.props.location.search, 'courseId')
        this.setState({
            userId,
            courseId
        })
        this.getResourceByInstanceId({
            userId,
            courseId
        })
        
        this.getPagesInfo('1266')
    }

    componentDidMount() {
        document.title = '患教'
    }


    async getResourceByInstanceId({
        userId,
        courseId
    }) {

        let res = await getResourceByInstanceId({
            userId,
            resourceType: HEALTHPLAN_RESOURCETYPE.COURSE,
            target: courseId,
        })

        let { data } = res;
        if (data) {
            let questionList = [
                {
                    title: data.question,
                    answerList: [
                        {
                            text: data.options1
                        },
                        {
                            text: data.options2
                        },
                        {
                            text: data.options3
                        },
                        {
                            text: data.options4
                        }
                    ],
                    seletedAnswer: data.seletedAnswer,
                    rightAnswer: data['options4'],
                    analyze: data.analyze
                }
            ]
            this.setState({
                questionList
            })

            // this.getPagesInfo('1266')
        }

    }

    async getPagesInfo(id) {
        let res = await getPagesInfo(id)
        if (res.data) {
            let { title, content } = res.data;
            let html = new JSDOM(content)
            content = html.window.document.querySelector('.info-content').innerHTML;
            let pages = {
                title,
                content
            }
            this.setState({
                pages
            })
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


    handleSelectQuestion = (questionInd, answer) => {
        let { userId, planId, taskType, questionList, courseId } = this.state;
        questionList[questionInd].seletedAnswer = answer
        this.setState({
            questionList: questionList.concat([]),
            questionDone: true
        })

        let _taskSubmit = [{ achieved: courseId }]
        // taskSubmit({
        //     userId,
        //     planId,
        //     taskType,
        //     taskSubmit:_taskSubmit
        // })
    }


    render() {
        let { pages, questionList, questionDone } = this.state

        return <div className='course-container'>
            <div className="pages">
                <p className="title">{pages.title}</p>
                <div className="content" dangerouslySetInnerHTML={{ __html: pages.content }}></div>
                <p className="copy"><span>版权声明版权声明版权声明，来源于XXXX，作者XXXX</span></p>
            </div>
            <div id="questions">
                <p className="question-title">健康问答</p>
                <div className="list">
                    {
                        questionList.map((item, index) => {
                            return <QuestionCard key={index} selectQuestion={(text) => this.handleSelectQuestion(index, text)} questionDone={questionDone} data={item}></QuestionCard>
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