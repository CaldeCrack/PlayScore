import { useEffect } from 'react'
import { useBoundStore } from '../stores/boundStore'
import { useNavigate } from 'react-router-dom'

const NotFoundPage = () => {
  const { setMessage, setSeverity, toggleOn } = useBoundStore()

  const navigate = useNavigate()

  useEffect(() => {
    setMessage('Unknown endpoint')
    setSeverity('error')
    toggleOn()
    navigate('/')
  }, [])

  return (<></>)
}

export default NotFoundPage
