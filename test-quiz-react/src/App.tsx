/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import './App.css'
// import { of, map } from 'rxjs'
// import quizAPI from './services/quiz-service'
import questionsJSON from '../questions.json' // Questions from the-trivia-api
import { useEffect, useState } from 'react'
import { shuffle, random } from 'lodash'
import dayjs from 'dayjs'

export interface Questions {
  category: string
  correctAnswer: string
  difficulty: string
  id: string
  incorrectAnswers: string[]
  isNiche: boolean
  question: { text: string },
  regions: any[]
  tags: string[]
  type: string
  answers: string[]
  myAnswer: string
}

function App() {
  // const [questions, setQuestion] = useState<Questions[]>([])

  const [currentQuestion, setCurrentQuestion] = useState<Questions | null>(null)
  const [countAnswered, setCountAnswered] = useState<number>(0)

  const [isSuccess, setIsSuccess] = useState<boolean>(false)

  const [oldQuestions, setOldQuestions] = useState<Pick<Questions, 'id' | 'myAnswer'>[]>([])
  const [dashboards, setDashboards] = useState<any[]>([])

  const initQuestion = () => {
    const oldAnswered: Pick<Questions, 'id' | 'myAnswer'>[] = localStorage.getItem('answeredQuestions') ? JSON.parse(localStorage.getItem('answeredQuestions') || "") : []
    if (oldAnswered.length === questionsJSON.length) {
      restartQuestion()
      return
    }

    setDashboards(localStorage.getItem('dashboard') ? JSON.parse(localStorage.getItem('dashboard') || "") : [])
    setOldQuestions(oldAnswered)
    setCountAnswered(oldAnswered.length)
    const questionIdAnswered = () => {
      return oldAnswered.map((val: Pick<Questions, 'id' | 'myAnswer'>) => val.id)
    }

    const shuffleQuestions: Questions[] = shuffle(questionsJSON).filter((val) => !questionIdAnswered().includes(val.id)).map((val) => {
      return {
        ...val,
        answers: shuffle([...val.incorrectAnswers, val.correctAnswer]),
        myAnswer: '',
      }
    })
    // setQuestion(shuffleQuestions)


    if (shuffleQuestions.length > 0) {
      setCurrentQuestion(shuffleQuestions[random(0, shuffleQuestions.length - 1)])
    }


  }

  useEffect(() => {
    console.log(questionsJSON)
    initQuestion()
  }, []);

  useEffect(() => {
    localStorage.setItem('dashboard', JSON.stringify(dashboards))
  }, [dashboards])

  useEffect(() => {
    localStorage.setItem('answeredQuestions', JSON.stringify(oldQuestions));
  }, [oldQuestions])

  const onClickAnswer = (ans: string) => {
    // setAnsweredQuestions(answeredQuestions, currentQuestion)
    setOldQuestions([
      ...oldQuestions,
      {
        id: currentQuestion?.id || '',
        myAnswer: ans,
      },
    ])


    if (countAnswered + 1 === 20) {
      setIsSuccess(true)
      setDashboards([
        ...dashboards,
        {
          timestamp: new Date(),
          score: calculateTotalScore()
        }
      ])
    } else {
      initQuestion()
    }
    setCountAnswered(countAnswered + 1)
  }

  const calculateTotalScore = () => {
    let sumScore = 0;
    if (oldQuestions) {
      oldQuestions.forEach((ans) => {
        const findQuestion = questionsJSON.find((val) => val.id === ans.id)
        if (findQuestion && ans.myAnswer === findQuestion.correctAnswer) {
          sumScore = sumScore + 1
        }
      })
    }

    return sumScore
  }

  const restartQuestion = () => {
    localStorage.removeItem('answeredQuestions')
    initQuestion()

    setCountAnswered(0)
    setIsSuccess(false)
  }

  return (
    <div className='flex justify-between gap-24 px-24'>
      <div className='w-[64vw]'>
        {(
          isSuccess ?
            <div>
              <div>Your scored {calculateTotalScore()} of {questionsJSON.length}</div>
              <div>{calculateTotalScore()}</div>
              <div className="font-bold text-lg text-yellow-500 cursor-pointer" onClick={restartQuestion}>เริ่มเล่นใหม่</div>
            </div>
            :
            <div className="">
              <div>{countAnswered + 1} / {questionsJSON.length}</div>
              <div className='font-bold text-2xl'>{currentQuestion?.question?.text}</div>
              <hr className="my-6" />
              <div className="flex flex-col">
                {
                  currentQuestion?.answers.map((ans, index) => {
                    return (
                      <div
                        className='bg-gray-100 p-8 my-4 hover:bg-yellow-300 hover:cursor-pointer font-semibold' key={index}
                        onClick={() => onClickAnswer(ans)}
                      >
                        {ans}
                      </div>
                    )
                  })
                }
              </div>
            </div>
        )}
      </div>
      <div className='w-[64vw]'>
        <div className='font-bold text-xl'>Dashboard</div>
        <div className="flex flex-col mt-4">
          {dashboards.map((dashboard: any) => {
            return (
              <div>
                {dashboard.timestamp ? dayjs(dashboard.timestamp).format('DD/MM/YYYY HH:mm:ss') : ''} : {dashboard.score}/{questionsJSON.length}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default App