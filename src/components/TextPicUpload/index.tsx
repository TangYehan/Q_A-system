import React, {useRef, useState, useImperativeHandle} from 'react'
import Taro from '@tarojs/taro'

import {View, Input} from '@tarojs/components'
import MyTextarea from '../MyTextarea'
import PicUpload from '../PicUpload'
import './index.scss'

interface Props {}

export default React.forwardRef((props: Props, ref) => {
  const [titleIpt, setTitleIpt] = useState<string>('')
  const textArea = useRef<any>()
  const imgs = useRef<any>()
  //暴露给父组件输入框内容
  useImperativeHandle(ref, () => ({
    getInput: () => ({
      titleInput: titleIpt,
      detailInput: textArea.current.getText(),
      imgs: imgs.current.getpics()
    }),
    clear
  }))

  const titleInput = e => {
    const data = e.detail.value
    setTitleIpt(data)
  }

  const clear = _ => {
    setTitleIpt('')
    textArea.current.clear()
    imgs.current.clear()
  }
  return (
    <View className=''>
      <Input
        placeholder='请输入反馈类型(功能，页面...)'
        className='title_ipt'
        onInput={titleInput}
        value={titleIpt}
      />
      <MyTextarea
        myPlaceholder='好的建议会被采纳哟~  感谢您的支持'
        ref={textArea}
      />
      <View className='tips'>有时候一张图片胜过千言万语！</View>
      <PicUpload ref={imgs} />
    </View>
  )
})
