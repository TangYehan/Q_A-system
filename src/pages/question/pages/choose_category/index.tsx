import React, {ReactElement, useEffect, useRef, useState} from 'react'
import Taro, {useReachBottom} from '@tarojs/taro'
import {connect} from 'react-redux'

import {View, Image, Input} from '@tarojs/components'
import CategoryItem from '../../../../components/CategoryItem'
import LoadMore from '../../../../components/LoadMore'
import httpUtils from '../../../../utils/request'
import setChooseCategory from '../../../../redux/actions/choosedCategory'

import './index.scss'
import searchIcon from '../../../../img/common/search.svg'

const initPageInfo = {
  currentPage: 1,
  pageSize: 7,
  totalRows: 0,
  totalPages: 1
}

let initCategoryList: any[] = []

function AddCategory(props: any): ReactElement {
  const [pageInfo, setPageInfo] = useState(initPageInfo)
  const [categoryList, setCategoryList] = useState(initCategoryList)
  const input = useRef()
  const timer = useRef<undefined | NodeJS.Timeout>(undefined)

  useEffect(() => {
    const data = {
      currentPage: pageInfo.currentPage,
      pageSize: pageInfo.pageSize
    }
    getCategoryList(data)

    return () => {
      initCategoryList = []
    }
  }, [])

  useReachBottom(() => {
    const {currentPage, totalPages, pageSize} = pageInfo
    if (currentPage < totalPages) {
      let data: Object
      if (input.current)
        data = {keyWords: input.current, currentPage: currentPage + 1, pageSize}
      else data = {currentPage: currentPage + 1, pageSize}
      getCategoryList(data)
    }
  })

  const getCategoryList = data => {
    httpUtils
      .searchSubject(data)
      .then(res => {
        if (res.code !== 1) return Promise.reject('出错啦~')
        initCategoryList = [...initCategoryList, ...res.data.list]
        setCategoryList(initCategoryList)
        setPageInfo(JSON.parse(JSON.stringify(res.data.pageInfo)))
      })
      .catch(err => {
        Taro.showToast({
          icon: 'none',
          title: err
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
      initCategoryList = []
      getCategoryList(data)
    }, 300)
  }

  const chooseCategory = ({subjectId, subjectName}) => {
    props.setChooseCategory({subjectId, subjectName})
    Taro.navigateBack()
  }

  return (
    <View className='choose_category_page'>
      <View className='search_box'>
        <Image src={searchIcon} className='search_icon'></Image>
        <Input type='text' onInput={searchInput} />
      </View>
      <View>
        {categoryList.map(item => (
          <CategoryItem
            categorayMsg={item}
            key={item.subjectId}
            rightOperate={
              <View className='add_btn' onClick={() => chooseCategory(item)}>
                添加
              </View>
            }
          />
        ))}
      </View>
      <LoadMore loading={pageInfo.currentPage < pageInfo.totalPages} />
    </View>
  )
}

export default connect(() => ({}), {
  setChooseCategory
})(AddCategory)
