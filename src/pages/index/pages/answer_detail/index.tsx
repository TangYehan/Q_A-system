import React, {useEffect, ReactElement, useState, useRef} from 'react'
import Taro, {useReachBottom} from '@tarojs/taro'
import {connect} from 'react-redux'
import httpUtil from '../../../../utils/request'
import {View, Navigator} from '@tarojs/components'
import QustionDetailCard from '../../components/QuestionDetailCard'
import './index.scss'
import '../../../../img/operate/iconfont.css'

export default function index(): ReactElement {
  return <View></View>
}
