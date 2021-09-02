import React, {ReactElement, useState, useEffect} from 'react'
import Taro from '@tarojs/taro'
import {View, Image, Text} from '@tarojs/components'

import httpUtils from '../../../../utils/request'
import {baseImgUrl} from '../../../../utils/request/http'
import './index.scss'
export default function index(): ReactElement {
  const [newsDetail, setNewsDetail] = useState<any>({})

  useEffect(() => {
    const {newsId} = Taro.getCurrentInstance().router.params
    httpUtils
      .getMessageDetail({newsId})
      .then(res => {
        if (res.code !== 1) return Promise.reject('出错啦')
        setNewsDetail(res.data)
      })
      .catch(err => {
        const errMsg = typeof err === 'string' ? err : String(err)
        Taro.showToast({
          title: errMsg,
          icon: 'none'
        })
      })
  }, [])

  const preViewPic = e => {
    const src = e.currentTarget.dataset.src
    console.log(src)
  }

  return (
    <View className='message_detail_page'>
      <View className='title'>{newsDetail.title}</View>
      <View className='message_head'>
        <View className='user_info'>
          <View className='user_head'>
            <Image
              className='user_head_img'
              src={newsDetail.adminImg ? baseImgUrl + newsDetail.adminImg : ''}
              mode='aspectFill'></Image>
            <Text>{newsDetail.adminName}</Text>
          </View>
          <View className='user_identity'>
            <Image
              className='user_identity_icon'
              src='/img/identity/teacher.svg'></Image>
            <Text>管理员</Text>
          </View>
        </View>
        <View className='head_date'>{newsDetail.publishTime}</View>
      </View>
      <View className='content'>
        <View>
          <Text decode={true} className='content_text'>
            {newsDetail.content}
          </Text>
        </View>
        {newsDetail.imgPath && Number(newsDetail.imgPath) !== -1 ? (
          <View className='img_container'>
            <Image
              className='content_img'
              mode='widthFix'
              src={newsDetail.imgPath ? baseImgUrl + newsDetail.imgPath : ''}
              data-src={newsDetail.imgPath}
              onClick={preViewPic}></Image>
          </View>
        ) : (
          ''
        )}
        <View className='content_footer'> {newsDetail.readCount} 阅读</View>
      </View>
    </View>
  )
}
