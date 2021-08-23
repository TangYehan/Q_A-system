import React from 'react'
import {Provider} from 'react-redux'
import store from './redux/store'

import './app.scss'

export default function App(props) {
  return <Provider store={store}>{props.children}</Provider>
}
