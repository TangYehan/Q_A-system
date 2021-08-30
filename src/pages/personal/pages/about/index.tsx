import React, {ReactElement, useEffect, useState} from 'react'
import {View, Image} from '@tarojs/components'
import Title from '../../../../components/Title/index.tsx'

import {baseImgUrl} from '../../../../utils/request/http'
import httpUtils from '../../../../utils/request'

import aboutIcon from '../../../../img/userInfo/introduce_icon.svg'
import './index.scss'

export default function index(): ReactElement {
  const [img, setImg] = useState('')

  useEffect(() => {
    httpUtils.getImgs({type: 4}).then(res => {
      if (res.code !== 1) return Promise.reject()
      setImg(res.data[0].url)
    })
  }, [])
  return (
    <View className='aboutApp_box'>
      <Image src={baseImgUrl + img} className='image' mode='aspectFill'></Image>
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
