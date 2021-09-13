import {ReactElement, useState} from 'react'
import {View, Text, Image} from '@tarojs/components'
import {baseImgUrl} from '../../utils/request/http'
import {format} from '../../utils/api'
import './index.scss'

interface Props {
  categorayMsg: any
  classNameName?: string
  rightOperate?: ReactElement
  key?: any
  onClick?: () => void
}

export default function index(props: Props): ReactElement {
  const [isShowDetail, setIsShowDetail] = useState(false)
  const categoryMsg = props.categorayMsg

  const showDetail = () => {
    setIsShowDetail(true)
  }

  const unShowDetail = () => {
    setIsShowDetail(false)
  }
  return (
    <View className='category_item_box' key={props.key}>
      <View className='item_left'>
        <Image
          className='icon'
          src={
            categoryMsg.iconPath ? baseImgUrl + categoryMsg.iconPath : ''
          }></Image>
        <Text className='text left_text_first'>{categoryMsg.college}</Text>
        <Text className='text left_text_second'>{categoryMsg.subjectName}</Text>
      </View>
      <View className='item_right'>
        <View>
          <View>
            此科目已累计
            <Text className='number_g'>{categoryMsg.questionCount}</Text>个问题
          </View>
          <View className='unsolve_add'>
            待解决
            <Text className='number_y'>
              {categoryMsg.unresolvedQuestionCount}
            </Text>
            今日新增
            <Text className='number_y'>{categoryMsg.newQuestionCount}</Text>
          </View>
          <View
            className='intro_content'
            onTouchStart={showDetail}
            onTouchEnd={unShowDetail}>
            <View className='intro_cut'>{categoryMsg.subjectInfo}</View>

            {isShowDetail ? (
              <View className='intro_hide'>
                <Text decode={true} className='hide_content'>
                  {format(categoryMsg.subjectInfo)}
                </Text>
              </View>
            ) : (
              ''
            )}
          </View>
        </View>
        <View>{props.rightOperate}</View>
      </View>
    </View>
  )
}
