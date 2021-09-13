import {ReactElement, useEffect, useState} from 'react'
import Taro from '@tarojs/taro'

import {WebView} from '@tarojs/components'

export default function index(): ReactElement {
  const [url, setUrl] = useState('')
  useEffect(() => {
    const router = Taro.getCurrentInstance().router
    if (router) {
      let {type} = router.params
      console.log(type, type === 'login', Taro.getStorageSync('loginsrc'))
      const url = type === 'login' ? Taro.getStorageSync('loginSrc') : ''
      setUrl(url)
    }
  }, [])

  return <WebView src={url}></WebView>
}
