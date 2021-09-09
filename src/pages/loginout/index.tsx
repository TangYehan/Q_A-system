import {ReactElement, useEffect, useState} from 'react'
import {WebView} from '@tarojs/components'

import './index.scss'

export default function index(): ReactElement {
  const [url, setUrl] = useState('')
  useEffect(() => {
    const router = Taro.getCurrentInstance().router
    if (router) {
      let {type} = router.params
      const url = type === 'login' ? Taro.getStorageSync('loginSrc') : ''
      setUrl(url)
    }
  }, [])

  return <WebView src={url}></WebView>
}
