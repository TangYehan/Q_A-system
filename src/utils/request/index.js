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

  /**
   * 获取科目
   */
  searchSubject = param => get('/subject/search', param)

  /**
   * 发布问题
   */
  submitQuestion = ({filePath = undefined, data}) => {
    if (filePath)
      return upLoadFile({url: '/question/addQuestion', filePath, data})
    else
      return post(
        '/question/addQuestion',
        data,
        'application/x-www-form-urlencoded'
      )
  }

  /**
   * 获取资讯列表
   */
  getMessageList = param => get('/news/listNews', param)

  /**
   * 获取资讯详情
   */
  getMessageDetail = param => get('/news/getNewsById', param)

  /**
   * 获取动态
   */
  getDynamic = param => get('/email/showDynamic', param)

  /**
   * 查看用户收藏/提出的问题
   */
  getAboutMyQuestion = param => get('/question/relatedQuestion', param)

  /**
   * 获取邀请回答
   */
  getInvitation = param => get('/email/showMyInvitation', param)

  /**
   * 获取背景图片
   */
  getImgs = param => get('/resource/listImgByType', param)

  /**
   * 获取课程信息
   */
  listSubjectByCollege = param => get('/subject/listSubjectByCollege', param)

  /**
   * 查询得到课程详细信息
   */
  getCouseList = param => get('/subject/search', param)

  /**
   * 获取问题列表
   */
  getQuestionList = param => get('/question/search', param)

  /**
   * 根据问题Id获取问题详情
   */
  getQuestionDetailById = param => get('/question/getQuestionById', param)

  /**
   * 获取回答列表
   */
  getAnswerList = param => get('/answer/listAnswer', param)
}

export default new Https()
