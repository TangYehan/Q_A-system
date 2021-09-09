import {useEffect, ReactElement, useState, useRef} from 'react'
import Taro, {useReachBottom} from '@tarojs/taro'

import httpUtil from '../../../../utils/request'
import {View, Input, Image} from '@tarojs/components'
import LoadMore from '../../../../components/LoadMore'
import QuestionCard from '../../../../components/QuestionCard'
import Switch from '../../components/Switch'

import './index.scss'

export default function index(): ReactElement {
  const initPageInfo = {
    currentPage: 1,
    pageSize: 7,
    totalPages: 0,
    totalRows: 0
  }

  const [typeValue, setTypeValue] = useState(0)
  const [pageInfo, setPageInfo] = useState(initPageInfo)
  const [questionList, setQuestionList] = useState<any>([])
  const [input, setInput] = useState('')
  const timer = useRef<undefined | NodeJS.Timeout>(undefined)
  const subjectInfo = useRef<any>(null)

  useEffect(() => {
    const router = Taro.getCurrentInstance().router
    if (router) {
      let {subjectId, subjectName} = router.params
      Taro.setNavigationBarTitle({
        title: subjectName as string
      })
      const {currentPage, pageSize} = pageInfo
      subjectInfo.current = {
        subjectId:
          String(subjectId) === 'undefined'
            ? Number(subjectId)
            : String(subjectId),
        subjectName
      }
      const data =
        String(subjectId) === 'undefined'
          ? {subjectName, state: typeValue, currentPage, pageSize}
          : {subjectId, state: typeValue, currentPage, pageSize}
      getQuestionList({data})
    }
  }, [])

  useReachBottom(() => {
    const {currentPage, pageSize, totalPages} = pageInfo
    const {subjectId, subjectName} = subjectInfo.current
    if (currentPage < totalPages) {
      const data = input
        ? subjectId === 'undefined'
          ? {
              subjectName,
              state: typeValue,
              currentPage: currentPage + 1,
              pageSize,
              keyWords: input
            }
          : {
              subjectId,
              state: typeValue,
              currentPage: currentPage + 1,
              pageSize,
              keyWords: input
            }
        : subjectId === 'undefined'
        ? {
            subjectName,
            state: typeValue,
            currentPage: currentPage + 1,
            pageSize
          }
        : {subjectId, state: typeValue, currentPage: currentPage + 1, pageSize}
      getQuestionList({data})
    }
  })

  const changeType = value => {
    const {subjectId, subjectName} = subjectInfo.current
    value = value ? 1 : 0
    setTypeValue(value)
    const data = input
      ? subjectId == 'undefined'
        ? {
            subjectName,
            state: value,
            currentPage: 1,
            pageSize: 7,
            keyWords: input
          }
        : {
            subjectId,
            state: value,
            currentPage: 1,
            pageSize: 7,
            keyWords: input
          }
      : subjectId == 'undefined'
      ? {subjectName, state: value, currentPage: 1, pageSize: 7}
      : {subjectId, state: value, currentPage: 1, pageSize: 7}
    getQuestionList({data, clear: true})
  }

  const searchInput = e => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      const value = e.detail.value.trim()
      setInput(value)
      const {subjectId, subjectName} = subjectInfo.current
      const data = value
        ? subjectId == 'undefined'
          ? {
              state: typeValue,
              currentPage: 1,
              pageSize: 7,
              keyWords: value,
              subjectName
            }
          : {
              subjectId,
              state: typeValue,
              currentPage: 1,
              pageSize: 7,
              keyWords: value
            }
        : subjectId == 'undefined'
        ? {subjectName, state: typeValue, currentPage: 1, pageSize: 7}
        : {subjectId, state: typeValue, currentPage: 1, pageSize: 7}
      getQuestionList({data, clear: true})
    }, 300)
  }

  const getQuestionList = ({data, clear = false}) => {
    httpUtil
      .getQuestionList(data)
      .then(res => {
        if (res.code !== 1) return Promise.reject('获取失败')
        setPageInfo(JSON.parse(JSON.stringify(res.data.pageInfo)))
        clear
          ? setQuestionList([...res.data.list])
          : setQuestionList([...questionList, ...res.data.list])
      })
      .catch(err => {
        Taro.showToast({
          title: String(err),
          icon: 'none'
        })
      })
  }

  return (
    <View className='question_list_page'>
      <View className='search_box'>
        <View className='search_box_left'>
          <Image src='/img/common/search.svg' className='search_icon'></Image>
          <Input
            type='text'
            className='search_ipt'
            placeholder='搜索问题'
            onInput={searchInput}
          />
        </View>
        <Switch
          openText='已解'
          closeText='未解'
          onChange={changeType}
          value={typeValue}
        />
      </View>
      {questionList.map((item: any) => (
        <QuestionCard
          msg={item}
          key={'question_list_page' + item.question.questionId}
        />
      ))}
      <LoadMore loading={pageInfo.currentPage < pageInfo.totalPages} />
    </View>
  )
}
