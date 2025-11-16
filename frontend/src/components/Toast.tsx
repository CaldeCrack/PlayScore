import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import { useBoundStore } from '../stores/boundStore'


const Toast = () => {
  const { message, open, severity, toggleOff } = useBoundStore()

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={toggleOff}>
      <Alert
        onClose={toggleOff}
        severity={severity}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  )
}

export default Toast
