import { useEffect, useState } from 'react'
import ratingService from '../services/ratings'
import type Game from '../types/Game'
import type Rating from '../types/Rating'
import { Link } from 'react-router-dom'

import { useTheme } from '@mui/material/styles'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import TimerIcon from '@mui/icons-material/Timer'
import StarRateIcon from '@mui/icons-material/StarRate'
import Divider from '@mui/material/Divider'
import ChipList from './ChipList'


interface Props {
  game: Game
}

const GameDisplay = ({ game }: Props) => {
  const [ratings, setRatings] = useState<Rating[]>([])

  const theme = useTheme()

  useEffect(()=>{
    ratingService.getGameRatings(game.id.toString())
      .then((data) => setRatings(data))
  }, [])

  return (
    <Card sx={{ display: 'flex', height: '19vw', width: '48vw' }}>
      <CardActionArea
        component={Link}
        to={`/games/${game.id}`}
        sx={{
          display: 'flex',
          justifyContent: 'flex-start'
        }}
      >
        <CardMedia
          component='div'
          sx={{
            position: 'relative',
            width: '21vh',
            maxWidth: '21vh',
            height: '100%',
            flex: '0 0 auto'
          }}
        >
          <img
            src={`http://localhost:7008${game.cover_image}`}
            alt={`${game.title} cover`}
            style={{
              width: '21vh',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              borderRadius: 2
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: 2,
              left: 2,
              background: 'rgba(0,0,0,0.9)',
              padding: '1px 4px',
              borderRadius: 1,
              fontSize: '0.8rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <StarRateIcon fontSize='inherit' sx={{ color: theme.palette.accent.main }} />
            <Typography display='inline' fontSize='inherit' sx={{ ml: '2px' }}>
              {ratings.length === 0 ? 'N/A' :
                (ratings.reduce((a, r) => a + r.score, 0) / ratings.length).toFixed(1)
              }
            </Typography>
          </Box>

          <Box
            sx={{
              position: 'absolute',
              bottom: 2,
              right: 2,
              background: 'rgba(0,0,0,0.9)',
              padding: '1px 4px',
              borderRadius: 1,
              fontSize: '0.8rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <TimerIcon fontSize='inherit' />
            <Typography display='inline' fontSize='inherit' sx={{ ml: '2px' }}>
              {game.average_duration.main_story === 0
                ? 'N/A'
                : `${game.average_duration.main_story}h`
              }
            </Typography>
          </Box>
        </CardMedia>

        <CardContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            textAlign: 'left',
            height: '100%',
            maxHeight: '20vw',
            p: '0 8px',
            width: '100%',
            minHeight: 0
          }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
            <Typography component='h3' variant='h6' sx={{ alignItems: 'flex-start', marginTop: 1 }}>
              {game.title} ({game.release_year})
            </Typography>
            <Typography fontWeight={700} variant='subtitle2'>{game.publisher}</Typography>
            <Divider sx={{ marginBottom: 1 }} />

            <Typography
              variant='body2'
              sx={{
                overflow: 'scroll',
                textOverflow: 'ellipsis',
                display: 'block',
                flex: 1,
                minHeight: 0,
                pr: 1
              }}>
              {game.description}
            </Typography>
          </Box>

          <Box>
            <Box sx={{ display: 'flex', gap: '2px', flexWrap: 'wrap', marginTop: 1 }}>
              <ChipList list={game.platforms} color='primary' />
            </Box>
            <Divider sx={{ marginBottom: 1, marginTop: 1 }} />
            <Box sx={{ display: 'flex', gap: '2px', flexWrap: 'wrap', marginBottom: 1 }}>
              <ChipList list={game.genres} color='secondary' />
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default GameDisplay
