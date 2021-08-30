import React, {ReactElement} from 'react'
import {View, Text, Image} from '@tarojs/components'

import './index.scss'

interface Props {
  children: string
  icon: string
  className?: string
}

export default function index(props: Props): ReactElement {
  return (
    <View className='title'>
      <Image src={props.icon} className='icon'></Image>
      <Text>{props.children}</Text>
    </View>
  )
}
