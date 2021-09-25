import React, {useRef, useState, useImperativeHandle} from 'react'

import {View, Input} from '@tarojs/components'
import MyTextarea from '../MyTextarea'
import PicUpload from '../PicUpload'
import './index.scss'

interface Props {
  titlePlaceholder?: string
  textPlaceholder?: string
}

export default React.forwardRef((props: Props, ref) => {
  const [titleIpt, setTitleIpt] = useState<string>('')
  const textArea = useRef<any>()
  const imgs = useRef<any>()
  //暴露给父组件输入框内容
  useImperativeHandle(ref, () => ({
    getInput: () => ({
      titleInput: titleIpt
        ? titleIpt.replace(/[\n]/g, '\\n').replace(/[ ]/g, '&nbsp;')
        : titleIpt,
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
        placeholder={props.titlePlaceholder}
        className='title_ipt'
        onInput={titleInput}
        value={titleIpt}
      />
      <MyTextarea myPlaceholder={props.textPlaceholder} ref={textArea} />
      <View className='tips'>有时候一张图片胜过千言万语！</View>
      <PicUpload ref={imgs} />
    </View>
  )
})
