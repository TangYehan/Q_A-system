import React, {useState, useEffect, Fragment} from 'react'
import {useDidShow} from '@tarojs/taro'
import {connect} from 'react-redux'
import Taro from '@tarojs/taro'
import {View, Text, Image} from '@tarojs/components'
import {stateProp, accountInfoProp} from './data.d'

import ThemeBotton from '@/components/ThemeButton/index'
import NavigateItem from './components/navigateItem/index'
import Skeleton from '@/components/Skeleton'

import {format} from '@/utils/api'
import httpUtils from '@/utils/request/index'
import {baseImgUrl} from '@/utils/request/http'

import './index.scss'
import volunteerIcon from '@/img/identity/volunteer.svg'
import studentIcon from '@/img/identity/student.svg'
import teacherIcon from '@/img/identity/teacher.svg'
import collegeIcon from '@/img/userInfo/degree.svg'
import levelIcon from '@/img/userInfo/level.svg'
import rankIcon from '@/img/userInfo/rank.svg'
import feedbackIcon from '@/img/userInfo/feedback.svg'
import aboutIcon from '@/img/userInfo/about.svg'

const initAccountInfo = {
  userName: '',
  college: '重庆邮电大学',
  imgPath: '',
  introduce: '',
  questionCount: 0,
  role: 0,
  score: 0,
  solveCount: 0,
  agreeCount: 0,
  answerCount: 0,
  collectionCount: 0
}

function Personal(props: stateProp): JSX.Element {
  const [accountInfo, setAccountInfo] =
    useState<accountInfoProp>(initAccountInfo)
  const [loading, setLoading] = useState(true)

  useDidShow(() => {
    if (props.isLogin) {
      const accountId = props.userInfo.accountId
      httpUtils
        .getAccountById({accountId})
        .then(res => {
          if (res.code !== 1 || res.data === null)
            return Promise.reject('网络繁忙')
          setAccountInfo(JSON.parse(JSON.stringify(res.data)))
          setLoading(false)
        })
        .catch(err => {
          Taro.showToast({
            title: String(err),
            icon: 'none'
          })
          setLoading(false)
        })
    }
  })

  const gotoEdit = () => {
    if (!props.isLogin)
      return Taro.showToast({
        title: '未登录',
        icon: 'none'
      })
    console.log(accountInfo.introduce)
    Taro.navigateTo({
      url: `/pages/personal/pages/edit/index?imagePath=${
        accountInfo.imgPath
      }&intro= ${encodeURIComponent(accountInfo.introduce)}`
    })
  }

  //去登录
  const gotoLogin = () => {
    /**生成随机数最为用户uniqueId */
    const dataString = new Date().getTime()
    const randomString = getRandom()
    const uniqueId = randomString + dataString
    Taro.showToast({
      title: '跳转中...',
      icon: 'loading',
      mask: true
    })
    httpUtils
      .login({uniqueId})
      .then(res => {
        if (res.code !== 1) return Promise.reject('获取登录地址失败')
        Taro.setStorageSync('loginsrc', res.data)
        Taro.setStorageSync('uniqueId', uniqueId)
        Taro.navigateTo({
          url: `../loginout/index?type=login`
        })
      })
      .catch(err => {
        Taro.showToast({
          title: String(err),
          icon: 'none'
        })
      })
  }

  //退出登录
  const gotoLogout = () => {
    Taro.clearStorage()
    Taro.navigateTo({
      url: `../loginout/index?type=logout`
    })
  }

  //生成随机数
  const getRandom = function () {
    const e = 12
    const t = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    const length = t.length
    let n = ''
    for (let i = 0; i < e; i++)
      n += t.charAt(Math.floor(Math.random() * length))
    return n
  }

  return (
    <Fragment>
      <Skeleton selector='skeleton' loading={loading} />
      <View className='personal_page'>
        <View className='personal_card skeleton'>
          <View className='base_info'>
            <Image
              className='head_img skeleton-radius'
              src={
                accountInfo.imgPath ? baseImgUrl + accountInfo.imgPath : ''
              }></Image>
            <View className='intro'>
              <View className='name skeleton-rect'>{accountInfo.userName}</View>
              <View className='intro_msg skeleton-rect'>
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
                  <Text className='college'>
                    {props.userInfo.college ? props.userInfo.college : '重邮'}
                  </Text>
                </View>
                <View className='intro_item'>
                  <Image className='item_icon' src={levelIcon}></Image>
                  <Text>
                    {accountInfo.score > 2000
                      ? '名冠天下'
                      : accountInfo.score > 1000
                      ? '名扬四海'
                      : accountInfo.score > 500
                      ? '远近闻名'
                      : accountInfo.score > 200
                      ? '小有名气'
                      : accountInfo.score > 120
                      ? '锋芒毕露'
                      : accountInfo.score > 50
                      ? '崭露头角'
                      : '默默无闻'}
                  </Text>
                </View>
              </View>
              <View className='self_intro skeleton-rect'>
                <Text decode={true}>{format(accountInfo.introduce)}</Text>
              </View>
            </View>
          </View>
          <View className='relevant_info'>
            <View className='relevant_left'>
              <View className='edit_btn skeleton-rect' onClick={gotoEdit}>
                编辑资料
              </View>
              <View className='skeleton-rect'>积分：{accountInfo.score}</View>
            </View>
            <View className='relevant_right'>
              <View className='relevant_item'>
                <Text className='skeleton-rect'>提问</Text>
                <Text className='skeleton-rect item_number'>
                  {accountInfo.questionCount}
                </Text>
              </View>
              <View className='relevant_item'>
                <Text className='skeleton-rect'>回答</Text>
                <Text className='skeleton-rect item_number'>
                  {accountInfo.answerCount}
                </Text>
              </View>
              <View className='relevant_item'>
                <Text className='skeleton-rect'>收藏</Text>
                <Text className='skeleton-rect item_number'>
                  {accountInfo.collectionCount}
                </Text>
              </View>
              <View className='relevant_item'>
                <Text className='skeleton-rect'>赞同</Text>
                <Text className='skeleton-rect item_number'>
                  {accountInfo.agreeCount}
                </Text>
              </View>
              <View className='relevant_item'>
                <Text className='skeleton-rect'>采纳</Text>
                <Text className='skeleton-rect item_number'>
                  {accountInfo.solveCount}
                </Text>
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
          <ThemeBotton onClick={props.isLogin ? gotoLogout : gotoLogin}>
            {props.isLogin ? '退出登录' : '去登陆'}
          </ThemeBotton>
        </View>
      </View>
    </Fragment>
  )
}

export default connect((state: any) => ({
  isLogin: state.login,
  userInfo: state.userInfo
}))(Personal)
