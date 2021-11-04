import React, {ReactElement} from 'react'
import {View, Text, Image} from '@tarojs/components'

import {baseImgUrl} from '../../../../utils/request/http'

import './index.scss'

interface Props {
  icon: string
  userInfo: {
    userName: string
    score: number
    userImg: string
  }
}

export default function index(props: Props): ReactElement {
  const userInfo = props.userInfo
  return (
    <View className='rank_item'>
      <View className='item_left'>
        <Image src={props.icon} className='ranking_icon'></Image>
        <Image
          src={baseImgUrl + userInfo.userImg}
          className='user_head'></Image>
        <View className='name_level'>
          <Text className='user_name'>{userInfo.userName}</Text>
          <Text>
            {userInfo.score > 2000
              ? '名冠天下'
              : userInfo.score > 1000
              ? '名扬四海'
              : userInfo.score > 500
              ? '远近闻名'
              : userInfo.score > 200
              ? '小有名气'
              : userInfo.score > 120
              ? '锋芒毕露'
              : userInfo.score > 50
              ? '崭露头角'
              : '默默无闻'}
          </Text>
        </View>
      </View>
      <View className='item_right'>
        <Text className='user_score'>总积分</Text>
        <Text>{userInfo.score}</Text>
      </View>
    </View>
  )
}
