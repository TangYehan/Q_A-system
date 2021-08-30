import React, {ReactElement, useState, useRef, useEffect} from 'react'
import Taro, {useReachBottom} from '@tarojs/taro'
import {View} from '@tarojs/components'
import {connect} from 'react-redux'

import ThemeBotton from '../../../../components/ThemeButton/index'
import TextPicUpload from '../../../../components/TextPicUpload'
import Title from '../../../../components/Title'
import FeedbackItem from '../../components/feedbackItem'
import LoadMore from '../../../../components/LoadMore'
import httpUtils from '../../../../utils/request/index'

import './index.scss'
import feedbackIcon from '../../../../img/feedback/feedback.svg'
import tempHead from '../../../../img/timg.jpg'

const initPageInfo = {
  currentPage: 0,
  pageSize: 5,
  totalPages: 1,
  totalRows: 0
}

function Feedback(props: {accountId: string | number}): ReactElement {
  const feedbackInputs = useRef<any>()
  const [pageInfo, setPageInfo] = useState(initPageInfo)
  const [feedbackList, setFeedbackList] = useState<any[]>([])

  useEffect(() => {
    getFeedbackList()
  }, [])

  useReachBottom(() => {
    if (pageInfo.currentPage < pageInfo.totalPages) getFeedbackList()
  })

  const getFeedbackList = (_: void) => {
    const data = {
      currentPage: pageInfo.currentPage + 1,
      pageSize: pageInfo.pageSize,
      accountId: props.accountId
    }

    httpUtils
      .getFeedbackList(data)
      .then(res => {
        if (!res.code) return Promise.reject('出错啦~')
        setFeedbackList([...feedbackList, ...res.data.list])
        setPageInfo(JSON.parse(JSON.stringify(res.data.pageInfo)))
      })
      .catch(err => {
        console.log(err)
        const errMsg = typeof err === 'string' ? err : '网络繁忙'
        Taro.showToast({
          title: errMsg,
          icon: 'none'
        })
      })
  }

  const submitFeedback = async () => {
    try {
      const {titleInput, detailInput, imgs} = feedbackInputs.current.getInput()
      if (!titleInput || !detailInput) {
        Taro.showToast({
          title: '请完善标题或内容',
          icon: 'none'
        })
        return
      }
      Taro.showToast({
        icon: 'loading',
        title: '正在提交反馈',
        duration: 10000,
        mask: true
      })
      const data = {
        accountId: props.accountId,
        content: titleInput + ' : ' + detailInput
      }
      const res = imgs.length
        ? await httpUtils.submitFeedback({data, filePath: imgs[0]})
        : await httpUtils.submitFeedback({data})

      console.log(res)
      if (res.code) {
        feedbackInputs.current.clear()
        setFeedbackList([res.data, ...feedbackList])
      }
      Taro.showToast({
        icon: 'success',
        title: '感谢您的反馈',
        duration: 1500,
        mask: true
      })
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <View className='feedback_page'>
      <View className='submit_container'>
        <TextPicUpload ref={feedbackInputs} />
        <ThemeBotton onClick={submitFeedback} className='submitBtn'>
          提交反馈
        </ThemeBotton>
      </View>
      <View className='feedback_container'>
        <Title className='title' icon={feedbackIcon}>
          最新反馈
        </Title>
        {feedbackList.map(item => (
          <FeedbackItem info={item} key={item.feedbackId} />
        ))}
      </View>
      <LoadMore loading={pageInfo.currentPage < pageInfo.totalPages} />
    </View>
  )
}

export default connect((state: any) => ({accountId: state.userInfo.accountId}))(
  Feedback
)
