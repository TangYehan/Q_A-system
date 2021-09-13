import React, {ReactElement} from 'react'
import {View, Text, Image} from '@tarojs/components'

import {baseImgUrl} from '../../../../utils/request/http'

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
    <View className='question_card'>
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
            {msg.type === 7 ? (
              <Text className='head_name'>
                收到举报反馈，请注意您的言论
                <br />
                {msg.emailCreatTime}
              </Text>
            ) : (
              <View className='head_name'>
                <Text>
                  {msg.emailContent.sender.userName}{' '}
                  {msg.type === 2
                    ? '回答了问题'
                    : msg.type === 3
                    ? '评论了回答'
                    : msg.type === 4
                    ? '点赞了回答'
                    : msg.type === 5
                    ? '收藏了问题'
                    : msg.type === 6
                    ? '提出了问题'
                    : ''}
                </Text>
                <Text className='time'> {msg.emailCreatTime}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
      <View className='question_content'>
        <View className='content_left'>
          <Text className='question_titile' decode={true}>
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
          </View>
        </View>
      </View>
    </View>
  )
}
