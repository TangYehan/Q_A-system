import React, {ReactElement, useEffect, useRef, useState} from 'react'
import Taro, {useReachBottom, usePullDownRefresh} from '@tarojs/taro'

import httpUtils from '../../utils/request'
import {View, Image, Input} from '@tarojs/components'
import MessageItem from './components/MessageItem'
import LoadMore from '../../components/LoadMore'
import Empty from '../../components/Empty'

import './index.scss'

const initPageInfo = {
  currentPage: 1,
  pageSize: 7,
  totalRows: 0,
  totalPages: 1
}
let saveMessageList = []

export default function index(): ReactElement {
  const input = useRef<any>()
  const timer = useRef<undefined | NodeJS.Timeout>(undefined)
  const [messageList, setMessageList] = useState(saveMessageList)
  const [pageInfo, setPageInfo] = useState(initPageInfo)

  useEffect(() => {
    const data = {
      currentPage: pageInfo.currentPage,
      pageSize: pageInfo.pageSize
    }
    getMessageList(data)

    return () => {
      saveMessageList = []
    }
  }, [])

  useReachBottom(() => {
    const {currentPage, totalPages, pageSize} = pageInfo
    if (currentPage < totalPages) {
      let data: Object
      if (input.current)
        data = {keyWords: input.current, currentPage: currentPage + 1, pageSize}
      else data = {currentPage: currentPage + 1, pageSize}
      getMessageList(data)
    }
  })

  usePullDownRefresh(() => {
    saveMessageList = []
    getMessageList({currentPage: 1, pageSize: initPageInfo.pageSize})
    Taro.stopPullDownRefresh()
  })

  const getMessageList = data => {
    httpUtils
      .getMessageList(data)
      .then(res => {
        if (res.code !== 1) return Promise.reject('获取资讯失败')
        saveMessageList = [...saveMessageList, ...res.data.list]
        setMessageList(saveMessageList)
        setPageInfo(JSON.parse(JSON.stringify(res.data.pageInfo)))
      })
      .catch(err => {
        Taro.showToast({
          icon: 'none',
          title: String(err)
        })
      })
  }

  const searchInput = e => {
    if (timer.current) {
      clearTimeout(timer.current)
    }
    timer.current = setTimeout(() => {
      const value = e.detail.value.trim()
      let data: object
      if (value) data = {keyWords: value, currentPage: 1, pageSize: 7}
      else data = {currentPage: 1, pageSize: 7}
      saveMessageList = []
      getMessageList(data)
    }, 300)
  }

  return (
    <View className='message_list_page'>
      <View className='search_box'>
        <Image src='/img/common/search.svg' className='search_icon'></Image>
        <Input type='text' placeholder='搜索相关资讯' onInput={searchInput} />
      </View>
      <View className='message_list_item'>
        {messageList.length !== 0 ? (
          messageList.map((item: any) => (
            <MessageItem msg={item} key={item.newsId} />
          ))
        ) : (
          <Empty />
        )}
      </View>
      <LoadMore loading={pageInfo.currentPage < pageInfo.totalPages} />
    </View>
  )
}
