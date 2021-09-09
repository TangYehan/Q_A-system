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

function Feedback(props: {accountId: string | number}): ReactElement {
  const initPageInfo = {
    currentPage: 0,
    pageSize: 5,
    totalPages: 1,
    totalRows: 0
  }
  const feedbackInputs = useRef<any>()
  const [pageInfo, setPageInfo] = useState(initPageInfo)
  const [feedbackList, setFeedbackList] = useState<any[]>([])

  useEffect(() => {
    const data = {
      currentPage: pageInfo.currentPage + 1,
      pageSize: pageInfo.pageSize,
      accountId: props.accountId
    }
    getFeedbackList(data)
  }, [])

  useReachBottom(() => {
    if (pageInfo.currentPage < pageInfo.totalPages) {
      const data = {
        currentPage: pageInfo.currentPage + 1,
        pageSize: pageInfo.pageSize,
        accountId: props.accountId
      }
      getFeedbackList(data)
    }
  })

  const getFeedbackList = (data, clear = false) => {
    httpUtils
      .getFeedbackList(data)
      .then(res => {
        if (!res.code) return Promise.reject('出错啦~')
        clear
          ? setFeedbackList([...res.data.list])
          : setFeedbackList([...feedbackList, ...res.data.list])
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
      let res = imgs.length
        ? await httpUtils.submitFeedback({data, filePath: imgs[0]})
        : await httpUtils.submitFeedback({data})

      res = typeof res === 'string' ? JSON.parse(res) : res
      if (res.code !== 1) throw '获取反馈列表失败'
      feedbackInputs.current.clear()
      const data2 = {
        currentPage: 1,
        pageSize: pageInfo.pageSize,
        accountId: props.accountId
      }
      getFeedbackList(data2, true)

      Taro.showToast({
        icon: 'success',
        title: '感谢您的反馈',
        duration: 1500,
        mask: true
      })
    } catch (err) {
      Taro.showToast({
        title: String(err),
        icon: 'none'
      })
    }
  }

  return (
    <View className='feedback_page'>
      <View className='submit_container'>
        <TextPicUpload
          ref={feedbackInputs}
          titlePlaceholder='请输入反馈类型：(页面，功能...)'
          textPlaceholder='好的建议会被采纳哟~'
        />
        <ThemeBotton onClick={submitFeedback} className='submitBtn'>
          提交反馈
        </ThemeBotton>
        <View className='group_tips'>欢迎加入开发反馈群：1198734032</View>
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
