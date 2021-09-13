import React, {ReactElement} from 'react'
import Taro from '@tarojs/taro'
import {View, Text, Image} from '@tarojs/components'

import {format} from '../../../../utils/api'
import {baseImgUrl} from '../../../../utils/request/http'

import './index.scss'

interface Props {
  className?: string
  msg: {
    [propName: string]: any
  }
}

export default function index(props: Props): ReactElement {
  const msg = props.msg
  const gotoMessageDetail = () => {
    Taro.navigateTo({
      url: `./pages/message_detail/index?newsId=${msg.newsId}`
    })
  }
  return (
    <View className='message_item_box' onClick={gotoMessageDetail}>
      <View className='message_title'>{msg.title}</View>
      <View className='user_info'>
        <Image
          src={msg.adminImg ? baseImgUrl + msg.adminImg : ''}
          className='user_head_img'></Image>
        <View>{msg.adminName}</View>
      </View>
      <View>
        <Text className='content' decode={true}>
          {format(msg.content)}
        </Text>
      </View>
      <View className='footer'>
        <View>{msg.readCount} 阅读</View>
        <View>{msg.publishTime}</View>
      </View>
    </View>
  )
}
