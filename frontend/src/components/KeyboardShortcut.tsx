import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'


interface KeyboardShortcutProps {
  keys: string
}

const KeyboardShortcut = ({ keys }: KeyboardShortcutProps) => {
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        px: 0.5,
        mr: 0.7,
        borderRadius: 1,
        bgcolor: 'action.hover',
        border: '1px solid',
        borderColor: 'divider',
        fontSize: '0.75rem',
        fontFamily: 'monospace',
        lineHeight: 1.2,
        userSelect: 'none'
      }}
    >
      <Typography variant='caption' sx={{ fontFamily: 'inherit' }}>
        {keys}
      </Typography>
    </Box>
  )
}

export default KeyboardShortcut
