import React, {ReactElement, useEffect, useState} from 'react'
import Taro from '@tarojs/taro'
import {connect} from 'react-redux'

import {View, Text, Image} from '@tarojs/components'
import Title from '@/components/Title'
import RankItem from '../../components/rankItem'
import httpUtils from '@/utils/request'
import {baseImgUrl} from '@/utils/request/http'
import './index.scss'

import rankIcon from '@/img/userInfo/rank.svg'
import tipsIcon from '@/img/common/prompt.svg'
import ranking1 from '@/img/rank/rank1.svg'
import ranking2 from '@/img/rank/rank2.svg'
import ranking3 from '@/img/rank/rank3.svg'
import ranking4 from '@/img/rank/rank4.svg'
import ranking5 from '@/img/rank/rank5.svg'
import ranking6 from '@/img/rank/rank6.svg'

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
          <Text decode>【通过登录获取积分】

[普通同学]
1.	每日登录小程序并签到获取积分1分
2.	连续三天在小程序签到积分在第三天获得额外的5分
3.	连续一周在小程序进行签到积分在第七天获得额外的10分

[答疑志愿者]
1.	每日登录签到获取积分  +1分
2.	连续三天在小程序签到积分在第三天获得额外的+5分
3.	连续一周在小程序进行签到积分在第七天获得额外的+10分
【说明：每天签到均有1分，连续三天签到即1+1+1+5=8分，连续七天签到即1*7+5+10=22分。以每周为单位，下周清除前周累计天数】

【答疑获取积分】
[答疑者（学生志愿者）]
【基础课程和专业课程】
1.	答疑者成功进行有效答疑 +30分
2.	答疑者的回答的答案被采纳 +30分/次
3.	答疑志愿者答疑次数（每月计算）：
1）0~10次 +30分
2）10~30次 + 40分
3）>30次 +50分
（注：答疑次数在十次以内每月获得30分的额外加分，答疑次数在十次到三十次获得40分的额外加分以此类推，每个分数段获取相应的额外加分，不进行累加）
4.	答疑志愿者的回答被其他同学点赞/评论 +10分/次
【其他疑难】
1.	答疑志愿者成功有效地进行答疑 +15分
2.	答疑志愿者的回答被采纳 +10分
[普通同学]
【基础课程和专业课程】
1.	普通同学成功进行有效答疑 +30分
2.	普通同学的回答的答案被采纳 +30分/次
3.	普通同学的回答被其他同学点赞/评论 +10分/次
【其他疑难】
5.	普通同学成功有效地进行答疑 +15分
6.	普通同学的回答被提问者采纳 +10分

【提问获取积分】
[提问者]（以一天为单位计算上限）
1.	在小程序上成功正确地发布问题 +10分/次（上限五次）
2.	在提问过程中正确采纳答疑者的答案 +10分/次 （上限五次）
3.	对答疑者的回答进行评论/点赞/收藏 +1分/次 （上限五次）
4.	对不良、以及影响答疑持续的信息进行举报 +1分/次
[普通同学]
1.	对答疑者的回答进行评论/点赞/收藏 +1分/次（上限五次）
2.	对不良、以及影响答疑持续的信息进行举报 +1分/次
【删除】
  由同学举报后经过后台核实，由管理员删除不正当的消息后对被删除者进行每次-100分的惩罚。</Text>
        </View>
      </View>
    </View>
  )
}

export default connect((state: any) => ({accountId: state.userInfo.accountId}))(
  Rank
)
