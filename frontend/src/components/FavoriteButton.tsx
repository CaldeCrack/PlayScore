import favoriteService from '../services/favorite'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import IconButton from '@mui/material/IconButton'
import { useBoundStore } from '../stores/boundStore'
import { useEffect, useState } from 'react'


type SizeList = 'small' | 'medium' | 'large'

const FavoriteButton = ({ gameId, size }: { gameId: string, size: SizeList }) => {
  const { user } = useBoundStore()

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

    if (isFavorite) {
      await favoriteService.unfavoriteGame(gameId)
      setIsFavorite(false)
    } else {
      await favoriteService.favoriteGame(gameId)
      setIsFavorite(true)
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
        borderRadius: '6px',
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
