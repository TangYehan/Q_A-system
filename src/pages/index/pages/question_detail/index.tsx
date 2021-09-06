import React, {useEffect, ReactElement, useState, useRef} from 'react'
import Taro, {useReachBottom, usePullDownRefresh} from '@tarojs/taro'
import {connect} from 'react-redux'

import httpUtil from '../../../../utils/request'
import {View, Navigator} from '@tarojs/components'
import LoadMore from '../../../../components/LoadMore'
import QuestionDetailCard from '../../components/QuestionDetailCard'
import ThemeButton from '../../../../components/ThemeButton'
import AnswerCard from '../../components/AnswerCard'

import './index.scss'
import '../../../../img/operate/iconfont.css'

function QuestionDetail(props: {accountId: string | number}): ReactElement {
  const initPageInfo = {
    currentPage: 0,
    totalPages: 1,
    pageSize: 6,
    totalRows: 0
  }

  const [questionDetail, SetQuestionDetail] = useState<any>({})
  const [isCollection, setIsCollection] = useState(false)
  const [answerListType, setAnswerListType] = useState(1) //0最新 1最热
  const [currentAnswerList, setCurrentAnswerList] = useState<any>([])
  const [pageInfo, setPageInfo] = useState(initPageInfo)
  const hotAnswerList = useRef<any>([])
  const newAnswerList = useRef<any>([])
  const _questionId = useRef<any>(undefined)

  useEffect(() => {
    const router = Taro.getCurrentInstance().router
    if (router) {
      const {questionId} = router.params
      _questionId.current = questionId
      const data = {accountId: 1662901, questionId}
      const data2 = {
        questionId: _questionId.current,
        currentPage: pageInfo.currentPage,
        pageSize: pageInfo.pageSize,
        accountId: 1662901,
        sortOrder: answerListType
      }
      getQuestionDetail(data)
      getAnswerList(data2)
    }
  }, [])

  useReachBottom(() => {
    if (pageInfo.currentPage < pageInfo.totalPages) {
      const data = {
        questionId: _questionId.current,
        currentPage: pageInfo.currentPage + 1,
        pageSize: pageInfo.pageSize,
        accountId: 1662901,
        sortOrder: answerListType
      }
      getAnswerList(data)
    }
  })

  usePullDownRefresh(() => {
    const data = {accountId: 1662901, questionId: _questionId.current}
    const data2 = {
      questionId: _questionId.current,
      currentPage: pageInfo.currentPage,
      pageSize: pageInfo.pageSize,
      accountId: 1662901,
      sortOrder: answerListType
    }
    getQuestionDetail(data)
    newAnswerList.current = []
    hotAnswerList.current = []
    getAnswerList(data2)
    Taro.stopPullDownRefresh()
  })

  const answerTypeChange = () => {
    const newType = !answerListType ? 1 : 0
    setAnswerListType(newType)
    if (!newType) {
      if (newAnswerList.current.length !== 0)
        setCurrentAnswerList([...newAnswerList.current])
      else {
        console.log(hotAnswerList, newAnswerList)
        const data = {
          questionId: _questionId.current,
          currentPage: 1,
          pageSize: initPageInfo.pageSize,
          accountId: 1662901,
          sortOrder: newType
        }
        getAnswerList(data)
      }
    } else {
      if (hotAnswerList.current.length !== 0)
        setCurrentAnswerList([...hotAnswerList.current])
      else {
        const data = {
          questionId: _questionId.current,
          currentPage: 1,
          pageSize: initPageInfo.pageSize,
          accountId: 1662901,
          sortOrder: newType
        }
        getAnswerList(data)
      }
    }
  }

  const getQuestionDetail = data => {
    httpUtil
      .getQuestionDetailById(data)
      .then(res => {
        if (res.code !== 1) return Promise.reject('获取问题详情失败')
        const isCollected = res.data.isCollected ? true : false
        setIsCollection(isCollected)
        SetQuestionDetail(JSON.parse(JSON.stringify(res.data)))
      })
      .catch(err => {
        console.log(err)
        Taro.showToast({
          title: String(err),
          icon: 'none'
        })
      })
  }

  const addIntoCollection = async () => {
    try {
      const current = !isCollection
      setIsCollection(current)
      const data = {
        accountId: 1662901,
        questionId: questionDetail.questionId
      }
      const newQuestionDetail = questionDetail
      current
        ? newQuestionDetail.collectionCount++
        : newQuestionDetail.collectionCount--
      SetQuestionDetail(newQuestionDetail)
      const res = current
        ? await httpUtil.CollectionProblem(data)
        : await httpUtil.cancelCollectionProblem(data)
      if (res.code !== 1) throw '失败啦'
    } catch (err) {
      Taro.showToast({
        title: String(err),
        icon: 'none'
      })
    }
  }

  const getAnswerList = data => {
    httpUtil.getAnswerList(data).then(res => {
      if (res.code !== 1) return Promise.reject('获取回答失败')
      if (!data.sortOrder) {
        newAnswerList.current = [
          ...newAnswerList.current,
          ...JSON.parse(JSON.stringify(res.data.list))
        ]
        setCurrentAnswerList([...newAnswerList.current])
      } else {
        hotAnswerList.current = [
          ...hotAnswerList.current,
          ...JSON.parse(JSON.stringify(res.data.list))
        ]
        setCurrentAnswerList([...hotAnswerList.current])
      }
      setPageInfo(JSON.parse(JSON.stringify(res.data.pageInfo)))
    })
  }

  const gotoAnswerDetail = (answerId, currentIndex) => {
    Taro.navigateTo({
      url: `../answer_detail/index?answerId=${answerId}&questionDetail=${encodeURIComponent(
        JSON.stringify(questionDetail)
      )}&currentPage=${currentIndex * 1 + 1}&totalRows=${
        pageInfo.totalRows
      }&sortOrder=${answerListType}`
    })
  }

  const gotoWriteAnswer = () => {
    Taro.navigateTo({
      url: `../write_answer/index?questionDetail=${encodeURIComponent(
        JSON.stringify(questionDetail)
      )}`
    })
  }
  return (
    <View className='question_detail_page'>
      <QuestionDetailCard
        questionDetail={questionDetail}
        statusShow={
          <View className='state'>
            <View
              className={`state_text  ${
                questionDetail
                  ? questionDetail.state
                    ? 'is_solute'
                    : 'un_solute'
                  : ''
              }`}>
              {questionDetail
                ? questionDetail.state
                  ? '已解决'
                  : '未解决'
                : ''}
            </View>
            <Navigator
              className='iconfont icon-jubao'
              url={`../report/index?type=0&questionId=${questionDetail.questionId}&content=${questionDetail.title}`}></Navigator>
          </View>
        }
        footerOperate={
          <View className='footer_operate'>
            <View className='collection' onClick={addIntoCollection}>
              <View
                className={`iconfont icon-shoucang ${
                  isCollection ? 'collectioned' : ''
                }`}></View>
              <View>收藏问题，日后回顾</View>
            </View>
            <ThemeButton onClick={gotoWriteAnswer}>我来回答</ThemeButton>
          </View>
        }
      />
      <View className='answer_title'>
        <View>回答</View>
        <View className='switch' onClick={answerTypeChange}>
          <View className='switch_text'>
            <View className={`${answerListType ? '' : 'active_text'}`}>
              最新
            </View>
            <View className={`${answerListType ? 'active_text' : ''}`}>
              最热
            </View>
          </View>
          <View
            className={`switch_mask ${
              answerListType ? 'switch_mask_right' : 'switch_mask_left'
            }`}></View>
        </View>
      </View>
      {currentAnswerList.map((item, index) => (
        <AnswerCard
          answer={item}
          key={item.answerId}
          onClick={() => {
            gotoAnswerDetail(item.answerId, index)
          }}
        />
      ))}
      <LoadMore loading={pageInfo.currentPage < pageInfo.totalPages} />
    </View>
  )
}

export default connect((state: any) => ({
  accountId: state.userInfo.accountId
}))(QuestionDetail)
