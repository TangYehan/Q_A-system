import {SET_CATEGORY} from '../constant'
const initState = {
  subjectName: undefined,
  subjectId: undefined
}

export default (preState = initState, action) => {
  let {type, data} = action
  if (type === SET_CATEGORY) return Object.assign({}, data)
  else return preState
}
