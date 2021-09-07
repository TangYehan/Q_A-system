import React, {ReactElement} from 'react'
import Taro from '@tarojs/taro'
import {View, Image} from '@tarojs/components'
import arrowIcon from '../../../../img/common/show.svg'
import './index.scss'
import {connect} from 'react-redux'

interface Props {
  children: string
  icon: string
  url: string
  isLogin?: boolean
}
function Nav(props: Props): ReactElement {
  const {icon, url, children} = props
  const navigateTo = function () {
    if (!props.isLogin)
      return Taro.showToast({
        title: '未登录',
        icon: 'none'
      })
    Taro.navigateTo({
      url
    })
  }
  return (
    <View className='item' onClick={navigateTo}>
      <View className='item_left'>
        <Image src={icon} className='icon'></Image>
        <View>{children}</View>
      </View>
      <Image src={arrowIcon} className='arrow'></Image>
    </View>
  )
}

export default connect((state: any) => ({isLogin: state.login}))(Nav)
