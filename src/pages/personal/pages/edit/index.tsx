import React, {ReactElement, useEffect, useState, useRef} from 'react'
import Taro from '@tarojs/taro'
import {connect} from 'react-redux'

import {View, Text, Image} from '@tarojs/components'
import Title from '../../../../components/Title/index'
import ThemeBotton from '../../../../components/ThemeButton/index'
import MyTextarea from '../../../../components/MyTextarea/index'

import {baseImgUrl} from '../../../../utils/request/http'
import {chooseImg} from '../../../../utils/api'
import httpUtils from '../../../../utils/request/index'

import introIcon from '../../../../img/userInfo/introduce_icon.svg'
import './index.scss'

interface stateProp {
  userInfo: {
    accountId: number | string
  }
}

function edit(props: stateProp): ReactElement {
  const [imgPath, setImgPath] = useState('')
  const [intro, setIntro] = useState<string | undefined>('')
  const inputText = useRef<any>()

  useEffect(() => {
    const router = Taro.getCurrentInstance().router
    if (router) {
      const {imagePath: propImg, intro: propIntro} = router.params
      setImgPath(baseImgUrl + propImg)
      setIntro(propIntro)
    }
  })

  const changeHeadImg = () => {
    chooseImg(1).then(res => {
      setImgPath(res[0])
    })
  }

  //获取子组件输入框内容
  const getInput = () => {
    return inputText.current.getText()
  }

  const submitEdit = async () => {
    Taro.showLoading({
      title: '保存中',
      mask: true
    })

    try {
      const newIntro = getInput()
      const oldImgPath = baseImgUrl + propImg
      if (newIntro !== intro || imgPath !== oldImgPath) {
        const data = {
          accountId: props.userInfo.accountId,
          introduction: newIntro
        }
        const res =
          oldImgPath === imgPath
            ? await httpUtils.editPersonal({data, filePath: undefined})
            : await httpUtils.editPersonal({data, filePath: imgPath})
        if (res.code !== 1) throw '出错啦'
      }
      Taro.hideLoading()
      Taro.showToast({
        icon: 'success',
        title: '保存成功',
        duration: 1000
      })

      setTimeout(_ => Taro.navigateBack(), 1000)
    } catch (err) {}
  }

  return (
    <View className='edit_page'>
      <View className='user_img_area'>
        <Image
          className='user_img_box'
          src={imgPath}
          onClick={changeHeadImg}></Image>
        <View className='change_img' onClick={changeHeadImg}>
          点击更换头像
        </View>
      </View>

      <Title icon={introIcon}>个人简介</Title>
      <View className='self_intro'>
        <MyTextarea
          myPlaceholder='请输入你的新简介'
          value={intro}
          ref={inputText}
        />
      </View>
      <ThemeBotton onClick={submitEdit}>保存</ThemeBotton>
    </View>
  )
}

export default connect((state: stateProp) => ({
  userInfo: state.userInfo
}))(edit)
