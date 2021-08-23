import React, {ReactElement} from 'react'
import Taro from '@tarojs/taro'
import {View, Image} from '@tarojs/components'
import arrowIcon from '../../../../img/common/show.svg'
import './index.scss'

interface Props {
  children: string
  icon: string
  url: string
}
export default function index(props: Props): ReactElement {
  const {icon, url, children} = props
  const navigateTo = function () {
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
