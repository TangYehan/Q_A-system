import React, {ReactElement, useRef} from 'react'
import Taro from '@tarojs/taro'
import {connect} from 'react-redux'

import httpUtils from '../../utils/request'
import setChooseCategory from '../../redux/actions/choosedCategory'

import {View, Navigator, Text} from '@tarojs/components'
import TextPicUpload from '../../components/TextPicUpload'
import ThemeButton from '../../components/ThemeButton'

import './index.scss'

function AddQuestion(props): ReactElement {
  const questionIpt = useRef<any>()
  const delCurrentCategory = () => {
    props.setChooseCategory({subjectName: undefined, subjectId: undefined})
  }
  const submit = async () => {
    try {
      if (!props.accountId) throw '请登录'
      const {titleInput, detailInput, imgs} = questionIpt.current.getInput()
      if (!titleInput || !detailInput) {
        Taro.showToast({
          title: '请完善标题或内容',
          icon: 'none'
        })
        return
      }
      if (!props.choosedCategory.subjectId) {
        Taro.showToast({
          title: '请选择相应科目',
          icon: 'none'
        })
        return
      }
      Taro.showToast({
        icon: 'loading',
        title: '正在提交反馈',
        duration: 10000,
        mask: true
      })
      const data = {
        accountId: props.accountId,
        title: titleInput,
        describes: detailInput,
        subjectId: props.choosedCategory.subjectId
      }
      let res = imgs.length
        ? await httpUtils.submitQuestion({data, filePath: imgs[0]})
        : await httpUtils.submitQuestion({data})
      res = JSON.parse(res)
      if (Number(res.code) === 1) {
        questionIpt.current.clear()
        props.setChooseCategory({subjectName: undefined, subjectId: undefined})
        Taro.showToast({
          icon: 'success',
          title: '发布成功',
          duration: 1500
        })
      } else throw '出错啦~'
    } catch (err) {
      const errMsg = typeof err === 'string' ? err : '网络错误'
      Taro.showToast({
        icon: 'none',
        title: errMsg
      })
    }
  }

  return (
    <View className='add_question_page'>
      <View>
        <Navigator url='./pages/choose_category/index' className='add'>
          请添加问题类别
        </Navigator>
        <View className='choosed_category'>
          {props.choosedCategory.subjectName ? (
            <View className='choosed_category_item'>
              {props.choosedCategory.subjectName}
              <Text className='delete' onClick={delCurrentCategory}>
                ✕
              </Text>
            </View>
          ) : (
            ''
          )}
        </View>
      </View>
      <View className='ipt_container'>
        <TextPicUpload ref={questionIpt} />
        <ThemeButton className='btn' onClick={submit}>
          发布问题
        </ThemeButton>
      </View>
    </View>
  )
}

export default connect(
  (state: any) => ({
    choosedCategory: state.choosedCategory,
    accountId: state.userInfo.accountId
  }),
  {
    setChooseCategory
  }
)(AddQuestion)
