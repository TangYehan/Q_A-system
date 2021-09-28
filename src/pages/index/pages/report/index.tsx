import {ReactElement, useState, useEffect, useRef} from 'react'
import Taro from '@tarojs/taro'
import {View, Text} from '@tarojs/components'

import httpUtil from '../../../../utils/request'
import {format} from '../../../../utils/api'

import ThemeButton from '../../../../components/ThemeButton'
import MyTextarea from '../../../../components/MyTextarea'
import PicUpload from '../../../../components/PicUpload'
import './index.scss'
import {connect} from 'react-redux'

function Report(props: {accountId: string | number}): ReactElement {
  const [content, setContent] = useState<any>('')
  const textContent = useRef<any>()
  const picUp = useRef<any>()
  const info = useRef<any>()
  const curType = useRef<number | undefined>()

  useEffect(() => {
    const router = Taro.getCurrentInstance().router
    if (router) {
      let {type, answerId, questionId, commentId, content} = router.params
      content = decodeURIComponent(content ? content : '')
      setContent(content)
      curType.current = Number(type)
      switch (
        Number(type) //0是问题 1是回答 2是评论
      ) {
        case 0:
          info.current = {questionId}
          break
        case 1:
          info.current = {answerId}
          break
        case 2:
          info.current = {commentId}
          break
        default:
          Taro.showToast({
            title: '出故障了...',
            icon: 'none'
          })
          break
      }
    }
  }, [])

  const submit = async () => {
    try {
      const text = textContent.current.getText()
      const img = picUp.current.getpics()
      if (!text && img.length === 0) {
        Taro.showToast({
          title: '请输入举报内容或图片',
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
        ...info.current,
        accountId: 1662901, //props.accountId
        content: text ? text.trim() : text
      }
      let res
      switch (curType.current) {
        case 0: //0 代表举报问题
          if (img.length === 0) res = await httpUtil.reportQuestion({data})
          else res = await httpUtil.reportQuestion({filePath: img[0], data})
          break
        case 1: //1代表举报回答
          if (img.length === 0) res = await httpUtil.reportAnswer({data})
          else res = await httpUtil.reportAnswer({filePath: img[0], data})
          break
        case 2: //2 代表评论
          if (img.length === 0) res = await httpUtil.reportComment({data})
          else res = await httpUtil.reportComment({filePath: img[0], data})
          break
        default:
          Taro.showToast({
            title: '出故障了...',
            icon: 'none'
          })
          break
      }
      res = typeof res === 'string' ? JSON.parse(res) : res
      if (res.code !== 1) throw '举报失败'
      textContent.current.clear()
      picUp.current.clear()
      Taro.showToast({
        title: '感谢你的反馈',
        icon: 'success'
      })
      setTimeout(() => {
        Taro.navigateBack()
      }, 1500)
    } catch (err) {
      Taro.showToast({
        title: String(err),
        icon: 'none'
      })
    }
  }

  return (
    <View className='report_page'>
      <View className='report_title'>你将要举报如下内容</View>
      <View className='content_card'>
        <Text decode={true} className='content_card_text'>
          {format(content)}
        </Text>
      </View>
      <MyTextarea myPlaceholder='请输入举报理由' ref={textContent} />
      <PicUpload ref={picUp} />
      <ThemeButton className='btn' onClick={submit}>
        立即举报
      </ThemeButton>
    </View>
  )
}

export default connect((state: any) => ({
  accountId: state.userInfo.accountId
}))(Report)
