import React, {ReactElement, useEffect, useState} from 'react'
import {View, Image, Text} from '@tarojs/components'
import Title from '../../../../components/Title'

import {baseImgUrl} from '../../../../utils/request/http'
import httpUtils from '../../../../utils/request'

import aboutIcon from '../../../../img/userInfo/introduce_icon.svg'
import './index.scss'

export default function index(): ReactElement {
  const [img, setImg] = useState('')

  useEffect(() => {
    httpUtils.getImgs({type: 4}).then(res => {
      if (res.code !== 1) return Promise.reject()
      setImg(res.data[0])
    })
  }, [])
  return (
    <View className='aboutApp_box'>
      <Image
        src={img ? baseImgUrl + img : ''}
        className='image'
        mode='aspectFill'></Image>
      <View className='intro'>
        <Title icon={aboutIcon}>小程序简介</Title>
        <View className='intro_content'>
          <Text>
            本程序为线上学业辅导官方答疑小程序，以学习交流为主，也可以交流生活问题，可通过发布问题的形式求助，会有答疑志愿者及答疑老师进行答疑，同时也鼓励大家互相交流答疑解惑。请注意发言规范。
          </Text>
        </View>
      </View>
      <View className='footer'>
        <View>重庆邮电大学学生处</View>
        <View>Copyright @ 2021 All rights reserved</View>
      </View>
    </View>
  )
}
