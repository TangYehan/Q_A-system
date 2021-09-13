import React, {ReactElement} from 'react'
import {View, Text, Image} from '@tarojs/components'

import {baseImgUrl} from '../../../../utils/request/http'

import writeIcon from '../../../../img/email/write.svg'
import './index.scss'
interface Props {
  classNameName?: string
  msg: {
    [propName: string]: any
  }
}

export default function index(props: Props): ReactElement {
  const msg = props.msg

  return (
    <View className='invitation_card'>
      <View className='head'>
        <View className='head_left'>
          <View className='item_head'>
            <Image
              className='head_img'
              src={
                msg.emailContent.sender.imgPath
                  ? baseImgUrl + msg.emailContent.sender.imgPath
                  : ''
              }></Image>
            <View className='head_name'>
              <Text>{msg.emailContent.sender.userName} 的提问期待你的回答</Text>
              <Text className='time'> {msg.emailCreatTime}</Text>
            </View>
          </View>
        </View>
      </View>
      <View className='question_content'>
        <View className='content_left'>
          <Text className='question_titile'>
            <Text className='category'>
              {msg.emailContent.question.subjectName}
            </Text>
            {msg.emailContent.question.title}
          </Text>
          <View className='footer'>
            <View className='question_inform'>
              {msg.emailContent.question.collectionCount} 收藏{' '}
              {msg.emailContent.question.answerCount} 回答
            </View>
            <View className='write_btn'>
              <Image src={writeIcon} className='write_icon'></Image>
              <Text>写回答</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}
