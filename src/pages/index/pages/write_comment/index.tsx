import React, {ReactElement, useState, useEffect, useRef} from 'react'
import Taro from '@tarojs/taro'
import httpUtil from '../../../../utils/request'

import {View} from '@tarojs/components'
import MyTextarea from '@/components/MyTextarea'
import ThemeButton from '@/components/ThemeButton'
import './index.scss'
import {connect} from 'react-redux'

function WriteComment(props: any): ReactElement {
  const [answerUser, SetAswerUser] = useState<string | undefined>('')
  const currentAnswerId = useRef<any>(undefined)
  const content = useRef<any>()
  useEffect(() => {
    const router = Taro.getCurrentInstance().router
    if (router) {
      const {answerId, answerUser} = router.params
      currentAnswerId.current = answerId
      SetAswerUser(answerUser)
    }
  }, [])

  const submit = async () => {
    try {
      Taro.showToast({
        title: '发布中',
        icon: 'loading',
        mask: true,
        duration: 10000
      })
      const contentWord = content.current.getText()
      if (!contentWord.trim()) {
        Taro.showToast({
          title: '请输入内容',
          icon: 'none'
        })
        return
      }
      const data = {
        accountId: 1662901, //props.accountId,
        answerId: currentAnswerId.current,
        content: contentWord
      }
      const res = await httpUtil.submitComment(data)
      if (res.code !== 1) throw res.msg || '发布评论失败'
      else {
        Taro.showToast({
          title: '发布成功',
          icon: 'success',
          duration: 1000,
          mask: true
        })

        setTimeout(() => Taro.navigateBack(), 1000)
      }
    } catch (err) {
      console.log(err)
      Taro.showToast({
        title: String(err),
        icon: 'none'
      })
    }
  }
  return (
    <View className='write_comment'>
      <View className='to'>评论给：{answerUser}</View>
      <MyTextarea ref={content} myPlaceholder='请文明评论' />
      <ThemeButton onClick={submit} className='btn'>
        发布评论
      </ThemeButton>
    </View>
  )
}
export default connect((state: any) => ({accountId: state.userInfo.accountId}))(
  WriteComment
)
