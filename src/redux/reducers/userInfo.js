import {SET_USERINFO} from '../constant'

export default (preState = {}, action) => {
  const {type, data} = action
  if (type === SET_USERINFO) return Object.assign({}, data)
  else return preState
}
