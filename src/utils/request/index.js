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

  /**
   * 获取回答详情
   */
  getAnswerDetail = param => get('/answer/getAnswerById', param)

  /**
   * 获取评论
   */
  getComment = param => get('/comment/listComment', param)

  /**
   * 采纳回答
   */
  acceptAnswer = param =>
    post('/question/accept', param, 'application/x-www-form-urlencoded')

  /**
   * 赞同回答
   */
  agreeAnswer = param =>
    post('/answer/agreeAnswer', param, 'application/x-www-form-urlencoded')

  /**
   * 取消赞同回答
   */
  cancelAgreeAnswer = param =>
    post('/answer/cancelAgree', param, 'application/x-www-form-urlencoded')

  /**
   * 发布评论
   */
  submitComment = param =>
    post('/comment/addComment', param, 'application/x-www-form-urlencoded')

  /**
   * 收藏问题
   */
  CollectionProblem = param =>
    post('/question/followQuestion', param, 'application/x-www-form-urlencoded')

  /**
   * 取消收藏问题
   */
  cancelCollectionProblem = param =>
    post('/question/cancelFollow', param, 'application/x-www-form-urlencoded')

  /**
   * 举报问题
   */
  reportQuestion = ({filePath = undefined, data}) => {
    if (filePath)
      return upLoadFile({url: '/question/reportQuestion', filePath, data})
    else
      return post(
        '/question/reportQuestion',
        data,
        'application/x-www-form-urlencoded'
      )
  }

  /**
   * 举报回答
   */
  reportAnswer = ({filePath = undefined, data}) => {
    if (filePath)
      return upLoadFile({url: '/answer/reportAnswer', filePath, data})
    else
      return post(
        '/answer/reportAnswer',
        data,
        'application/x-www-form-urlencoded'
      )
  }

  /**
   * 举报评论
   */
  reportComment = ({filePath = undefined, data}) => {
    if (filePath)
      return upLoadFile({url: '/comment/reportComment', filePath, data})
    else
      return post(
        '/comment/reportComment',
        data,
        'application/x-www-form-urlencoded'
      )
  }

  /**
   * 写回答
   */
  submitAnswer = ({filePath = undefined, data}) => {
    if (filePath) return upLoadFile({url: '/answer/addAnswer', filePath, data})
    else
      return post(
        '/answer/addAnswer',
        data,
        'application/x-www-form-urlencoded'
      )
  }

  /**
   * 获取所有学院
   */
  getAllCollege = param => get('/subject/listAllCollege')

  /**
   * 去登陆
   */
  login = param => get('/casLogin', param)
}

export default new Https()
