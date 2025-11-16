import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import type Game from '../types/Game'
import type Rating from '../types/Rating'
import type Comment from '../types/Comment'
import ChipList from './ChipList'
import FavoriteButton from './FavoriteButton'
import LoadingCircle from './PageLoadingCircle'

import gamesService from '../services/games'
import ratingService from '../services/ratings'
import commentService from '../services/comments'
import favoriteService from '../services/favorite'
import { useBoundStore } from '../stores/boundStore'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'

import StarRateIcon from '@mui/icons-material/StarRate'
import CommentIcon from '@mui/icons-material/Comment'
import RateReviewIcon from '@mui/icons-material/RateReview'
import SendIcon from '@mui/icons-material/Send'
import FavoriteIcon from '@mui/icons-material/Favorite'
import EditIcon from '@mui/icons-material/Edit'
import CancelIcon from '@mui/icons-material/Cancel'


const GameInfo = () => {
  const { id } = useParams()
  const [game, setGame] = useState<Game>()
  const [ratings, setRatings] = useState<Rating[]>([])
  const [favorites, setFavorites] = useState<Game[]>([])
  const [score, setScore] = useState(5.0)
  const [userScore, setUserScore] = useState<number | null>(null)
  const [showScoreInput, setShowScoreInput] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)

  const { user } = useBoundStore()

  const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await ratingService.postOrUpdateRating(user!.id, game!.id, score)
    const newRatings = await ratingService.getGameRatings(id!)
    setRatings(newRatings)
    setShowScoreInput(false)
  }

  const handleCommentSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!newComment.trim() || !user) return

    await commentService.postComment(user.id, game!.id, newComment)
    setNewComment('')

    const updatedComments = await commentService.getGameComments(game!.id)
    setComments(updatedComments)
  }

  useEffect(() => {
    const fetchData = async () => {
      const gameData = await gamesService.getGameById(id!)
      setGame(gameData)

      if (gameData) {
        const ratingData = await ratingService.getGameRatings(id!)
        setRatings(ratingData)

        const commentData = await commentService.getGameComments(id!)
        setComments(commentData)

        const favs = await favoriteService.getFavoritedBy(gameData.id)
        setFavorites(favs)

        if (user) {
          const userRating = await ratingService.getUserGameRating(user.id, gameData.id)
          setUserScore(userRating?.score)
          setScore(userRating?.score)
        }
      }

      setLoading(false)
    }
    fetchData()
  }, [showScoreInput])

  if (loading || !game) return <LoadingCircle />

  const avgScore =
    ratings.length === 0
      ? null
      : (ratings.reduce((a, r) => a + r.score, 0) / ratings.length).toFixed(2)

  return (
    <Box p={2} pt={1}>
      <Grid container spacing={3}>
        {/* LEFT: Cover image */}
        <Grid container size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={3}
            sx={{
              width: '100%',
              height: '75vh',
              display: 'flex',
              justifyContent:'center',
              alignItems: 'center'
            }}>
            <Box sx={{ width: '100%', height: '100%', flex: '0 0 auto', position: 'relative' }}>
              <FavoriteButton gameId={game.id} size='large' />
              <img
                src={`http://localhost:7008${game.cover_image}`}
                alt={`${game.title} cover`}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 4,
                  objectFit: 'cover'
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* RIGHT: Main info */}
        <Grid container size={{ xs: 12, md: 8 }} spacing={1}>
          <Stack spacing={1} sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
            <Stack spacing={1} direction='row'>
              <Paper elevation={3} sx={{ p: 2, flexGrow: 3, flexBasis: 0, textAlign: 'left' }}>
                {/* Basic Info */}
                <Typography component='h2' variant='h5' fontWeight='bold' mb={1}>
                  {game.title} ({game.release_year})
                </Typography>

                <Typography variant='body1'>
                  <strong>Publisher:</strong> {game.publisher}<br/>
                  <strong>
                    Developer{game.developers.length === 1 ? '' : 's'}:
                  </strong> {game.developers.join(', ')}
                </Typography>

                {/* Rating summary */}
                <Box display='flex' alignItems='center' gap={1}>
                  <Stack direction='row' py={1} display='flex' alignItems='center' spacing={1} mr={1}>
                    <StarRateIcon color='warning'/>
                    <Typography variant='h6' >
                      {avgScore
                        ? `${avgScore} (${ratings.length} review${ratings.length !== 1 ? 's' : ''})`
                        : 'No reviews yet'}
                    </Typography>
                  </Stack>

                  {/* Rate button or score input */}
                  {user ? (
                    !showScoreInput ? (
                      <Button
                        variant='contained'
                        color='secondary'
                        size='small'
                        onClick={() => setShowScoreInput(true)}
                      >
                        {userScore
                          ?
                          <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                            <EditIcon fontSize='small' sx={{ mr: '4px' }} />
                            {`(${userScore})`}
                          </Typography>
                          : 'Rate'
                        }
                      </Button>
                    ) : (
                      <Box component='form' onSubmit={onSubmitHandler} display='flex' gap={2}>
                        <TextField
                          type='number'
                          label='Score'
                          slotProps={{ htmlInput: { min: 1, max: 10, step: 0.1 } }}
                          size='small'
                          margin='dense'
                          value={score}
                          onChange={(e) => setScore(parseFloat(e.target.value))}
                          sx={{ my: 0 }}
                        />
                        <Button type='submit' variant='contained' color='secondary' size='small'>
                          <RateReviewIcon/>
                        </Button>
                        <Button
                          variant='contained'
                          color='error'
                          size='small'
                          onClick={() => setShowScoreInput(false)}
                        >
                          <CancelIcon />
                        </Button>
                      </Box>
                    )
                  ) : (
                    <Button variant='outlined' disabled>
                      Login to rate
                    </Button>
                  )}

                </Box>
                {/* Favorited by */}
                <Box display='flex' alignItems='center' gap={1}>
                  <FavoriteIcon color='error' />
                  <Typography variant='h6'>
                    Favorited by {favorites.length} user{favorites.length == 1 ? '' : 's'}
                  </Typography>
                </Box>
              </Paper>

              {/* DURATIONS */}
              <Stack flexGrow={2} flexBasis={0}>
                <Paper elevation={3} sx={{ p: 2, height: '100%', textAlign: 'left' }}>
                  <Typography variant='h5' mb={1}>How long to beat?</Typography>
                  <Typography>Main Story: {game.average_duration.main_story}h</Typography>
                  <Typography>Main + Extras: {game.average_duration.main_plus_extras}h</Typography>
                  <Typography>Completionist: {game.average_duration.completionist}h</Typography>
                </Paper>
              </Stack>
            </Stack>

            {/* DESCRIPTION */}
            <Grid size={12}>
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  textAlign: 'left',
                  overflow: 'scroll',
                  textOverflow: 'ellipsis'
                }}>
                <Typography variant='h5' mb={1}>Description</Typography>
                <Typography>{game.description}</Typography>
              </Paper>
            </Grid>

            {/* DETAILS */}
            <Grid size={12}>
              <Paper elevation={3} sx={{ p: 2, textAlign: 'left' }}>
                <Box display='flex' flexDirection='row' mb={1}>
                  <Typography mr={1}><strong>Platforms:</strong></Typography>
                  <Box display='flex' flexWrap='wrap' gap='2px'>
                    <ChipList list={game.platforms} color='primary' />
                  </Box>
                </Box>
                <Box display='flex' flexDirection='row'>
                  <Typography mr={1}><strong>Genres:</strong></Typography>
                  <Box display='flex' flexWrap='wrap' gap='2px'>
                    <ChipList list={game.genres} color='secondary' />
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Stack>
        </Grid>

        {/* COMMENTS */}
        <Grid size={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box display='flex' alignItems='center' gap={1} mb={1}>
              <CommentIcon color='info' />
              <Typography variant='h5'>Comments</Typography>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Comment form */}
            {user ? (
              <Box
                component='form'
                onSubmit={handleCommentSubmit}
                mt={2}
                display='flex'
                gap={2}
                mb={1}
              >
                <TextField
                  label='Write a comment...'
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  fullWidth
                />

                <Button type='submit' variant='contained' color='secondary'>
                  <SendIcon />
                </Button>
              </Box>
            ) : (
              <Typography my={2}>Login to post a comment.</Typography>
            )}

            {/* Comment list */}
            {comments.length === 0 ? (
              <Typography>No comments yet. Be the first!</Typography>
            ) : (
              <List dense>
                {comments.map((c, i) => (
                  <ListItem key={i} sx={{ px: 0 }}>
                    <ListItemText
                      primary={
                        <Link to={`/profile/${c.user.id}`}>
                          {c.user.username}
                        </Link>
                      }
                      secondary={c.content}
                      slotProps={{ secondary: { color: 'text' } }}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

      </Grid>
    </Box>
  )
}

export default GameInfo
