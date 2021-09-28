import React, {ReactElement, useState, useEffect, useRef} from 'react'
import Taro, {useReachBottom, usePullDownRefresh} from '@tarojs/taro'
import {View} from '@tarojs/components'
import httpUtil from '../../../../utils/request'
import QestionDetailCard from '../../components/QuestionDetailCard'
import ThemeButton from '../../../../components/ThemeButton'
import MyTextarea from '../../../../components/MyTextarea'
import PicUpload from '../../../../components/PicUpload'
import './index.scss'
import {connect} from 'react-redux'

function WriteAnswer(props: {accountId: string | number}): ReactElement {
  const [questionDetail, setQuestionDetail] = useState<any>({})
  const textContent = useRef<any>()
  const picUp = useRef<any>()

  useEffect(() => {
    const router = Taro.getCurrentInstance().router
    if (router) {
      let {questionDetail: getQuestion} = router.params
      getQuestion = JSON.parse(decodeURIComponent(getQuestion as string))
      setQuestionDetail(getQuestion)
    }
  }, [])

  const submit = async () => {
    try {
      const text = textContent.current.getText()
      const img = picUp.current.getpics()
      if (!text && img.length === 0) {
        Taro.showToast({
          title: '请输入内容或图片',
          icon: 'none'
        })
        return
      }
      Taro.showToast({
        title: '正在上传',
        mask: true,
        icon: 'loading',
        duration: 10000
      })
      const data = {
        questionId: questionDetail.questionId,
        accountId: 1662901, //props.accountId
        content: text
      }
      let res =
        img.length === 0
          ? await httpUtil.submitAnswer({data})
          : await httpUtil.submitAnswer({data, filePath: img[0]})
      res = typeof res === 'string' ? JSON.parse(res) : res
      if (res.code !== 1) throw res.msg
      textContent.current.clear()
      picUp.current.clear()
      Taro.showToast({
        title: '发布成功',
        icon: 'success'
      })
      let pages = Taro.getCurrentPages() // 获取以后的页面栈
      let prevPage = pages[pages.length - 2]
      prevPage.options = Object.assign({shouldRefresh: true}, prevPage.options)
      setTimeout(() => {
        Taro.navigateBack()
      }, 1000)
    } catch (err) {
      Taro.showToast({
        title: String(err),
        icon: 'none'
      })
    }
  }

  return (
    <View className='write_answer_page'>
      <QestionDetailCard questionDetail={questionDetail} />
      <MyTextarea
        className='text_area'
        ref={textContent}
        myPlaceholder='详细的说明更有利于理解~'
      />
      <View className='tips'>有时候一张图片胜过千言万语</View>
      <PicUpload ref={picUp} />
      <ThemeButton className='btn' onClick={submit}>
        发布答案
      </ThemeButton>
    </View>
  )
}

export default connect((state: any) => ({
  accountId: state.userInfo.accountId
}))(WriteAnswer)
