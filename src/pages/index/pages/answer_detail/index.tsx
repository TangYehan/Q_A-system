import React, {useEffect, ReactElement, useState, useRef} from 'react'
import Taro, {useDidShow} from '@tarojs/taro'
import {connect} from 'react-redux'
import httpUtil from '../../../../utils/request'

import {View, Image} from '@tarojs/components'
import QustionDetailCard from '../../components/QuestionDetailCard'
import AnswerDetailCard from '../../components/AnswerDetailCard'
import CommentItem from '../../components/CommentItem'

import './index.scss'
import '../../../../img/operate/iconfont.css'
import showArrow from '../../../../img/common/show.svg'

function AnswerDetail(props: {accountId: string | number}): ReactElement {
  const [questionDetail, setQuestionDetail] = useState<any>({})
  const [answerDetail, setAnswerDetail] = useState<any>({})
  const [commentList, setCommentList] = useState<any>([])
  const [commentPageInfo, setCommentPageInfo] = useState<any>({})
  const answerInfo = useRef<any>({})

  useEffect(() => {
    const router = Taro.getCurrentInstance().router
    if (router) {
      let {answerId, questionDetail, currentPage, sortOrder, totalRows} =
        router.params
      questionDetail = JSON.parse(decodeURIComponent(questionDetail as string))
      setQuestionDetail(questionDetail)
      answerInfo.current = {answerId, sortOrder, currentPage, totalRows}
      const accountId = props.accountId
      getAnswerDetail({answerId, accountId})
    }
    // getComment({answerId, currentPage: 1, pageSize: 2})
  }, [])

  useDidShow(() => {
    const router = Taro.getCurrentInstance().router
    if (router) {
      let {answerId} = router.params
      getComment({
        answerId: answerId,
        currentPage: 1,
        pageSize: 2
      })
    }
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

  const gotoCommentList = () => {
    Taro.navigateTo({
      url: `../comments_list/index?answerId=${answerDetail.answerId}`
    })
  }

  const showNext = async () => {
    try {
      const {currentPage, totalRows, sortOrder} = answerInfo.current
      if (Number(currentPage) < Number(totalRows)) {
        const data = {
          accountId: props.accountId,
          currentPage: Number(currentPage) + 1,
          pageSize: 1,
          questionId: questionDetail.questionId,
          sortOrder
        }
        const res = await httpUtil.getAnswerList(data)
        if (res.code !== 1) throw '获取下一个回答失败'
        const nextAnswerId = res.data.list[0].answerId
        Taro.redirectTo({
          url: `../answer_detail/index?answerId=${nextAnswerId}&questionDetail=${encodeURIComponent(
            JSON.stringify(questionDetail)
          )}&currentPage=${
            Number(currentPage) + 1
          }&totalRows=${totalRows}&sortOrder=${sortOrder}&questionId=${
            questionDetail.questionId
          }`
        })
      } else {
        Taro.showToast({
          title: '已经最后啦',
          icon: 'none'
        })
      }
    } catch (err) {
      Taro.showToast({
        title: String(err),
        icon: 'none'
      })
    }
  }

  return (
    <View className='answer_detail_page'>
      <QustionDetailCard questionDetail={questionDetail} />
      <View className='tip_title'>回答</View>
      <AnswerDetailCard
        answerDetail={answerDetail}
        questioner={questionDetail.accountId}
        questionId={questionDetail.questionId}
        currentUser={props.accountId}
      />
      <View className='tip_title'>评论 {commentPageInfo.totalRows}</View>
      {commentList.map(item => (
        <CommentItem comment={item} key={'comment' + item.commentId} />
      ))}
      {answerDetail.commentCount > 2 ? (
        <View onClick={gotoCommentList} className='show_comments'>
          查看全部评论 {'>>'}
        </View>
      ) : (
        ''
      )}
      <View className='next_botton' onClick={showNext}>
        <Image src={showArrow} className='next_icon'></Image>
        <View className='next_text'>下一个</View>
      </View>
    </View>
  )
}

export default connect((state: any) => ({accountId: state.userInfo.accountId}))(
  AnswerDetail
)
