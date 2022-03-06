import React, {ReactElement, useState, useRef} from 'react'
import {connect} from 'react-redux'
import Taro, {usePullDownRefresh, useDidShow} from '@tarojs/taro'

import {
  View,
  Swiper,
  SwiperItem,
  Navigator,
  Image,
  Text,
  ScrollView
} from '@tarojs/components'
import Title from '@/components/Title'
import QuestionCard from '@/components/QuestionCard'

import changeLoginStatus from '../../redux/actions/login'
import {setUserInfo} from '../../redux/actions/userInfo'
import httpUtils from '@/utils/request/index'
import {baseImgUrl} from '@/utils/request/http'

import tempSwiperImg from '@/img/cqupt.jpg'
import showArrow from '@/img/common/show.svg'
import showMoreIcon from '@/img/more.svg'
import titleIcon from '@/img/identity/volunteer.svg'
import './index.scss'

function Index(props): ReactElement {
  const [isLoading, setIsLoading] = useState(true)
  const [swiperImgs, setSwiperImgs] = useState([])
  const [basicCourses, setBasicCourses] = useState([])
  const [professionalCourses, setProfessionalCourses] = useState([])
  const [collegeList, setCollegeList] = useState([])
  const [chooseCollege, setChooseCollege] = useState(false)
  const [otherDetail, setOtherDetail] = useState<any>({})
  const [currentCollege, setCurrentCollege] = useState('')
  const currentLoginStatus = useRef(false)

  useDidShow(() => {
    if (currentLoginStatus.current) return
    const uniqueId = Taro.getStorageSync('uniqueId')
    if (uniqueId) {
      httpUtils
        .getUserInfo({uniqueId})
        .then(res => {
          if (res.code !== 1 || res.data === null) {
            Taro.clearStorage()
            return Promise.reject('请登录')
          }

          props.changeLoginStatus()
          currentLoginStatus.current = true

          props.setUserInfo(JSON.parse(JSON.stringify(res.data)))
          Taro.setStorageSync('accountId', res.data.accountId)
          Taro.setStorageSync('college', res.data.college)
          setCurrentCollege(res.data.college)

          if (res.data.loginScore !== 0) {
            Taro.showToast({
              title: `签到成功，积分+${res.data.loginScore}`,
              icon: 'none'
            })
          }
          return Promise.all(
            [
              getSwiper(),
              getBasicSubject(),
              listSubjectByCollege(res.data.college),
              getOtherDetail(),
              getUnread()
            ].map(item =>
              item.catch(err => {
                Taro.showToast({title: String(err), icon: 'none'})
              })
            )
          )
        })
        .then(res => {
          setIsLoading(false)
        })
        .catch(err => {
          Taro.showToast({
            title: String(err),
            icon: 'none',
            duration: 2000,
            mask: true
          })
        })
    }
  })

  //下拉刷新
  usePullDownRefresh(() => {
    Promise.all(
      [
        getSwiper(),
        getBasicSubject(),
        listSubjectByCollege(currentCollege),
        getOtherDetail(),
        getUnread()
      ].map(item =>
        item.catch(err => {
          console.log(err)
          Taro.showToast({title: String(err), icon: 'none'})
        })
      )
    ).then(res => {
      setIsLoading(false)
      Taro.stopPullDownRefresh()
    })
  })

  //获取轮播图
  const getSwiper = () => {
    return new Promise((resolve, reject) => {
      httpUtils
        .getImgs({type: 1})
        .then(res => {
          if (res.code !== 1) return Promise.reject('获取轮播图失败')
          setSwiperImgs(JSON.parse(JSON.stringify(res.data)))
          resolve('')
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  //获取基础课程
  const getBasicSubject = () => {
    return new Promise((resolve, reject) => {
      httpUtils
        .listSubjectByCollege({college: '基础课程'})
        .then(res => {
          if (res.code !== 1) return Promise.reject('获取基础课程失败')
          let {data} = res
          if (data.length >= 9) {
            data = data.slice(0, 9)
          }
          setBasicCourses(data)
          resolve('')
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  //获取对应学院的专业课程
  const listSubjectByCollege = collegeName => {
    return new Promise((resolve, reject) => {
      httpUtils
        .listSubjectByCollege({college: collegeName})
        .then(res => {
          if (res.code !== 1) return Promise.reject('获取专业课程失败')
          let {data} = res
          if (data.length >= 9) {
            data = data.slice(0, 9)
          }
          setProfessionalCourses(data)
          resolve('')
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  const showAllCollege = () => {
    if (!props.isLogin) {
      Taro.showToast({
        title: '未登录',
        icon: 'none'
      })
      return
    }
    if (collegeList.length === 0) {
      httpUtils
        .getAllCollege()
        .then(res => {
          if (res.code !== 1) return Promise.reject('获取课程失败')
          setCollegeList(JSON.parse(JSON.stringify(res.data)))
        })
        .catch(err =>
          Taro.showToast({
            title: String(err),
            icon: 'none'
          })
        )
    }
    setChooseCollege(true)
  }

  const cancelMask = () => {
    setChooseCollege(false)
  }

  const changeCollege = (e, collegeName) => {
    e.stopPropagation()
    setCurrentCollege(collegeName)
    listSubjectByCollege(collegeName)
    setChooseCollege(false)
  }

  //获取其他疑难中的一个问答
  const getOtherDetail = () => {
    return new Promise((resolve, reject) => {
      const data = {
        state: 0,
        currentPage: 1,
        pageSize: 1,
        subjectName: '其他疑难'
      }
      httpUtils
        .getQuestionList(data)
        .then(res => {
          if (res.code !== 1) return Promise.reject('获取其他疑难失败')
          setOtherDetail(JSON.parse(JSON.stringify(res.data.list[0])))
          resolve('')
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  //获取邮件小红点
  const getUnread = () => {
    return new Promise((resolve, reject) => {
      const accountId = Taro.getStorageSync('accountId')

      if (accountId) {
        httpUtils
          .getUnReadMsg({
            accountId
          })
          .then(res => {
            if (res.code !== 1) return Promise.reject('获取未读信息失败')
            if (res.data !== 0) {
              Taro.setTabBarBadge({
                index: 3,
                text: String(res.data)
              })
            }
            resolve('')
          })
          .catch(err => {
            reject(err)
          })
      }
    })
  }

  return (
    <View className='index_page'>
      <View>
        {isLoading ? '' : ''}
        <View>
          <Swiper className='Swiper' autoplay={true}>
            {swiperImgs.length ? (
              swiperImgs.map((item: any) => (
                <SwiperItem key={item.url}>
                  <Image
                    style={{
                      display: 'block',
                      margin: '0 auto',
                      padding: 0,
                      width: '100vw',
                      height: '100%'
                    }}
                    mode='aspectFill'
                    src={baseImgUrl + item.url}
                    className='img'
                  />
                </SwiperItem>
              ))
            ) : (
              <SwiperItem>
                <Image
                  style={{
                    display: 'block',
                    margin: '0 auto',
                    padding: 0,
                    width: '100vw',
                    height: '100%'
                  }}
                  src={tempSwiperImg}
                />
              </SwiperItem>
            )}
          </Swiper>

          <View className='box'>
            <Title icon={titleIcon}>基础课程</Title>
            {basicCourses.length ? (
              <View className='course'>
                {basicCourses.map((item: any) => (
                  <Navigator
                    url={`./pages/question_list/index?subjectName=${item.subjectName}&subjectId=${item.subjectId}`}
                    hoverClass='none'
                    className='course_item'
                    key={item.subjectId}
                    data-id={item.subjectId}
                    data-name={item.subjectName}>
                    <Image
                      src={baseImgUrl + item.imgPath}
                      className='course_item_img'></Image>
                    <Text className='course_item_text'>{item.subjectName}</Text>
                  </Navigator>
                ))}
                <Navigator
                  hoverClass='none'
                  className='course_item'
                  url={`./pages/show_more_course/index?college=基础课程`}
                  data-type='basic'>
                  <Image
                    src={showMoreIcon}
                    className='course_item_more_img'></Image>
                  <Text className='course_item_text'>更多</Text>
                </Navigator>
              </View>
            ) : (
              ''
            )}
          </View>

          <View className='box'>
            <View className='title_box'>
              <Title icon={titleIcon}>专业课程</Title>
              <View className='current_college' onClick={showAllCollege}>
                <View className='current_text'>当前：{currentCollege}</View>
                <Image src={showArrow} className='show'></Image>
              </View>
            </View>
            {professionalCourses.length ? (
              <View className='course'>
                {professionalCourses.map((item: any) => (
                  <Navigator
                    hoverClass='none'
                    url={`./pages/question_list/index?subjectName=${item.subjectName}&subjectId=${item.subjectId}`}
                    className='course_item'
                    key={item.subjectId}
                    data-id={item.subjectId}
                    data-name={item.subjectName}>
                    <Image
                      src={baseImgUrl + item.imgPath}
                      className='course_item_img'></Image>
                    <Text className='course_item_text'>{item.subjectName}</Text>
                  </Navigator>
                ))}
                <Navigator
                  hoverClass='none'
                  className='course_item'
                  url={`./pages/show_more_course/index?college=${currentCollege}`}>
                  <Image
                    src={showMoreIcon}
                    className='course_item_more_img'></Image>
                  <Text className='course_item_text'>更多</Text>
                </Navigator>
              </View>
            ) : (
              ''
            )}
          </View>

          <View className='box'>
            <Navigator
              hoverClass='none'
              className='other_question_title'
              url={`./pages/question_list/index?subjectName=其他疑难&subjectId=${undefined}`}>
              <Title icon={titleIcon}>其他疑难</Title>
              <Image src={showArrow} className='show'></Image>
            </Navigator>
            {otherDetail.question ? <QuestionCard msg={otherDetail} /> : ''}
          </View>
        </View>
      </View>

      {chooseCollege ? (
        <>
          <View className='choose_college_mask' onClick={cancelMask}></View>
          <ScrollView className='choose_college' scroll-y={true}>
            <View className='choose_college_title'>请选择学院</View>
            {collegeList.map((item: any) => (
              <View
                className='college_item'
                key={item.collegeName}
                data-name='13123'
                onClick={e => {
                  changeCollege(e, item.collegeName)
                }}>
                <View>{item.collegeName}</View>
                <View className='add_college'> + </View>
              </View>
            ))}
          </ScrollView>
        </>
      ) : (
        ''
      )}
    </View>
  )
}

export default connect((state: any) => ({isLogin: state.login}), {
  changeLoginStatus,
  setUserInfo
})(Index)
