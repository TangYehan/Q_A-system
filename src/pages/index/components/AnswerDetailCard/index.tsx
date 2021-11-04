import React, {ReactElement, useEffect, useState, useRef} from 'react'
import Taro from '@tarojs/taro'
import {View, Image, Text, Navigator} from '@tarojs/components'

import httpUtil from '../../../../utils/request'
import {baseImgUrl} from '../../../../utils/request/http'
import {format} from '../../../../utils/api'

import studentIcon from '../../../../img/identity/student.svg'
import managerIcon from '../../../../img/identity/manager.svg'
import volunteerIcon from '../../../../img/identity/volunteer.svg'
import teacherIcon from '../../../../img/identity/teacher.svg'
import './index.scss'
import '../../../../img/operate/iconfont.css'

interface Props {
  questioner: string | number
  currentUser: string | number
  questionId: number
  answerDetail: {
    [propName: string]: any
  }
}

export default function index(props: Props): ReactElement {
  const [answer, setAnswer] = useState<any>({})
  const canClickAgree = useRef(true)
  const canClickAdopt = useRef(true)

  useEffect(() => {
    setAnswer(props.answerDetail)
  }, [props.answerDetail])

  const gotoPersonal = e => {
    e.stopPropagation()
    Taro.navigateTo({
      url: `/pages/index/pages/other_index/index?accountId=${answer.accountId}`
    })
  }

  const handleAdopt = async () => {
    if (!canClickAdopt.current) return
    if (answer.isAdopt) return
    canClickAdopt.current = false
    const newState = !answer.isAdopt
    try {
      const data = {
        questionId: props.questionId,
        answerId: answer.answerId,
        accountId: props.currentUser
      }
      const res = await httpUtil.acceptAnswer(data)
      if (res.code !== 1) throw '采纳问题失败'
      else {
        const newData = answer
        newData.isAdopt = newState
        setAnswer(Object.assign({}, newData))
      }
    } catch (err) {
      Taro.showToast({
        title: String(err),
        icon: 'none'
      })
    }
    canClickAdopt.current = true
  }

  const handleAgree = async () => {
    if (!canClickAgree.current) return
    canClickAdopt.current = false
    try {
      let newAnswerDetail = answer
      newAnswerDetail.isAgree = newAnswerDetail.isAgree ? 0 : 1
      newAnswerDetail.isAgree
        ? newAnswerDetail.agreeCount++
        : newAnswerDetail.agreeCount--
      setAnswer(Object.assign({}, newAnswerDetail))

      const data = {
        accountId: props.currentUser,
        answerId: answer.answerId
      }
      const isAgree = newAnswerDetail.isAgree
      const res = isAgree
        ? await httpUtil.agreeAnswer(data)
        : await httpUtil.cancelAgreeAnswer(data)
      if (res.code !== 1) throw '点赞失败'
    } catch (err) {
      Taro.showToast({
        title: String(err),
        icon: 'none'
      })
    }
    canClickAdopt.current = true
  }

  const handleComment = () => {
    Taro.navigateTo({
      url: `../write_comment/index?answerId=${answer.answerId}&answerUser=${answer.userName}`
    })
  }

  const preView = () => {
    Taro.previewImage({
      current: baseImgUrl + answer.contentImg,
      urls: [baseImgUrl + answer.contentImg]
    })
  }

  return (
    <View className='answer_detail'>
      <View className='user_infor' onClick={gotoPersonal}>
        <View className='left_info'>
          <View className='user_head'>
            <Image
              className='user_head_img'
              src={answer.userImg ? baseImgUrl + answer.userImg : ''}></Image>
            <Text>{answer.userName}</Text>
          </View>
          <View className='user_identity'>
            <Image
              className='user_identity_icon'
              src={
                answer.role == 3
                  ? studentIcon
                  : answer.role == 2
                  ? volunteerIcon
                  : answer.role == 4
                  ? managerIcon
                  : teacherIcon
              }></Image>
            <Text className='user_identity_text'>
              {answer.role == 3
                ? '学生'
                : answer.role == 2
                ? '志愿者'
                : answer.role == 4
                ? '管理员'
                : '老师'}
            </Text>
          </View>
        </View>
        <View className='right_operate'>
          {answer.isAdopt ? <View className='status'>已采纳</View> : ''}
          <Navigator
            className='iconfont icon-jubao'
            url={`../../pages/report/index?type=1&content=${
              answer.answerId
            }&content=${encodeURIComponent(answer.content)}`}></Navigator>
        </View>
      </View>
      <View className='answer_content'>
        <Text decode={true} className='content_text'>
          {format(answer.content)}
        </Text>
        {answer.contentImg && answer.contentImg !== '-1' ? (
          <Image
            mode='widthFix'
            onClick={preView}
            className='content_img'
            src={baseImgUrl + answer.contentImg}></Image>
        ) : (
          ''
        )}
      </View>
      <View className='footer'>
        <View className='footer_left'>
          {answer.agreeCount} 赞同 {answer.commentCount} 评论
        </View>
        <View className='footer_right'>{answer.answerTime}</View>
      </View>
      <View className='footer_operate'>
        <View className='footer_tips'>看完回答，您可能还会进行以下操作</View>
        <View className='operate'>
          {props.questioner === props.currentUser ? (
            <View className='operate_item' onClick={handleAdopt}>
              <View
                className={`iconfont icon-chuizi ${
                  answer.isAdopt ? 'adopted' : ''
                }`}></View>
              <View>采纳</View>
            </View>
          ) : (
            ''
          )}

          <View className='operate_item' onClick={handleAgree}>
            <View
              className={`iconfont icon-taoxin ${
                answer.isAgree ? 'agreed' : ''
              }`}></View>
            <View>赞同</View>
          </View>
          <View className='operate_item' onClick={handleComment}>
            <View className='iconfont icon-message'></View>
            <View>评论</View>
          </View>
        </View>
      </View>
    </View>
  )
}
