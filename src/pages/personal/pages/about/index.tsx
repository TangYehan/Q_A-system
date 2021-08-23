import React, {ReactElement} from 'react'
import {View, Image} from '@tarojs/components'
import Title from '../../../../components/Title/index.tsx'

import aboutIcon from '../../../../img/userInfo/introduce_icon.svg'
import './index.scss'

export default function index(): ReactElement {
  return (
    <View className='aboutApp_box'>
      <Image src='' className='image' mode='aspectFill'></Image>
      <View className='intro'>
        <Title icon={aboutIcon}>排行榜说明</Title>
        <View className='intro_content'>
          简介简介简介简介简介简介简介简介简介简介简介简介简介简介
        </View>
      </View>
      <View className='footer'>
        <View>重庆邮电大学学生处</View>
        <View>Copyright @ 2021 All rights reserved</View>
      </View>
    </View>
  )
}
