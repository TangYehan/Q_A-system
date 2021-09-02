import React, {Fragment, ReactElement, useState, useEffect, useRef} from 'react'
import {connect} from 'react-redux'
import Taro, {
  usePullDownRefresh,
  useDidShow,
  useReachBottom
} from '@tarojs/taro'
import httpUtils from '../../utils/request'
import {View, Text, Image} from '@tarojs/components'
import DynamicItem from './components/dynamicItem'
import CollectionMyquestionItem from '../../components/QuestionCard'
import InvitationItem from './components/invitationItem'
import LoadMore from '../../components/LoadMore'

import './index.scss'
import dynamicIcon from '../../img/email/dynamic.svg'
import invitationIcon from '../../img/email/write.svg'
import collectionIcon from '../../img/email/collection.svg'
import myquestionIcon from '../../img/email/myquestion.svg'

function Email(props: {accountId: number | string}): ReactElement {
  const initPageInfo = {
    currentPage: 0,
    pageSize: 5,
    totalPages: 0,
    totalRows: 0
  }
  const [currentType, setCurrentType] = useState('dynamic')
  const [collectionList, setCollectionList] = useState<any>([])
  const [dynamicList, setDynamicList] = useState<any>([])
  const [myQuestionList, setMyQuestionList] = useState<any>([])
  const [invitationList, setInvitationList] = useState<any>([])
  const [currentPageInfo, setCurrentPageInfo] = useState({
    currentPage: 0,
    totalPages: 1
  })
  const dynamicPageInfo = useRef(initPageInfo)
  const myQuestionPageInfo = useRef(initPageInfo)
  const invitationPageInfo = useRef(initPageInfo)
  const collectionPageInfo = useRef(initPageInfo)
  const isLogin = useRef(false)

  const topBarConfig = [
    {
      icon: dynamicIcon,
      type: 'dynamic',
      text: '动态',
      backgroundColor: '#6BA1DD'
    },
    {
      icon: invitationIcon,
      type: 'invitation',
      text: '邀请回答',
      backgroundColor: '#FF8D1A'
    },
    {
      icon: collectionIcon,
      type: 'collection',
      text: '收藏',
      backgroundColor: '#F87053'
    },
    {
      icon: myquestionIcon,
      type: 'myquestion',
      text: '我的提问',
      backgroundColor: '#2DC4BA'
    }
  ]

  useDidShow(() => {
    console.log(123)
    if (!isLogin.current && props.accountId) {
      isLogin.current = true
      Taro.startPullDownRefresh()
    } else return
  })

  useEffect(() => {
    switch (currentType) {
      case 'dynamic':
        if (dynamicList.length === 0) {
          getDynamicList()
        }
        break
      case 'invitation':
        if (invitationList.length === 0) {
          getInvitationList()
        }
        break
      case 'collection':
        if (collectionList.length === 0) {
          getCollectionList()
        }
        break
      case 'myquestion':
        if (myQuestionList.length === 0) {
          getMyQuestionList()
        }
        break
      default:
        console.log('default')
        break
    }
  }, [currentType])

  useReachBottom(() => {
    if (!isLogin.current) return
    switch (currentType) {
      case 'dynamic':
        if (
          dynamicPageInfo.current.currentPage <
          dynamicPageInfo.current.totalPages
        ) {
          getDynamicList()
        }
        break
      case 'invitation':
        if (
          invitationPageInfo.current.currentPage <
          invitationPageInfo.current.totalPages
        ) {
          getInvitationList()
        }
        break
      case 'collection':
        if (
          collectionPageInfo.current.currentPage <
          collectionPageInfo.current.totalPages
        ) {
          getCollectionList()
        }
        break
      case 'myquestion':
        if (
          myQuestionPageInfo.current.currentPage <
          myQuestionPageInfo.current.totalPages
        ) {
          getMyQuestionList()
        }
        break
    }
  })

  usePullDownRefresh(() => {
    dynamicPageInfo.current = initPageInfo
    myQuestionPageInfo.current = initPageInfo
    invitationPageInfo.current = initPageInfo
    collectionPageInfo.current = initPageInfo
    switch (currentType) {
      case 'dynamic':
        getDynamicList(true)
        setInvitationList([])
        setCollectionList([])
        setMyQuestionList([])
        break
      case 'invitation':
        getInvitationList(true)
        setDynamicList([])
        setCollectionList([])
        setMyQuestionList([])
        break
      case 'collection':
        getCollectionList(true)
        setDynamicList([])

        setInvitationList([])
        setMyQuestionList([])
        break
      case 'myquestion':
        getMyQuestionList(true)
        setDynamicList([])
        setCollectionList([])
        setInvitationList([])
        break
      default:
        break
    }
    Taro.stopPullDownRefresh()
  })

  const changeItem = type => {
    setCurrentType(type)
  }

  const getDynamicList = (clear = false) => {
    console.log(props.accountId)
    if (!props.accountId) return
    const data = {
      type: 1,
      accountId: props.accountId,
      currentPage: dynamicPageInfo.current.currentPage + 1,
      pageSize: dynamicPageInfo.current.pageSize
    }
    httpUtils
      .getDynamic(data)
      .then(res => {
        if (res.code !== 1) return Promise.reject('获取失败')
        dynamicPageInfo.current = JSON.parse(JSON.stringify(res.data.pageInfo))
        clear
          ? setDynamicList([...res.data.list])
          : setDynamicList([...dynamicList, ...res.data.list])
        setCurrentPageInfo({
          currentPage: dynamicPageInfo.current.currentPage,
          totalPages: dynamicPageInfo.current.totalPages
        })
      })
      .catch(err => {
        const errMsg = typeof err === 'string' ? err : String(err)
        Taro.showToast({
          title: errMsg,
          icon: 'none'
        })
      })
  }

  const getCollectionList = (clear = false) => {
    if (!props.accountId) return
    const data = {
      relatedType: 2,
      accountId: props.accountId,
      currentPage: collectionPageInfo.current.currentPage + 1,
      pageSize: collectionPageInfo.current.pageSize
    }
    httpUtils
      .getAboutMyQuestion(data)
      .then(res => {
        if (res.code !== 1) return Promise.reject('获取失败')
        collectionPageInfo.current = JSON.parse(
          JSON.stringify(res.data.pageInfo)
        )
        clear
          ? setCollectionList([...res.data.list])
          : setCollectionList([...collectionList, ...res.data.list])
        setCurrentPageInfo({
          currentPage: collectionPageInfo.current.currentPage,
          totalPages: collectionPageInfo.current.totalPages
        })
      })
      .catch(err => {
        const errMsg = typeof err === 'string' ? err : String(err)
        Taro.showToast({
          title: errMsg,
          icon: 'none'
        })
      })
  }

  const getInvitationList = (clear = false) => {
    if (!props.accountId) return
    const data = {
      accountId: props.accountId,
      currentPage: invitationPageInfo.current.currentPage + 1,
      pageSize: invitationPageInfo.current.pageSize
    }

    httpUtils
      .getInvitation(data)
      .then(res => {
        if (res.code !== 1) return Promise.reject('获取失败')
        invitationPageInfo.current = JSON.parse(
          JSON.stringify(res.data.pageInfo)
        )
        clear
          ? setInvitationList([...res.data.list])
          : setInvitationList([...invitationList, ...res.data.list])
        setCurrentPageInfo({
          currentPage: invitationPageInfo.current.currentPage,
          totalPages: invitationPageInfo.current.totalPages
        })
      })
      .catch(err => {
        const errMsg = typeof err === 'string' ? err : String(err)
        Taro.showToast({
          title: errMsg,
          icon: 'none'
        })
      })
  }

  const getMyQuestionList = (clear = false) => {
    if (!props.accountId) return
    const data = {
      relatedType: 1,
      accountId: props.accountId,
      currentPage: myQuestionPageInfo.current.currentPage + 1,
      pageSize: myQuestionPageInfo.current.pageSize
    }

    httpUtils
      .getAboutMyQuestion(data)
      .then(res => {
        if (res.code !== 1) return Promise.reject('获取失败')
        myQuestionPageInfo.current = JSON.parse(
          JSON.stringify(res.data.pageInfo)
        )
        clear
          ? setMyQuestionList([...res.data.list])
          : setMyQuestionList([...myQuestionList, ...res.data.list])
        setCurrentPageInfo({
          currentPage: myQuestionPageInfo.current.currentPage,
          totalPages: myQuestionPageInfo.current.totalPages
        })
      })
      .catch(err => {
        const errMsg = typeof err === 'string' ? err : String(err)
        Taro.showToast({
          title: errMsg,
          icon: 'none'
        })
      })
  }

  return (
    <View className='email_page'>
      <View className='top_banner'>
        {topBarConfig.map(item => (
          <Fragment key={item.type}>
            <View
              className='top_banner_item'
              onClick={() => changeItem(item.type)}>
              <View
                className={`item_img  ${
                  item.type === currentType ? 'item_click_class' : ''
                }`}
                style={{backgroundColor: item.backgroundColor}}>
                <Image className='item_icon' src={item.icon}></Image>
              </View>
              <View className='item_text'>{item.text}</View>
            </View>
          </Fragment>
        ))}
      </View>

      <View className='email_container'>
        {currentType === 'dynamic'
          ? dynamicList.map(item => <DynamicItem msg={item} />)
          : ''}
        {currentType === 'invitation'
          ? invitationList.map(item => <InvitationItem msg={item} />)
          : ''}
        {currentType === 'collection'
          ? collectionList.map(item => (
              <CollectionMyquestionItem
                msg={item}
                subjectLable={<Text className='label'>高数</Text>}
              />
            ))
          : ''}
        {currentType === 'myquestion'
          ? myQuestionList.map(item => (
              <CollectionMyquestionItem
                msg={item}
                subjectLable={<Text className='label'>高数</Text>}
              />
            ))
          : ''}
      </View>
      <LoadMore
        loading={currentPageInfo.currentPage < currentPageInfo.totalPages}
      />
    </View>
  )
}

export default connect((state: any) => ({
  accountId: state.userInfo.accountId
}))(Email)
