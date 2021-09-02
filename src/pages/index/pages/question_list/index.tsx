import React, {useEffect, ReactElement, useState, useRef} from 'react'
import Taro, {useReachBottom} from '@tarojs/taro'

import httpUtil from '../../../../utils/request'
import {View, Input, Image, Navigator} from '@tarojs/components'
import LoadMore from '../../../../components/LoadMore'
import QuestionCard from '../../../../components/QuestionCard'

import './index.scss'

export default function index(): ReactElement {
  const initPageInfo = {
    currentPage: 0,
    pageSize: 7,
    totalPages: 0,
    totalRows: 0
  }
  const [pageInfo, setPageInfo] = useState(initPageInfo)
  const [questionList, setQuestionList] = useState<any>([])
  useEffect(() => {
    const {subjectId, subjectName} = Taro.getCurrentInstance().router.params
  }, [])
  const searchInput = () => {}
  return (
    <View className='question_list_page'>
      <View className='search_box'>
        <View className='search_box_left'>
          <Image src='/img/common/search.svg' className='search_icon'></Image>
          <Input
            type='text'
            className='search_ipt'
            placeholder='{{searchPlaceholder}}'
            onInput={searchInput}
          />
        </View>
        <View>
          <i-switch
            value='{{state}}'
            size='large'
            bind:change='onChange'
            slot='footer'>
            <View slot='open'>已解</View>
            <View slot='close'>未解</View>
          </i-switch>
        </View>
      </View>
      {questionList.map(item => (
        <QuestionCard msg={item} />
      ))}
      <LoadMore loading={pageInfo.currentPage < pageInfo.totalPages} />
    </View>
  )
}
