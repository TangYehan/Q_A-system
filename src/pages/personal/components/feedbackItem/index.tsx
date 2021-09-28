import React, {ReactElement, useState} from 'react'
import Taro from '@tarojs/taro'
import {connect} from 'react-redux'

import {View, Image, Text} from '@tarojs/components'
import {baseImgUrl} from '../../../../utils/request/http'
import httpUtils from '../../../../utils/request/index'

import volunteerIcon from '../../../../img/identity/volunteer.svg'
import studentIcon from '../../../../img/identity/student.svg'
import teacherIcon from '../../../../img/identity/teacher.svg'
import './index.scss'

interface Props {
  accountId: string | number
  info: {[propName: string]: any}
}
function feedbackItem(props: Props): ReactElement {
  const [feedback, setFeedback] = useState(props.info)

  const gotoPersonalIndex = e => {
    e.stopPropagation()
    Taro.navigateTo({
      url: `/pages/index/pages/other_index/index?accountId=${feedback.accountId}`
    })
  }

  const preViewPic = () => {
    Taro.previewImage({
      current: baseImgUrl + feedback.contentImg, // 当前显示图片的http链接
      urls: [baseImgUrl + feedback.contentImg] // 需要预览的图片http链接列表
    })
  }

  const handleAgree = () => {
    const data = {accountId: props.accountId, feedbackId: props.info.feedbackId}

    let newInfo = Object.assign({}, feedback)
    newInfo.isAgree = !newInfo.isAgree
    newInfo.isAgree ? newInfo.agreeCount++ : newInfo.agreeCount--
    newInfo.isAgree
      ? httpUtils.agreeFeedback(data)
      : httpUtils.cancelAgreeFeedback(data)
    setFeedback(newInfo)
  }

  return (
    <View className='feedback_content'>
      <View className='basic_inform'>
        <View className='user_infor'>
          <View className='user_head' onClick={gotoPersonalIndex}>
            <Image
              className='user_head_img'
              src={baseImgUrl + feedback.userImg}></Image>
            <Text>{feedback.userName}</Text>
          </View>
          <View className='user_identity'>
            <Image
              className='item_icon'
              src={
                feedback.role === 3
                  ? studentIcon
                  : feedback.role === 2
                  ? volunteerIcon
                  : teacherIcon
              }></Image>
            <Text className='user_identity_Text'>
              {feedback.role == 3
                ? '学生'
                : feedback.role == 2
                ? '志愿者'
                : feedback.role == 4
                ? '管理员'
                : '老师'}
            </Text>
          </View>
        </View>
      </View>
      <View className='item_content'>
        <View className='content_words'>{feedback.content}</View>
        {feedback.contentImg && feedback.contentImg !== '-1' ? (
          <Image
            mode='aspectFill'
            onClick={preViewPic}
            src={baseImgUrl + feedback.contentImg}
            className='img'
            data-src='{feedback.contentImg}'></Image>
        ) : (
          ''
        )}
      </View>
      <View className='agree_box'>
        <View
          className={[
            'iconfont icon-dianzan',
            feedback.isAgree ? 'agree ' : 'disagree '
          ].join(' ')}
          onClick={handleAgree}></View>
        <Text>{feedback.agreeCount}</Text>
      </View>
    </View>
  )
}

export default connect((state: any) => ({accountId: state.userInfo.accountId}))(
  feedbackItem
)
