import favoriteService from '../services/favorite'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import IconButton from '@mui/material/IconButton'
import { useBoundStore } from '../stores/boundStore'
import { useEffect, useState } from 'react'


type SizeList = 'small' | 'medium' | 'large'

const FavoriteButton = ({ gameId, size }: { gameId: string, size: SizeList }) => {
  const { user, setMessage, setSeverity, toggleOn } = useBoundStore()

  const [isFavorite, setIsFavorite] = useState<boolean | null>(null)

  useEffect(() => {
    if (!user) return
    favoriteService
      .getUserFavoritedGame(gameId, user.id)
      .then((res) => setIsFavorite(res.favorited))
  }, [user, gameId])

  if (!user) return null
  if (isFavorite === null) return null

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()

    if (!user) {
      setMessage('You must be logged in to favorite games')
      setSeverity('warning')
      toggleOn()
      return
    }

    try {
      if (isFavorite) {
        await favoriteService.unfavoriteGame(gameId)
        setIsFavorite(false)

        setMessage('Game removed from favorites')
        setSeverity('info')
        toggleOn()
      } else {
        await favoriteService.favoriteGame(gameId)
        setIsFavorite(true)

        setMessage('Game added to favorites')
        setSeverity('success')
        toggleOn()
      }
    } catch (_err) {
      setMessage('Error updating favorite status')
      setSeverity('error')
      toggleOn()
    }
  }

  return (
    <IconButton
      onClick={toggleFavorite}
      sx={{
        position: 'absolute',
        top: 2,
        left: 2,
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: '4px',
        borderRadius: '4px',
        zIndex: 15,
        '&:hover': {
          backgroundColor: 'rgba(0,0,0,0.9)',
        },
      }}
    >
      {isFavorite ? (
        <FavoriteIcon fontSize={size} sx={{ color: '#ff4d4d' }} />
      ) : (
        <FavoriteBorderIcon fontSize={size} sx={{ color: 'white' }} />
      )}
    </IconButton>
  )
}

export default FavoriteButton
