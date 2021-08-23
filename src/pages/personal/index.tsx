import React, {useState} from 'react'
import {useDidShow} from '@tarojs/taro'
import {connect} from 'react-redux'
import Taro from '@tarojs/taro'
import {View, Text, Image} from '@tarojs/components'

import ThemeBotton from '../../components/ThemeButton/index'
import NavigateItem from './components/navigateItem/index'

import httpUtils from '../../utils/request/index'

import './index.scss'
import volunteerIcon from '../../img/identity/volunteer.svg'
import studentIcon from '../../img/identity/student.svg'
import teacherIcon from '../../img/identity/teacher.svg'
import collegeIcon from '../../img/userInfo/degree.svg'
import levelIcon from '../../img/userInfo/level.svg'
import rankIcon from '../../img/userInfo/rank.svg'
import feedbackIcon from '../../img/userInfo/feedback.svg'
import aboutIcon from '../../img/userInfo/about.svg'

// interface accountInfo {
//   userName: string
//   college: string
//   imgPath: string
//   introduce: string
//   questionCount: number
//   role: number
//   score: number
//   solveCount: number
//   agreeCount: number
//   answerCount: number
//   collectionCount: number
// }

function Personal(props): JSX.Element {
  const [accountInfo, setAccountInfo] = useState<any>()
  useDidShow(() => {
    if (props.login) {
      const accountId = props.userInfo.accountId
      httpUtils
        .getAccountById({accountId})
        .then(res => {
          if (res.code !== 1 || res.data === null)
            return Promise.reject('网络繁忙')
          setAccountInfo(JSON.parse(JSON.stringify(res.data)))
        })
        .catch(err => {
          const errMsg = typeof err === 'string' ? err : '网络繁忙'
          Taro.showToast({
            title: errMsg,
            icon: 'none'
          })
        })
    }
  })
  return (
    <View className='personal_page'>
      <View className='personal_card'>
        <View className='base_info'>
          <Image className='head_img' src=''></Image>
          <View className='intro'>
            <View className='name'>{accountInfo.userName}</View>
            <View className='intro_msg'>
              <View className='intro_item'>
                <Image
                  className='item_icon'
                  src={
                    accountInfo.role === 3
                      ? studentIcon
                      : accountInfo.role === 2
                      ? volunteerIcon
                      : teacherIcon
                  }></Image>
                <Text>
                  {accountInfo.role === 3
                    ? '学生'
                    : accountInfo.role === 2
                    ? '志愿者'
                    : accountInfo.role === 1
                    ? '教师'
                    : '管理员'}
                </Text>
              </View>
              <View className='intro_item'>
                <Image className='item_icon' src={collegeIcon}></Image>
                <Text className='college'>{accountInfo.college}</Text>
              </View>
              <View className='intro_item'>
                <Image className='item_icon' src={levelIcon}></Image>
                <Text>
                  {accountInfo.score > 200
                    ? '大显身手'
                    : accountInfo.score > 100
                    ? '游刃有余'
                    : accountInfo.score > 30
                    ? '小有成就'
                    : '初出茅庐'}
                </Text>
              </View>
            </View>
            <View className='self_intro'>
              <Text decode>{accountInfo.introduce}</Text>
            </View>
          </View>
        </View>
        <View className='relevant_info'>
          <View className='relevant_left'>
            <View className='edit_btn'>编辑资料</View>
            <View>积分：{accountInfo.score}</View>
          </View>
          <View className='relevant_right'>
            <View className='relevant_item'>
              <Text>提问</Text>
              <Text className='item_number'>{accountInfo.questionCount}</Text>
            </View>
            <View className='relevant_item'>
              <Text>回答</Text>
              <Text className='item_number'>{accountInfo.answerCount}</Text>
            </View>
            <View className='relevant_item'>
              <Text>收藏</Text>
              <Text className='item_number'>{accountInfo.collectionCount}</Text>
            </View>
            <View className='relevant_item'>
              <Text>赞同</Text>
              <Text className='item_number'>{accountInfo.agreeCount}</Text>
            </View>
            <View className='relevant_item'>
              <Text>采纳</Text>
              <Text className='item_number'>{accountInfo.solveCount}</Text>
            </View>
          </View>
        </View>
      </View>
      <View className='navigate'>
        <NavigateItem icon={rankIcon} url='./pages/rank/index'>
          排行榜
        </NavigateItem>
        <NavigateItem icon={feedbackIcon} url='./pages/feedback/index'>
          反馈
        </NavigateItem>
        <NavigateItem icon={aboutIcon} url='./pages/about/index'>
          关于
        </NavigateItem>
      </View>
      <View className='btn_area'>
        <ThemeBotton>去登陆</ThemeBotton>
      </View>
    </View>
  )
}

export default connect(state => ({
  login: state.login,
  userInfo: state.userInfo
}))(Personal)
