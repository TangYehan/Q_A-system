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
  return (
    <View className='rank_item'>
      <View className='item_left'>
        <Image src={props.icon} className='ranking_icon'></Image>
        <Image
          src={baseImgUrl + props.userInfo.userImg}
          className='user_head'></Image>
        <View className='name_level'>
          <Text className='user_name'>{props.userInfo.userName}</Text>
          <Text>最强王者</Text>
        </View>
      </View>
      <View className='item_right'>
        <Text className='user_score'>总积分</Text>
        <Text>{props.userInfo.score}</Text>
      </View>
    </View>
  )
}
