import React, {useEffect, ReactElement, useState, useRef} from 'react'
import Taro, {useReachBottom} from '@tarojs/taro'

import httpUtil from '../../../../utils/request'
import {View, Input, Image, Navigator} from '@tarojs/components'
import CategoryItem from '../../../../components/CategoryItem'

import showArrow from '../../../../img/common/show.svg'
import './index.scss'

export default function index(): ReactElement {
  const initPageInfo = {
    currentPage: 0,
    pageSize: 7,
    totalPages: 0,
    totalRows: 0
  }

  const [courseList, setCourseList] = useState<any>([])
  const [pageInfo, setPageInfo] = useState(initPageInfo)
  const [college, setCollege] = useState<undefined | string>(undefined)
  const [input, setInput] = useState('')
  const timer = useRef<NodeJS.Timeout | undefined>(undefined)

  useEffect(() => {
    const {college} = Taro.getCurrentInstance().router.params
    console.log(college)
    const {currentPage, pageSize} = pageInfo
    let data
    if (college) {
      data = {currentPage: currentPage + 1, pageSize, college}
      setCollege(college)
    } else {
      data = {currentPage: currentPage + 1, pageSize}
    }
    getCourse({data})
  }, [])

  useReachBottom(() => {
    const {currentPage, totalPages, pageSize} = pageInfo
    if (currentPage < totalPages) {
      const data = college
        ? input
          ? {college, keyWords: input, currentPage: currentPage + 1, pageSize}
          : {college, currentPage: currentPage + 1, pageSize}
        : input
        ? {currentPage: currentPage + 1, keyWords: input, pageSize}
        : {currentPage: currentPage + 1, pageSize}
      getCourse({data})
    }
  })

  const searchInput = e => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      console.log(123)
      const value = e.detail.value.trim()
      setInput(value)
      const data = value
        ? college
          ? {college, keyWords: value, currentPage: 1, pageSize: 7}
          : {currentPage: 1, keyWords: input, pageSize: 7}
        : college
        ? {currentPage: 1, pageSize: 7, college}
        : {currentPage: 1, pageSize: 7}
      getCourse({data, clear: true})
    }, 300)
  }

  const getCourse = ({data, clear = false}) => {
    httpUtil
      .getCouseList(data)
      .then(res => {
        if (res.code !== 1) return Promise.resolve('获取课程失败')
        setPageInfo(JSON.parse(JSON.stringify(res.data.pageInfo)))
        clear
          ? setCourseList([...res.data.list])
          : setCourseList([...courseList, ...res.data.list])
      })
      .catch(err => {
        Taro.showToast({
          title: String(err),
          icon: 'none',
          duration: 1500
        })
      })
  }

  return (
    <View className='choose_category_page'>
      <View className='search_box'>
        <Image src='/img/common/search.svg' className='search_icon'></Image>
        <Input type='text' placeholder='请输入学科' onInput={searchInput} />
      </View>
      <View className='list_container'>
        {courseList.map((item: any) => (
          <Navigator
            url={`../question_list/index?subjectId=${item.subjectId}&subjectName=${item.subjectName}`}>
            <CategoryItem
              categorayMsg={item}
              data-subjectid='{{item.subjectId}}'
              data-name='{{item.subjectName}}'
              key={'course_list' + item.subjectId}
              rightOperate={<Image src={showArrow} className='show'></Image>}
            />
          </Navigator>
        ))}
      </View>
    </View>
  )
}
