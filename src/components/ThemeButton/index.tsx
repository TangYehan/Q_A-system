import React, {ReactElement} from 'react'
import {Button} from '@tarojs/components'
import './index.scss'

interface Props {
  children: string
  className?: string
  onClick?: () => void
}

export default function index(props: Props): ReactElement {
  return (
    <Button
      className={props.className + ' btn'}
      hoverClass='btn_hover'
      onClick={props.onClick}>
      {props.children}
    </Button>
  )
}
