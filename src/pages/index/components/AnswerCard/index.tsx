import {ReactElement} from 'react'
import Taro from '@tarojs/taro'
import {baseImgUrl} from '../../../../utils/request/http'
import {format} from '../../../../utils/api'
import {View, Image, Text, Navigator} from '@tarojs/components'

import studentIcon from '../../../../img/identity/student.svg'
import managerIcon from '../../../../img/identity/manager.svg'
import volunteerIcon from '../../../../img/identity/volunteer.svg'
import teacherIcon from '../../../../img/identity/teacher.svg'
import './index.scss'
import '../../../../img/operate/iconfont.css'

interface Props {
  key?: any
  onClick?: any
  answer: {
    [propName: string]: any
  }
}

export default function index(props: Props): ReactElement {
  const answer = props.answer ? props.answer : {}

  const gotoPersonal = e => {
    e.stopPropagation()
    Taro.navigateTo({
      url: `/pages/index/pages/other_index/index?accountId=${answer.accountId}`
    })
  }
  return (
    <View
      className='answer_list_item'
      key={props.key}
      onClick={props.onClick ? props.onClick : ''}>
      <View className='user_infor' onClick={gotoPersonal}>
        <View className='left_info'>
          <View className='user_head'>
            <Image
              className='user_head_img'
              src={answer.userImg ? baseImgUrl + answer.userImg : ''}></Image>
            <Text>{answer.userName}</Text>
          </View>
          <View className='user_identity'>
            <Image
              className='user_identity_icon'
              src={
                answer.role == 3
                  ? studentIcon
                  : answer.role == 2
                  ? volunteerIcon
                  : answer.role == 4
                  ? managerIcon
                  : teacherIcon
              }></Image>
            <Text className='user_identity_text'>
              {answer.role == 3
                ? '学生'
                : answer.role == 2
                ? '志愿者'
                : answer.role == 4
                ? '管理员'
                : '老师'}
            </Text>
          </View>
        </View>
        <View className='right_operate'>
          <View className='status'>{answer.isAdopt ? '已采纳' : ''}</View>
          <Navigator
            className='iconfont icon-jubao'
            url={`../../pages/report/index?type=${1}&answerId=${
              answer.answerId
            }&content=${
              answer.content
                ? encodeURIComponent(answer.content)
                : encodeURIComponent('[图片]')
            }`}></Navigator>
        </View>
      </View>
      <View className='answer_content'>
        <View>
          <Text className='content_text' decode={true}>
            {format(answer.content)}
          </Text>
        </View>
        {answer.contentImg && answer.contentImg !== '-1' ? (
          <Image
            className='content_img'
            mode='aspectFill'
            src={baseImgUrl + answer.contentImg}></Image>
        ) : (
          ''
        )}
      </View>
      <View className='footer'>
        <View className='footer_left'>
          {answer.agreeCount} 赞同 {answer.commentCount} 评论
        </View>
        <View className='footer_right'>{answer.answerTime}</View>
      </View>
    </View>
  )
}
