import React, {useEffect, ReactElement, useState, useRef} from 'react'
import Taro, {useDidShow} from '@tarojs/taro'
import {connect} from 'react-redux'
import httpUtil from '../../../../utils/request'

import {View, Navigator} from '@tarojs/components'
import QustionDetailCard from '../../components/QuestionDetailCard'
import AnswerDetailCard from '../../components/AnswerDetailCard'
import CommentItem from '../../components/CommentItem'

import './index.scss'
import '../../../../img/operate/iconfont.css'

function AnswerDetail(props: any): ReactElement {
  const [questionDetail, setQuestionDetail] = useState<any>({})
  const [answerDetail, setAnswerDetail] = useState<any>({})
  const [commentList, setCommentList] = useState<any>([])
  const [commentPageInfo, setCommentPageInfo] = useState<any>({})
  const answerInfo = useRef<any>({})
  useEffect(() => {
    let {answerId, questionDetail, currentIndex, sortOrder, totalRows} =
      Taro.getCurrentInstance().router.params
    questionDetail = JSON.parse(decodeURIComponent(questionDetail as string))
    setQuestionDetail(questionDetail)
    answerInfo.current = {answerId, sortOrder, currentIndex, totalRows}
    const accountId = 1662901
    getAnswerDetail({answerId, accountId})
    // getComment({answerId, currentPage: 1, pageSize: 2})
  }, [])

  useDidShow(() => {
    let {answerId} = Taro.getCurrentInstance().router.params
    getComment({
      answerId: answerId,
      currentPage: 1,
      pageSize: 2
    })
  })

  const getAnswerDetail = data => {
    httpUtil
      .getAnswerDetail(data)
      .then(res => {
        if (res.code !== 1) return Promise.reject('获取回答详情失败')
        setAnswerDetail(JSON.parse(JSON.stringify(res.data)))
      })
      .catch(err =>
        Taro.showToast({
          title: String(err),
          icon: 'none'
        })
      )
  }

  const getComment = data => {
    httpUtil
      .getComment(data)
      .then(res => {
        if (res.code !== 1) return Promise.reject('获取评论失败')
        setCommentList(JSON.parse(JSON.stringify(res.data.list)))
        setCommentPageInfo(JSON.parse(JSON.stringify(res.data.pageInfo)))
      })
      .catch(err =>
        Taro.showToast({
          title: String(err),
          icon: 'none'
        })
      )
  }

  return (
    <View className='answer_detail_page'>
      <QustionDetailCard questionDetail={questionDetail} />
      <View className='tip_title'>回答</View>
      <AnswerDetailCard
        answerDetail={answerDetail}
        questioner={questionDetail.accountId}
        questionId={questionDetail.questionId}
        currentUser={1662901}
      />
      <View className='tip_title'>评论 {commentPageInfo.totalRows}</View>
      {commentList.map(item => (
        <CommentItem comment={item} key={'comment' + item.commentId} />
      ))}
      {answerDetail.commentCount > 2 ? (
        <Navigator
          className='show_comments'
          url={`../comments_list/index?answerId${answerDetail.answerId}`}>
          查看全部评论 {'>>'}{' '}
        </Navigator>
      ) : (
        ''
      )}
    </View>
  )
}

export default connect((state: any) => ({accountId: state.userInfo.accountId}))(
  AnswerDetail
)
