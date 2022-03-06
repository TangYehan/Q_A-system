import React, {FC, useState, useEffect} from 'react'
import Taro from '@tarojs/taro'
import {View} from '@tarojs/components'
import {SkeletonProps} from './data.d'
import './index.scss'

const Skeleton: FC<SkeletonProps> = props => {
  const {selector = 'skeleton', loading = true} = props
  const [radiusList, setRadiusList] = useState([])
  const [rectList, setRectList] = useState([])
  const [contentArea, setContentArea] = useState<any>({})
  //   const [loadingTest, setLoadingTest] = useState(true)

  /**
   * 本地延迟模拟
   */
  //   useEffect(() => {
  //     // setTimeout(() => {
  //     //   setLoadingTest(false)
  //     // }, 2000)
  //   }, [])

  /**
   * 等待父页面渲染后获取生成骨架屏
   */
  Taro.eventCenter.once(Taro?.Current.router.onReady, () => {
    initSkeleton()
  })

  /**
   * 初始化请求
   */
  const initSkeleton = () => {
    getContent(selector).then((res: any) => {
      setContentArea(res)
    })

    getGraphList(selector, `${selector}-radius`).then((res: any) => {
      setRadiusList(res)
    })
    getGraphList(selector, `${selector}-rect`).then((res: any) => {
      setRectList(res)
    })
  }

  /**
   * 获取总区间大小
   */
  const getContent = sele => {
    return new Promise((resolve, reject) => {
      Taro.createSelectorQuery()
        .select(`.${sele}`)
        .boundingClientRect()
        .exec(content => {
          resolve(content[0])
        })
    })
  }

  /**
   * 选择器获取节点
   */
  const getGraphList = (ancestor, descendant) => {
    return new Promise((resolve, reject) => {
      if (process.env.TARO_ENV === 'weapp') {
        Taro.createSelectorQuery()
          .selectAll(`.${ancestor} >>> .${descendant}`)
          .boundingClientRect()
          .exec(rect => {
            resolve(rect[0])
          })
      } else {
        Taro.createSelectorQuery()
          .selectAll(`.${ancestor} .${descendant}`)
          .boundingClientRect()
          .exec(rect => {
            resolve(rect[0])
          })
      }
    })
  }

  return (
    <View>
      {loading && (
        <View
          className='SkeletonCmpt'
          style={{
            width: `${contentArea.width}px`,
            height: `${contentArea.height}px`,
            top: `${contentArea.top}px`,
            left: `${contentArea.left}px`
          }}>
          {radiusList.map((radiusItem: any) => (
            <View
              className='skeleton skeleton-radius skeleton-animate-gradient'
              style={{
                width: `${radiusItem.width}px`,
                height: `${radiusItem.height}px`,
                top: `${radiusItem.top}px`,
                left: `${radiusItem.left}px`
              }}
            />
          ))}
          {rectList.map((rectItem: any) => (
            <View
              className='skeleton skeleton-animate-gradient'
              style={{
                width: `${rectItem.width}px`,
                height: `${rectItem.height}px`,
                top: `${rectItem.top}px`,
                left: `${rectItem.left}px`
              }}
            />
          ))}
        </View>
      )}
    </View>
  )
}
export default Skeleton
