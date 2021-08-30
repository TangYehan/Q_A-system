import {get, post} from './http'
import {upLoadFile} from '../api'
class Https {
  /**
   * 获取图片
   */
  getImgs = params => get('/resource/listImgByType', params)

  /**
   * 根据uniqueId获取绑定的用户信息
   */
  getUserInfo = params => get('/account/getAccountByUniqueId', params)

  /**
   * 根据统一认证码（accountId）获取详细信息（个人简介...）
   */
  getAccountById = params => get('/account/getAccountById', params)

  /**
   * 编辑修改个人信息
   */
  editPersonal = ({filePath, data}) => {
    if (filePath)
      return upLoadFile({url: '/account/updateAccount', filePath, data})
    else
      return post(
        '/account/updateAccount',
        data,
        'application/x-www-form-urlencoded'
      )
  }

  /**
   * 获取反馈
   */
  getFeedbackList = param => get('/feedback/listFeedback', param)

  /**
   * 提交反馈
   */
  submitFeedback = ({data, filePath = undefined}) => {
    if (filePath)
      return upLoadFile({url: '/feedback/addFeedback', filePath, data})
    else
      return post(
        '/feedback/addFeedback',
        data,
        'application/x-www-form-urlencoded'
      )
  }

  /**
   * 点赞反馈
   */
  agreeFeedback = param => post('/feedback/agreeFeedback', param)

  /**
   * 取消点赞反馈
   */
  cancelAgreeFeedback = param => post('/feedback/cancelAgree', param)

  /**
   * 获取排行榜信息
   */
  getRankList = param => get('/account/showRank', param)
}

export default new Https()
