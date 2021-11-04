import React, {ReactElement, useEffect, useState} from 'react'
import Taro from '@tarojs/taro'
import {connect} from 'react-redux'

import {View, Text, Image} from '@tarojs/components'
import Title from '../../../../components/Title'
import RankItem from '../../components/rankItem'
import httpUtils from '../../../../utils/request'
import {baseImgUrl} from '../../../../utils/request/http'
import './index.scss'

import rankIcon from '../../../../img/userInfo/rank.svg'
import tipsIcon from '../../../../img/common/prompt.svg'
import ranking1 from '../../../../img/rank/rank1.svg'
import ranking2 from '../../../../img/rank/rank2.svg'
import ranking3 from '../../../../img/rank/rank3.svg'
import ranking4 from '../../../../img/rank/rank4.svg'
import ranking5 from '../../../../img/rank/rank5.svg'
import ranking6 from '../../../../img/rank/rank6.svg'

const rankingIcons = [
  ranking1,
  ranking2,
  ranking3,
  ranking4,
  ranking5,
  ranking6
]

function Rank(props: {accountId: string}): ReactElement {
  const [rankType, setRankType] = useState(0)
  const [rankList, setRankList] = useState([])
  const [userMsg, setUserMsg] = useState<any>({})
  const [img, setImg] = useState('')

  useEffect(() => {
    const data = {accountId: props.accountId, type: 0}
    getRankList(data)
    getImg()
  }, [])

  const changeRank = (type: number) => {
    if (type === rankType) return
    setRankType(type)
    getRankList({accountId: props.accountId, type})
  }

  const getRankList = data => {
    httpUtils
      .getRankList(data)
      .then(res => {
        setRankList(JSON.parse(JSON.stringify(res.data.list)))
        setUserMsg(JSON.parse(JSON.stringify(res.data.myData)))
      })
      .catch(err => {
        Taro.showToast({
          title: String(err),
          icon: 'none'
        })
      })
  }

  const getImg = () => {
    httpUtils
      .getImgs({type: 3})
      .then(res => {
        if (res.code !== 1) return Promise.reject()
        setImg(res.data[0])
      })
      .catch(err => {
        Taro.showToast({
          title: String(err),
          icon: 'none'
        })
      })
  }
  return (
    <View className='rank_page'>
      <View className='my_score'>
        <Image
          src={img ? baseImgUrl + img : ''}
          className='bg_img'
          mode='aspectFill'></Image>
        <View className='bg_text_container'>
          <View className='bg_text'>
            <View className='my_score_title'>成长总积分</View>
            <View className='my_score_num'>{userMsg.score}</View>
            <View className='my_score_level'>段位：名扬四海</View>
          </View>
        </View>
      </View>
      <View className='rank_list'>
        <View className='list_title'>
          <View className='title_left'>
            <Image src={rankIcon} className='icon'></Image>
            <Text
              className={`school_rank ${rankType === 0 ? 'active' : ''}`}
              onClick={() => changeRank(0)}>
              全校总榜
            </Text>
            <Text
              className={`volunteer ${rankType === 1 ? 'active' : ''}`}
              onClick={() => changeRank(1)}>
              志愿者榜
            </Text>
          </View>
          <View>
            No.<Text className='my_rank'>{userMsg.rank}</Text>
          </View>
        </View>
        <View>
          {rankList.map((item, index) => (
            <RankItem icon={rankingIcons[index]} userInfo={item} />
          ))}
        </View>
      </View>
      <View className='rank_explain'>
        <Title icon={tipsIcon}>排行榜说明</Title>
        <View className='explain_detail'>
          <Text>此排行榜的成员积分按邮问必答积分规则进行增加与减少。</Text>
        </View>
      </View>
    </View>
  )
}

export default connect((state: any) => ({accountId: state.userInfo.accountId}))(
  Rank
)
