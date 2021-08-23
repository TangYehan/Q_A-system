import React, {ReactElement, useState} from 'react'
import {View, Text, Image} from '@tarojs/components'
import Title from '../../../../components/Title/index.tsx'
import './index.scss'

import rankIcon from '../../../../img/userInfo/rank.svg'
import tipsIcon from '../../../../img/common/prompt.svg'
import ranking1 from '../../../../img/rank/rank1.svg'
// import ranking2 from '../../../../img/rank/rank2.svg'
// import ranking3 from '../../../../img/rank/rank3.svg'
// import ranking4 from '../../../../img/rank/rank4.svg'
// import ranking5 from '../../../../img/rank/rank5.svg'
// import ranking6 from '../../../../img/rank/rank6.svg'

export default function index(): ReactElement {
  const {activeRank, setActiveRank} = useState('allSchool')
  const changeRank = (event: {currentTarget; target}): void => {
    console.log(event)
  }
  return (
    <View className='rank_page'>
      <View className='my_rank_msg'>
        <View className='my_score_title'>成长总积分</View>
        <View className='my_score'>999</View>
        <View className='level'>段位：名扬四海</View>
      </View>
      <View className='rank_list'>
        <View className='list_title'>
          <View className='title_left'>
            <Image src={rankIcon} className='icon'></Image>
            <Text
              className='school_rank'
              data-rank='allSchool'
              onClick={changeRank}>
              全校总榜
            </Text>
            <Text data-rank='volunteer' onClick={changeRank}>
              志愿者榜
            </Text>
          </View>
          <View>
            No.<Text className='my_rank'>100</Text>
          </View>
        </View>

        <View className='rank_item'>
          <View className='item_left'>
            <Image src={ranking1} className='ranking_icon'></Image>
            <Image src='' className='user_head'></Image>
            <View className='name_level'>
              <Text className='user_name'>唐椰涵</Text>
              <Text>最强王者</Text>
            </View>
          </View>
          <View className='item_right'>
            <Text className='user_score'>总积分</Text>
            <Text>999</Text>
          </View>
        </View>
      </View>
      <View className='rank_explain'>
        <Title icon={tipsIcon}>排行榜说明</Title>
        <View className='explain_detail'>
          排行榜说明排行榜说明排行榜说明排行榜说明排行榜说明排行榜说明排行榜说明排行榜说明排行榜说明排行榜说明排行榜说明排行榜说明
        </View>
      </View>
    </View>
  )
}
