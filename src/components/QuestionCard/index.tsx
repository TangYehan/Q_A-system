import React, {ReactElement} from 'react'
import {View, Text, Image} from '@tarojs/components'

import {baseImgUrl} from '../../utils/request/http'

import studentIcon from '../../img/identity/student.svg'
import managerIcon from '../../img/identity/manager.svg'
import volunteerIcon from '../../img/identity/volunteer.svg'
import teacherIcon from '../../img/identity/teacher.svg'
import './index.scss'

interface Props {
  className?: string
  subjectLable?: ReactElement
  msg: {
    [propName: string]: any
  }
}

export default function index(props: Props): ReactElement {
  const msg = props.msg
  const gotoPersonalIndex = () => {}

  return (
    <View className='question_card'>
      <View className='question_card_title'>
        <View className='title_left'>
          {props.subjectLable ? props.subjectLable : ''}
          {msg.question.title}
        </View>
        <View
          className={`title_right_status ${
            msg.question.state ? 'solve' : 'unsolve'
          }`}>
          未解决
        </View>
      </View>

      {msg.answer ? (
        <>
          {' '}
          <View className='basic_inform'>
            <View className='user_infor'>
              <View className='user_head' onClick={gotoPersonalIndex}>
                <Image
                  className='user_head_img'
                  src={
                    msg.answer.userImg ? baseImgUrl + msg.answer.userImg : ''
                  }></Image>
                <Text>{msg.answer.userName}</Text>
              </View>
              <View className='user_identity'>
                <Image
                  className='user_identity_icon'
                  src={
                    msg.answer.role == 3
                      ? studentIcon
                      : msg.answer.role == 2
                      ? volunteerIcon
                      : msg.answer.role == 4
                      ? managerIcon
                      : teacherIcon
                  }></Image>
                <Text className='user_identity_text'>
                  {msg.answer.role == 3
                    ? '学生'
                    : msg.answer.role == 2
                    ? '志愿者'
                    : msg.answer.role == 4
                    ? '管理员'
                    : '老师'}
                </Text>
              </View>
            </View>
          </View>
          <View className='answer_content'>
            {msg.answer.content ? msg.answer.content : '[图片]'}
          </View>
        </>
      ) : (
        <View className='answer_content'>
          该问题暂时还没有回答，期待您的回答~
        </View>
      )}
      <View className='question_card_footer'>
        <View>
          {msg.question.collectionCount} 收藏 {msg.question.answerCount} 回答{' '}
        </View>
        <View>{msg.question.publishTime}</View>
      </View>
    </View>
  )
}
