import React, {ReactElement, useEffect} from 'react'
import {View} from '@tarojs/components'

interface Props {}

export default function index({}: Props): ReactElement {
  useEffect(() => {
    console.log(123)
  }, [])
  return <View className='index'>资讯</View>
}
