import React, {useEffect, ReactElement} from 'react'
import {connect} from 'react-redux'
import Taro from '@tarojs/taro'
import {View} from '@tarojs/components'

import changeLoginStatus from '../../redux/actions/login'
import {setUserInfo} from 'src/redux/actions/userInfo'
import httpUtils from '../../utils/request/index'
import './index.scss'

function Index(props): ReactElement {
  useEffect(() => {
    httpUtils
      .getUserInfo({uniqueId: 'SLVWBTXNLPEL1629454771237'})
      .then(res => {
        if (res.code !== 1 || res.data === null) {
          Taro.clearStorage()
          return Promise.reject('请登录')
        }
        props.changeLoginStatus()
        props.setUserInfo(JSON.parse(JSON.stringify(res.data)))
        Taro.setStorageSync('accountId', res.data.accountId)
        Taro.setStorageSync('college', res.data.college)
        Taro.setStorageSync('currentCollege', res.data.college)
        if (res.data.loginScore !== 0) {
          Taro.showToast({
            title: `签到成功，积分+${res.data.loginScore}`,
            icon: 'none'
          })
        }
      })
      .catch(err => {
        console.log(err)
        const errMsg = typeof err === 'string' ? err : '网络繁忙'
        Taro.showToast({
          title: errMsg,
          icon: 'none',
          duration: 2000,
          mask: true
        })
      })
  }, [])

  return <View>首页</View>
}

export default connect(state => ({isLogin: state.login}), {
  changeLoginStatus,
  setUserInfo
})(Index)
