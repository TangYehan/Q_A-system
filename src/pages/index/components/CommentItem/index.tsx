import {ReactElement} from 'react'
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
  comment: {
    [propName: string]: any
  }
}

export default function index(props: Props): ReactElement {
  const comment = props.comment ? props.comment : {}
  const gotoPersonal = e => {
    // e.stopPropagation()
    // console.log(123123)
  }
  return (
    <View className='comment_item'>
      <View className='user_infor' onClick={gotoPersonal}>
        <View className='left_info'>
          <View className='user_head'>
            <Image
              className='user_head_img'
              src={comment.userImg ? baseImgUrl + comment.userImg : ''}></Image>
            <Text>{comment.userName}</Text>
          </View>
          <View className='user_identity'>
            <Image
              className='user_identity_icon'
              src={
                comment.role == 3
                  ? studentIcon
                  : comment.role == 2
                  ? volunteerIcon
                  : comment.role == 4
                  ? managerIcon
                  : teacherIcon
              }></Image>
            <Text className='user_identity_text'>
              {comment.role == 3
                ? '学生'
                : comment.role == 2
                ? '志愿者'
                : comment.role == 4
                ? '管理员'
                : '老师'}
            </Text>
          </View>
        </View>
        <View className='right_operate'>
          <Navigator
            className='iconfont icon-jubao'
            url={`../../pages/report/index?type=2&commentId=${comment.commentId}&content=${comment.content}`}></Navigator>
        </View>
      </View>
      <Text className='comment_content' decode={true}>
        {format(comment.content)}
      </Text>
      <View className='footer'>
        <View className='footer_right'>{comment.commentTime}</View>
      </View>
    </View>
  )
}
