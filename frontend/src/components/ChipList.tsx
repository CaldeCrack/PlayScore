import Chip from '@mui/material/Chip'


type ColorList = 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'

const ChipList = ({ list, color }: { list: string[], color: ColorList }) => {
  return list.map((elem, i) => <Chip key={i} label={elem} size='small' color={color} />)
}

export default ChipList
