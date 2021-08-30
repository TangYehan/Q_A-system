import React, {ReactElement, useState, useImperativeHandle} from 'react'
import Taro from '@tarojs/taro'
import {chooseImg} from '../../utils/api'
import {View, Text, Image, Textarea} from '@tarojs/components'
import pic from '../../img/timg.jpg'
import './index.scss'

interface Props {}
const allowMaxPic = 3
export default React.forwardRef((props: Props, ref) => {
  const [img, setImg] = useState<string[]>([])
  //暴露给父组件输入框内容
  useImperativeHandle(ref, () => ({
    getpics: () => img,
    clear: () => setImg([])
  }))

  const uploadPic = () => {
    if (img.length >= allowMaxPic) {
      Taro.showToast({
        icon: 'none',
        title: `最多上传${allowMaxPic}张图哦`
      })
      return
    }
    chooseImg(allowMaxPic - img.length).then(res => {
      setImg([...res, ...img])
    })
  }

  const preView = e => {
    Taro.previewImage({
      current: e, // 当前显示图片的http链接
      urls: img // 需要预览的图片http链接列表
    })
  }

  const deleteItem = e => {
    const newImg = [...img]
    newImg.splice(e, 1)
    setImg(newImg)
  }

  return (
    <View className='picture_container'>
      {img.map((item, index) => (
        <View className='cache_item'>
          <Image
            mode='aspectFill'
            key={item}
            src={item}
            className='item_pic'
            onClick={() => preView(item)}
          />
          <View
            className='item_delet'
            data-index={index}
            onClick={_ => deleteItem(index)}>
            ✕
          </View>
        </View>
      ))}
      <View className='upload_pic' onClick={uploadPic}>
        <Text>+</Text>
      </View>
    </View>
  )
})
