import {ReactElement, useState} from 'react'
import {View} from '@tarojs/components'
import './index.scss'

interface Props {
  openText: string
  closeText: string
  value: string | boolean | number
  onChange: (value) => void
}

export default function index(props: Props): ReactElement {
  const [value, setValue] = useState(props.value)
  const toggle = () => {
    const currentValue = !value
    setValue(currentValue)
    props.onChange(currentValue)
  }

  return (
    <View
      className={`i-class i-switch i-switch-large ${
        value ? 'i-switch-checked' : ''
      }`}
      onClick={toggle}>
      {/* <Input
        type='text'
        value={String(value)}
        className='i-switch-hide-input'></Input> */}
      {value ? (
        <View className='i-switch-inner'>{props.openText}</View>
      ) : (
        <View className='i-switch-inner'>{props.closeText}</View>
      )}
    </View>
  )
}
