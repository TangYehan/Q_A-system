import React, {ReactElement} from 'react'
import Taro from '@tarojs/taro'

import {baseImgUrl} from '../../../../utils/request/http'
import {View, Image, Navigator} from '@tarojs/components'

import './index.scss'
import '../../../../img/operate/iconfont.css'

interface Props {
  footerOperate?: ReactElement
  statusShow?: ReactElement
  questionDetail: {
    [propName: string]: any
  }
}

export default function index(props: Props): ReactElement {
  const questionDetailData = props.questionDetail ? props.questionDetail : {}
  const previewPic = () => {
    Taro.previewImage({
      current: baseImgUrl + questionDetailData.imgPath,
      urls: [baseImgUrl + questionDetailData.imgPath]
    })
  }
  return (
    <View className='question_detail_card'>
      <View className='question_title'>
        <View className='title_text'>{questionDetailData.title}</View>
        {props.statusShow ? props.statusShow : ''}
      </View>
      <View className='question_content'>{questionDetailData.describes}</View>
      {questionDetailData.imgPath && questionDetailData.imgPath !== '-1' ? (
        <View>
          <Image
            src={baseImgUrl + questionDetailData.imgPath}
            className='question_img'
            mode='aspectFill'
            onClick={previewPic}></Image>
        </View>
      ) : (
        ''
      )}
      <View className='footer'>
        <View className='tooter_left'>
          {questionDetailData.answerCount} 回答{' '}
          {questionDetailData.collectionCount} 收藏{' '}
        </View>
        <View className='footer_right'>{questionDetailData.publishTime}</View>
      </View>
      <View className='footer_operate'>
        {props.footerOperate ? props.footerOperate : ''}
      </View>
    </View>
  )
}
