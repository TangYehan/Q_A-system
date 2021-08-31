import {combineReducers} from 'redux'
import login from './login'
import userInfo from './userInfo'
import choosedCategory from './choosedCategory'

export default combineReducers({login, userInfo, choosedCategory})
