import type { IconProps } from '@mui/material/Icon'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import type { ReactElement } from 'react'


interface Props {
  icon: ReactElement<IconProps>
  primary: string
  secondary?: string
  extra?: ReactElement<IconProps>
}

const ProfileStat = ({ icon, primary, secondary, extra }: Props) => {
  return (
    <ListItem>
      <ListItemIcon>
        {icon}
      </ListItemIcon>
      <ListItemText
        primary={primary}
        secondary={secondary}
      />
      {extra}
    </ListItem>
  )
}

export default ProfileStat
