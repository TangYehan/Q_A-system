import Taro from '@tarojs/taro'

export const baseUrl = 'https://xscqa.cqupt.edu.cn/question'

export const baseImgUrl = 'https://xscqa.cqupt.edu.cn/question/img'

const baseRequest = function (params, method = 'GET') {
  const {url, data} = params
  const contentType = 'application/json'
  const option = {
    url: baseUrl + url,
    data: data,
    method: method,
    header: {'content-type': params.contentType || contentType},
    timeOut: 10000
  }
  return Taro.request(option)
}

const intercept = function (option, method) {
  return new Promise((resolve, reject) => {
    baseRequest(option, method).then(res => {
      if (res.statusCode === 200) resolve(JSON.parse(JSON.stringify(res.data)))
      else reject('网络错误')
    })
  })
}

export const get = function (url, data = '') {
  const option = {url, data}
  return intercept(option, 'GET')
}

export const post = function (
  url,
  data,
  contentType = 'application/x-www-form-urlencoded'
) {
  const option = {url, data, contentType}
  return intercept(option, 'post')
}
