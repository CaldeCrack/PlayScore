import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import type Game from '../types/Game'
import type Rating from '../types/Rating'
import type Comment from '../types/Comment'
import type Completion from '../types/Completion'

import ChipList from './ChipList'
import FavoriteButton from './FavoriteButton'
import LoadingCircle from './PageLoadingCircle'

import gamesService from '../services/games'
import ratingService from '../services/ratings'
import commentService from '../services/comments'
import favoriteService from '../services/favorite'
import completionService from '../services/completions'
import { useBoundStore } from '../stores/boundStore'
import utils from '../utils/utils'

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
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'

import StarRateIcon from '@mui/icons-material/StarRate'
import CommentIcon from '@mui/icons-material/Comment'
import RateReviewIcon from '@mui/icons-material/RateReview'
import SendIcon from '@mui/icons-material/Send'
import FavoriteIcon from '@mui/icons-material/Favorite'
import EditIcon from '@mui/icons-material/Edit'
import CancelIcon from '@mui/icons-material/Cancel'
import NoteAltIcon from '@mui/icons-material/NoteAlt'
import TimerIcon from '@mui/icons-material/Timer'
import PersonIcon from '@mui/icons-material/Person'
import UploadIcon from '@mui/icons-material/Upload'
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import GroupsIcon from '@mui/icons-material/Groups'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'


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

  const [completion, setCompletion] = useState<Completion | null>(null)
  const [mainStory, setMainStory] = useState<number | null>(null)
  const [mainPlusExtras, setMainPlusExtras] = useState<number | null>(null)
  const [completionist, setCompletionist] = useState<number | null>(null)
  const [editingCompletion, setEditingCompletion] = useState(false)

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

  const handleCompletionSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user || !game) return

    const newCompletion: Completion = await completionService.postOrUpdateCompletion(
      user.id,
      game.id,
      Number(mainStory),
      !mainPlusExtras ? undefined : Number(mainPlusExtras),
      !completionist ? undefined : Number(completionist),
    )

    setCompletion(newCompletion)
    setEditingCompletion(false)

    const newGame: Game = await gamesService.getGameById(game.id)
    setGame(newGame)
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

          const userComp = await completionService.getUserGameCompletion(user.id, gameData.id)
          if (userComp && userComp.id) {
            setCompletion(userComp)
            setMainStory(userComp.main_story)
            setMainPlusExtras(userComp.main_plus_extras)
            setCompletionist(userComp.completionist)
          }
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

                <Typography variant='body1' mb={1}>
                  <strong>Publisher:</strong> {game.publisher}<br/>
                  <strong>
                    Developer{game.developers.length === 1 ? '' : 's'}:
                  </strong> {game.developers.join(', ')}
                </Typography>

                <Divider sx={{ my: 2 }} />

                {/* Rating summary */}
                <Box display='flex' alignItems='center' gap={1}>
                  <Stack direction='row' display='flex' alignItems='center' spacing={1} mr={1}>
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

                {/* Completed by */}
                <Box display='flex' alignItems='center' gap={1}>
                  <CheckCircleIcon color='primary' />
                  <Typography variant='h6'>
                    Completed by {game.completions.length} user{game.completions.length == 1 ? '' : 's'}
                  </Typography>
                </Box>
              </Paper>

              {/* DURATIONS */}
              <Stack flexGrow={2} flexBasis={0}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 2,
                    height: '100%',
                    textAlign: 'left',
                    position: 'relative'
                  }}
                >
                  {/* Toggle Button — top left */}
                  <IconButton
                    size="small"
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                    disabled={!user}
                    onClick={() => setEditingCompletion(!editingCompletion)}
                  >
                    {editingCompletion
                      ?
                      <Tooltip title='Show Averages' placement='top' arrow>
                        <TimerIcon color='secondary' />
                      </Tooltip>
                      : completion
                        ?
                        <Tooltip title='Your Times' placement='top' arrow>
                          <PersonIcon color='secondary' />
                        </Tooltip>
                        :
                        <Tooltip title='Submit Time' placement='top' arrow>
                          <NoteAltIcon color='secondary' />
                        </Tooltip>
                    }
                  </IconButton>

                  <Typography variant="h5" mb={1}>
                    How long to beat?
                  </Typography>

                  {/* SHOW AVERAGES */}
                  {!editingCompletion && (
                    <>
                      <Typography variant='h6' mb={1} sx={{ display: 'flex', alignItems: 'center' }}>
                        <VideogameAssetIcon color='primary' sx={{ mr: 1 }} />
                        Main Story: {utils.meanTime(game.completions, 'main')}
                      </Typography>

                      <Typography variant='h6' mb={1} sx={{ display: 'flex', alignItems: 'center' }}>
                        <AddCircleIcon color='primary' sx={{ mr: 1 }} />
                        Main + Extras: {utils.meanTime(game.completions, 'extras')}
                      </Typography>

                      <Typography variant='h6' mb={1} sx={{ display: 'flex', alignItems: 'center' }}>
                        <EmojiEventsIcon color='primary' sx={{ mr: 1 }} />
                        Completionist: {utils.meanTime(game.completions, 'completionist')}
                      </Typography>

                      <Typography variant='h6' mb={1} sx={{ display: 'flex', alignItems: 'center' }}>
                        <GroupsIcon color='primary' sx={{ mr: 1 }} />
                        All Playstyles: {utils.meanAllTimes(game.completions)}
                      </Typography>

                      {!user && <Typography mt={1}>Login to submit your times.</Typography>}
                    </>
                  )}

                  {/* SHOW USER FORM */}
                  {editingCompletion && user && (
                    <Box
                      component="form"
                      onSubmit={handleCompletionSubmit}
                      mt={1}
                      display="flex"
                      flexDirection="column"
                      gap={1}
                    >
                      <TextField
                        label="Main Story (required)"
                        type="number"
                        size="small"
                        margin="none"
                        value={mainStory ?? ''}
                        onChange={e => setMainStory(Number(e.target.value))}
                        required
                      />

                      <TextField
                        label="Main + Extras"
                        type="number"
                        size="small"
                        margin="none"
                        value={mainPlusExtras ?? ''}
                        onChange={e =>
                          setMainPlusExtras(Number(e.target.value) <= 0 ? null : Number(e.target.value))
                        }
                      />

                      <TextField
                        label="Completionist"
                        type="number"
                        size="small"
                        margin="none"
                        value={completionist ?? ''}
                        onChange={e =>
                          setCompletionist(Number(e.target.value) <= 0 ? null : Number(e.target.value))
                        }
                      />

                      <Box display="flex" gap={1}>
                        <Tooltip title='Upload' arrow>
                          <Button type="submit" variant="contained" color="secondary" size="small">
                            <UploadIcon fontSize='small' />
                          </Button>
                        </Tooltip>

                        <Tooltip title='Cancel' arrow>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => {
                              setEditingCompletion(false)
                              if (completion) {
                                setMainStory(completion.main_story)
                                setMainPlusExtras(completion.main_plus_extras ?? null)
                                setCompletionist(completion.completionist ?? null)
                              }
                            }}
                          >
                            <CancelIcon fontSize='small' />
                          </Button>
                        </Tooltip>
                      </Box>
                    </Box>
                  )}
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
