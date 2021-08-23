import {get, post} from './http'

class Https {
  /**
   * 根据uniqueId获取绑定的用户信息
   */
  getUserInfo = params => get('/account/getAccountByUniqueId', params)

  /**
   * 根据统一认证码（accountId）获取详细信息（个人简介...）
   */
  getAccountById = params => get('/account/getAccountById', params)
}

export default new Https()
