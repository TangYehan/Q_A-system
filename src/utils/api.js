import Taro from '@tarojs/taro'
import {baseUrl} from './request/http'

export const chooseImg = function (
  count,
  sizeType = ['original', 'compressed'],
  sourceType = ['album', 'camera']
) {
  return new Promise(function (resolve, reject) {
    Taro.chooseImage({
      count,
      sizeType,
      sourceType,
      success: function (res) {
        wx.showLoading({
          title: '上传中...'
        })
        const tempFilePaths = res.tempFilePaths
        resolve(tempFilePaths)
        wx.hideLoading()
      }
    })
  })
}

export const upLoadFile = function ({filePath, data, url}) {
  return new Promise((resolve, reject) => {
    Taro.uploadFile({
      filePath: filePath,
      name: 'img',
      url: baseUrl + url,
      formData: data,
      timeout: 2500,
      success: res => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(JSON.stringify(res.data)))
        } else reject('网络错误')
      },
      fail: res => reject(res)
    })
  })
}

export const format = function (str) {
  if (!str) return
  return str.replace(/\\n/gi, '\n').replace(/&nbsp;/gi, '&nbsp;')
}
