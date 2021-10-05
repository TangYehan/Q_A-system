import {ReactElement} from 'react'
import {View, Image} from '@tarojs/components'

import emptyIcon from '../../img/common/nothing.svg'
import './index.scss'

export default function index(): ReactElement {
  return (
    <View className='nothing_tips'>
      <Image src={emptyIcon} className='nothing_icon'></Image>
      <View className='tips'>暂时没有数据噢~</View>
    </View>
  )
}
