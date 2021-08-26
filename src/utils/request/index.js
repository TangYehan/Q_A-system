import {get, post} from './http'
import {upLoadFile} from '../api'
class Https {
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
}

export default new Https()
