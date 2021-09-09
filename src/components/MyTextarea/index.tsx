import React, {ReactElement, useState, useImperativeHandle} from 'react'
import Taro from '@tarojs/taro'

import {View, Text, Image, Textarea} from '@tarojs/components'

import './index.scss'

interface Props {
  myPlaceholder?: string
  value?: string | undefined
  className?: string
}

export default React.forwardRef((props: Props, ref) => {
  const allowWords = 6
  const [currentWordLen, setCurrentWordLen] = useState<number>(0)
  const [currentText, setCurrentText] = useState<string | undefined>(
    props.value
  )

  //暴露给父组件输入框内容
  useImperativeHandle(ref, () => ({
    getText: () => currentText,
    clear: () => setCurrentText('')
  }))

  const textareaInput = e => {
    const inputValue = e.detail.value
    const inputLen = inputValue.length
    if (inputLen >= allowWords) {
      Taro.showToast({
        icon: 'none',
        title: `最多${allowWords}个字，不能更多啦`
      })
    }
    setCurrentWordLen(inputLen < allowWords ? inputLen : allowWords)
    setCurrentText(inputValue.slice(0, allowWords))
  }

  return (
    <View
      className={`my_textarea_box ${props.className ? props.className : ''}`}>
      <Textarea
        className='introduce_area'
        onInput={textareaInput}
        maxlength={allowWords}
        placeholder={props.myPlaceholder}
        value={currentText}></Textarea>
      <Text className='words_count'>
        {currentWordLen}/{allowWords}
      </Text>
    </View>
  )
})
