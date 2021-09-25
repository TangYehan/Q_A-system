import {ReactElement, useEffect, useState} from 'react'
import Taro from '@tarojs/taro'

import {WebView} from '@tarojs/components'

export default function index(): ReactElement {
  const [url, setUrl] = useState('')
  useEffect(() => {
    const router = Taro.getCurrentInstance().router
    if (router) {
      let {type} = router.params
      const url =
        type === 'login'
          ? Taro.getStorageSync('loginsrc')
          : 'https://ids.cqupt.edu.cn/authserver/logout'
      setUrl(url)
    }
  }, [])

  return <>{url ? <WebView src={url}></WebView> : ''}</>
}
