import React, {useEffect, useState, useImperativeHandle} from 'react'
import Taro from '@tarojs/taro'

import {View, Text, Textarea} from '@tarojs/components'

import './index.scss'

interface Props {
  myPlaceholder?: string
  value?: string | undefined
  className?: string
}

export default React.forwardRef((props: Props, ref) => {
  const allowWords = 150
  const [currentWordLen, setCurrentWordLen] = useState<number>(0)
  const [currentText, setCurrentText] = useState<string | undefined>()

  useEffect(() => {
    if (props.value) {
      const formatValue = props.value
        .replace(/\\n/gi, '\n')
        .replace(/&nbsp;/gi, ' ')
      setCurrentText(formatValue)
    }
  }, [props.value])

  //暴露给父组件输入框内容
  useImperativeHandle(ref, () => ({
    getText: () => {
      return currentText
        ? currentText.trim().replace(/[\n]/g, '\\n').replace(/[ ]/g, '&nbsp;')
        : currentText
    },
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
        // placeholder={props.myPlaceholder ? '123' : '321'}
        value={currentText}></Textarea>
      <Text className='words_count'>
        {currentWordLen}/{allowWords}
      </Text>
    </View>
  )
})
