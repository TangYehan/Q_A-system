import {ReactElement} from 'react'
import {View} from '@tarojs/components'

import './index.scss'

interface Props {
  loading: boolean
}

export default function index(props: Props): ReactElement {
  return (
    <View
      className={`i-className i-load-more ${
        props.loading ? '' : 'i-load-more-line'
      } `}>
      {props.loading ? <View className='i-load-more-loading'></View> : ''}
      <View className='i-load-more-tip'>
        {props.loading ? (
          <View>加载中</View>
        ) : (
          <View className='i-load-more-empty'></View>
        )}
      </View>
    </View>
  )
}
