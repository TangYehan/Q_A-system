import React, {ReactElement, useRef} from 'react'
import {View, Text} from '@tarojs/components'
import ThemeBotton from '../../../../components/ThemeButton/index'
import TextPicUpload from '../../../../components/TextPicUpload'
import './index.scss'

export default function index(): ReactElement {
  const feedbackInputs = useRef<any>()

  const submitFeedback = () => {
    console.log(feedbackInputs.current.getInput())
  }
  return (
    <View className='feedback_page'>
      <TextPicUpload ref={feedbackInputs} />
      <ThemeBotton onClick={submitFeedback}>提交反馈</ThemeBotton>
    </View>
  )
}
