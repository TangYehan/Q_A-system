import React, {ReactElement, useEffect, useState} from 'react'
import Taro from '@tarojs/taro'
import {useReachBottom} from '@tarojs/taro'
import {View, Image, Text} from '@tarojs/components'

import Title from '@/components/Title'
import DynamicItem from '@/components/dynamicItem'
import LoadMore from '@/components/LoadMore'

import httpUtil from '@/utils/request'
import {format} from '@/utils/api'
import {baseImgUrl} from '@/utils/request/http'

import introIcon from '@/img/identity/introduce.svg'
import dynamicIcon from '@/img/identity/dynamic.svg'
import studentIcon from '@/img/identity/student.svg'
import volunteerIcon from '@/img/identity/volunteer.svg'
import managerIcon from '@/img/identity/manager.svg'
import teacherIcon from '@/img/identity/teacher.svg'
import levelIcon from '@/img/userInfo/level.svg'

import './index.scss'

export default function index(): ReactElement {
  const initPageInfo = {
    currentPage: 1,
    pageSize: 6,
    totalPages: 0
  }

  const [pageInfo, setPageInfo] = useState(initPageInfo)
  const [accountId, setAccoutId] = useState<string | number>()
  const [personalInfo, setPersonalInfo] = useState<any>({})
  const [dynamicList, setDynamicList] = useState<Array<{}>>([])

  useEffect(() => {
    const router = Taro.getCurrentInstance().router
    if (router) {
      const {accountId: _accountId} = router.params
      setAccoutId(_accountId)

      const data = {
        type: 2,
        currentPage: pageInfo.currentPage,
        pageSize: pageInfo.pageSize,
        accountId: _accountId
      }
      getPersonalInfo({accountId: _accountId})
      getDynamic(data)
    }
  }, [])

  useReachBottom(() => {
    const {totalPages, currentPage, pageSize} = pageInfo
    if (currentPage < totalPages) {
      const data = {accountId, pageSize, currentPage: currentPage + 1, type: 2}
      getDynamic(data)
    }
  })

  const getPersonalInfo = data => {
    httpUtil
      .getAccountById(data)
      .then(res => {
        if (res.code !== 1) return Promise.reject('获取用户信息失败')
        setPersonalInfo(JSON.parse(JSON.stringify(res.data)))
      })
      .catch(err => {
        Taro.showToast({
          title: String(err),
          icon: 'none'
        })
      })
  }

  const getDynamic = data => {
    httpUtil
      .getDynamic(data)
      .then(res => {
        if (res.code !== 1) return Promise.reject('获取用户动态失败')
        setPageInfo(JSON.parse(JSON.stringify(res.data.pageInfo)))
        setDynamicList([...dynamicList, ...res.data.list])
      })
      .catch(err => {
        Taro.showToast({
          title: String(err),
          icon: 'none'
        })
      })
  }

  const preViewPic = () => {
    Taro.previewImage({
      current: baseImgUrl + personalInfo.imgPath,
      urls: [baseImgUrl + personalInfo.imgPath]
    })
  }

  return (
    <View className='other_index'>
      <View className='personal_card'>
        <View className='personal_info'>
          <Image
            src={personalInfo.imgPath ? baseImgUrl + personalInfo.imgPath : ''}
            onClick={preViewPic}
            data-src='{personalInfo.imgPath}'
            className='personal_img'></Image>
          <View className='personal_name'>{personalInfo.userName}</View>
          <View className='userInfo_detail'>
            <View className='userInfo_item'>
              <Image
                className='icon'
                src={
                  personalInfo.role == 3
                    ? studentIcon
                    : personalInfo.role == 2
                    ? volunteerIcon
                    : personalInfo.role == 4
                    ? managerIcon
                    : teacherIcon
                }></Image>
              <Text className='user_identity_text'>
                {personalInfo.role == 3
                  ? '学生'
                  : personalInfo.role == 2
                  ? '志愿者'
                  : personalInfo.role == 4
                  ? '管理员'
                  : '老师'}
              </Text>
            </View>
            {/* <View className="userInfo_item">
            <Image src="/img/userInfo/degree.svg" className="icon"></Image>
            <View>本科</View>
          </View> */}
            <View className='userInfo_item'>
              <Image src={levelIcon} className='icon'></Image>
              <View>
                {personalInfo.score > 2000
                  ? '名冠天下'
                  : personalInfo.score > 1000
                  ? '名扬四海'
                  : personalInfo.score > 500
                  ? '远近闻名'
                  : personalInfo.score > 200
                  ? '小有名气'
                  : personalInfo.score > 120
                  ? '锋芒毕露'
                  : personalInfo.score > 50
                  ? '崭露头角'
                  : '默默无闻'}
              </View>
            </View>
          </View>
        </View>
        <View className='question_detail'>
          <View className='question_item'>
            <span className='number'>{personalInfo.questionCount}</span>
            <span>提问</span>
          </View>
          <View className='question_item'>
            <span className='number'>{personalInfo.answerCount}</span>
            <span>回答</span>
          </View>
          <View className='question_item'>
            <span className='number'>{personalInfo.collectionCount}</span>
            <span>收藏</span>
          </View>
          <View className='question_item'>
            <span className='number'>{personalInfo.solveCount}</span>
            <span>采纳</span>
          </View>
          <View className='question_item'>
            <span className='number'>{personalInfo.agreeCount}</span>
            <span>赞同</span>
          </View>
        </View>
      </View>
      <View className='personal_intro'>
        <Title icon={introIcon}>个人简介</Title>
        <View className='introduce_text'>
          <Text decode={true}>{format(personalInfo.introduce)}</Text>
        </View>
      </View>
      <View className='dynamic'>
        <Title icon={dynamicIcon}>最新动态</Title>
        {dynamicList.length === 0
          ? ''
          : dynamicList.map(item => <DynamicItem msg={item} />)}
      </View>
      <LoadMore loading={pageInfo.currentPage < pageInfo.totalPages} />
    </View>
  )
}
