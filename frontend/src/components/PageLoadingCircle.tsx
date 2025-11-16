import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'


const LoadingCircle = () => {
  return (
    <Box
      sx={{
        height: '74vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <CircularProgress color="secondary" size={60} />
    </Box>
  )
}

export default LoadingCircle
