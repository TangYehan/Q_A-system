import {CHANGE_LOGIN_STATUS} from '../constant'
const initState = false

export default (preState = initState, action) => {
  let {type} = action
  if (type === CHANGE_LOGIN_STATUS) return !preState
  else return preState
}
