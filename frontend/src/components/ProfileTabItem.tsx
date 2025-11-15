import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { Link } from 'react-router-dom'
import type { IconProps } from '@mui/material/Icon'
import type { ReactElement } from 'react'


interface Props {
  to: string
  icon: ReactElement<IconProps>
  primary: string
  secondary: string
}

const ProfileTabItem = ({ to, icon, primary, secondary }: Props) => {
  return (
    <ListItem disablePadding disableGutters>
      <ListItemButton component={Link} to={to}>
        <ListItemIcon sx={{ mr: -1 }}>
          {icon}
        </ListItemIcon>
        <ListItemText
          primary={primary}
          secondary={secondary}
        />
      </ListItemButton>
    </ListItem>
  )
}

export default ProfileTabItem
