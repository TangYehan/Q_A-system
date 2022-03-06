import React, {useEffect, ReactElement, useState, useRef} from 'react'
import Taro, {useReachBottom} from '@tarojs/taro'
import httpUtil from '@/utils/request'

import {View} from '@tarojs/components'
import CommentItem from '../../components/CommentItem'
import LoadMore from '@/components/LoadMore'

import './index.scss'

export default function index(): ReactElement {
  const initPageInfo = {
    currentPage: 0,
    totalPages: 1,
    totalRows: 0,
    pageSize: 7
  }
  const [commentList, setCommentList] = useState<any>([])
  const [pageInfo, setPageInfo] = useState(initPageInfo)
  const curAnswerId = useRef<any>()

  useEffect(() => {
    const router = Taro.getCurrentInstance().router
    if (router) {
      let {answerId} = router.params
      curAnswerId.current = answerId
      const data = {
        answerId,
        currentPage: 1,
        pageSize: pageInfo.pageSize
      }
      getCommetList(data)
    }
  }, [])

  useReachBottom(() => {
    const data = {
      answerId: curAnswerId.current,
      currentPage: pageInfo.currentPage + 1,
      pageSize: pageInfo.pageSize
    }
    getCommetList(data)
  })

  const getCommetList = data => {
    httpUtil.getComment(data).then(res => {
      if (res.code !== 1) return Promise.reject('获取评论失败')
      setCommentList([
        ...commentList,
        ...JSON.parse(JSON.stringify(res.data.list))
      ])
      setPageInfo(JSON.parse(JSON.stringify(res.data.pageInfo)))
    })
  }

  const back = () => {
    Taro.navigateBack()
  }

  return (
    <View className='comments_list_page'>
      <View className='title'>
        全部评论
        <text className='back' onClick={back}>
          ×
        </text>
      </View>
      <View className='comments_list'>
        {commentList.map(item => (
          <CommentItem
            key={'comment_list_page' + item.commentId}
            comment={item}
          />
        ))}
        <LoadMore loading={pageInfo.currentPage < pageInfo.totalPages} />
      </View>
    </View>
  )
}
