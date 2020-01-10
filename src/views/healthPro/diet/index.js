import React from 'react'
import QuestionCard from '../components/Question.jsx'
import './styles/index.less'
import { upperCaseChars, queryUrlParam } from '@/utils'
import { getResourceByInstanceId } from '@/apis/taskplanning_service'
import { HEALTHPLAN_RESOURCETYPE } from '@/utils/enum'

const _upperCaseChars = upperCaseChars()

export default class Diet extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            mainFood: "",
            foodImg: "",
            foodDesc: "",
            recomendFoodList: [],
            questionDone: false,
            questionList: []
        }
    }

    componentWillMount() {
        let userId = queryUrlParam(this.props.location.search, 'userId')
        let dietId = queryUrlParam(this.props.location.search, 'dietId')
        this.getResourceByInstanceId({
            userId,
            dietId
        })
    }

    componentDidMount() {
        document.title = '饮食'
    }

    async getResourceByInstanceId({
        userId,
        dietId
    }) {

        let res = await getResourceByInstanceId({
            userId,
            resourceType: HEALTHPLAN_RESOURCETYPE.DIET,
            target: dietId,
        })

        let { data } = res;
        if (data) {
            let recomendFoodList = [
                {
                    name: data.recommendDealA,
                    image: data.dealImgA
                },
                {
                    name: data.recommendDealB,
                    image: data.dealImgB
                }
            ]
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
                    analyze:data.analyze
                }
            ]
            this.setState({
                mainFood: data.mainFood,
                foodImg: data.foodImg,
                foodDesc: data.foodDesc,
                recomendFoodList,
                questionList
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
        let { userId, planId, taskType, questionList, dietId } = this.state;
        questionList[questionInd].seletedAnswer = answer
        this.setState({
            questionList: questionList.concat([]),
            questionDone: true
        })

        let _taskSubmit = [{ achieved: dietId }]
        // taskSubmit({
        //     userId,
        //     planId,
        //     taskType,
        //     taskSubmit:_taskSubmit
        // })
    }


    render() {
        let { pages, questionList, questionDone, mainFood, foodImg, foodDesc, recomendFoodList } = this.state

        return <div className='diet-container'>
            <div className="top">
                <div className="recomend-food">
                    <img className="bg" src={foodImg} />
                    <div className="detail">
                        <div className="tag">推荐食材</div>
                        <p className="name">{mainFood}</p>
                        <div className="desc">{foodDesc}</div>
                    </div>
                </div>
                <div className="recomend-food-list">
                    <p className="tag">推荐菜</p>
                    <div className="list">
                        {
                            recomendFoodList.map((item, index) => {
                                return <div key={index} className="food-card">
                                    <img src={item.image} />
                                    <p className="name">{item.name}</p>
                                </div>
                            })
                        }
                    </div>
                </div>
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