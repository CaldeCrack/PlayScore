import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import usersService from '../services/users'
import ratingsService from '../services/ratings'
import favoriteService from '../services/favorite'
import commentsService from '../services/comments'
import completionsService from '../services/completions'
import loginService from '../services/login'
import type Game from '../types/Game'
import type User from '../types/User'
import type Rating from '../types/Rating'
import type Comment from '../types/Comment'
import type Completion from '../types/Completion'
import ProfileTabItem from './ProfileTabList'
import utils from '../utils/utils'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Tooltip from '@mui/material/Tooltip'

import StarRateIcon from '@mui/icons-material/StarRate'
import CommentIcon from '@mui/icons-material/Comment'
import PersonIcon from '@mui/icons-material/Person'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import EmailIcon from '@mui/icons-material/Email'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ProfileStat from './ProfileStat'
import LoadingCircle from './PageLoadingCircle'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import InfoOutlineIcon from '@mui/icons-material/InfoOutline'


interface Props {
  guest?: boolean
}

function Profile({ guest = false }: Props) {
  const { id } = useParams()
  const [ratings, setRatings] = useState<Rating[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [favorites, setFavorites] = useState<Game[]>([])
  const [completions, setCompletions] = useState<Completion[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState(0)
  const [displayUser, setDisplayUser] = useState<User | null>(null)

  const navigate = useNavigate()

  useEffect(() => {
    const updateData = async (userData: User) => {
      setDisplayUser(userData)
      const ratings = await ratingsService.getUserRatings(userData.id)
      setRatings(ratings)
      const comments = await commentsService.getUserComments(userData.id)
      setComments(comments)
      const favs = await favoriteService.getUserFavorites(userData.id)
      setFavorites(favs.favorites)
      const comps = await completionsService.getUserCompletions(userData.id)
      setCompletions(comps)
    }
    const init = async () => {
      if (!guest) {
        const loggedUser = await loginService.restoreLogin()
        if (!loggedUser)
          navigate('/login')
        const userData = await usersService.getUserById(loggedUser!.id)
        await updateData(userData)
      } else {
        const profileUser = await usersService.getUserById(id!)
        if (!profileUser)
          navigate('/')
        const userData = await usersService.getUserById(profileUser!.id)
        await updateData(userData)
      }
      setLoading(false)
    }
    init()
  }, [navigate, guest, id, setDisplayUser])

  if (loading) return <LoadingCircle />

  return (
    <Box p={3} sx={{ height: '74vh' }}>
      <Typography variant="h4" mb={2} fontWeight="bold">Profile</Typography>

      <Grid container spacing={3} sx={{ height: '100%' }}>
        {/* LEFT COLUMN — Profile info */}
        <Grid size={4}>
          <Paper
            elevation={3}
            sx={{
              p: 1,
              pb: 2,
              px: 2,
              height: '88%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start'
            }}
          >
            <Typography variant="h6" mb={1}>Basic Info</Typography>
            <Divider sx={{ width: '100%' }} />

            {displayUser && (
              <List dense sx={{ width: '100%' }}>
                <ListItem>
                  <ListItemIcon><PersonIcon /></ListItemIcon>
                  <ListItemText primary={displayUser.name} secondary="Name" />
                </ListItem>

                <ListItem>
                  <ListItemIcon><AccountCircleIcon /></ListItemIcon>
                  <ListItemText primary={displayUser.username} secondary="Username" />
                </ListItem>

                {!guest && (
                  <ListItem>
                    <ListItemIcon><EmailIcon /></ListItemIcon>
                    <ListItemText primary={displayUser.email} secondary="Email" />
                  </ListItem>
                )}
              </List>
            )}

            {/* ----- Stats Section ----- */}
            <Typography variant="h6" mb={1}>Stats</Typography>
            <Divider sx={{ width: '100%' }} />

            <List dense sx={{ width: '100%' }}>
              {/* Ratings stats */}
              <ProfileStat
                icon={<StarRateIcon color="warning" />}
                primary={`${ratings.length} rating${ratings.length === 1 ? '' : 's'}`}
                secondary={`Mean rating: ${ratings.length
                  ? (ratings.reduce((a, r) => a + r.score, 0) / ratings.length).toFixed(2)
                  : 'N/A'
                }`}
              />

              {/* Comments stats */}
              <ProfileStat
                icon={<CommentIcon color="info" />}
                primary={`${comments.length} comment${comments.length === 1 ? '' : 's'}`}
              />

              {/* Favorite stats */}
              <ProfileStat
                icon={<FavoriteIcon color="error" />}
                primary={`${favorites.length} favorite${favorites.length === 1 ? '' : 's'}`}
              />

              {/* Completions stats */}
              <ProfileStat
                icon={<CheckCircleIcon color="primary" />}
                primary={`${completions.length} completion${completions.length === 1 ? '' : 's'}`}
                secondary={`All Playstyles Avg: ${utils.meanAllTimes(completions)}`}
                extra={
                  <Tooltip
                    title={
                      <>
                        Main: {utils.meanTime(completions, 'main')}<br/>
                        +Extras: {utils.meanTime(completions, 'extras')}<br/>
                        Completionist: {utils.meanTime(completions, 'completionist')}
                      </>
                    }
                    placement='top'
                    arrow
                  >
                    <InfoOutlineIcon />
                  </Tooltip>
                }
              />
            </List>
          </Paper>
        </Grid>

        {/* RIGHT COLUMN — Tabs for ratings/comments */}
        <Grid size={8}>
          <Paper elevation={3} sx={{ p: 1, pb: 2, height: '88%' }}>
            <Tabs
              value={tab}
              onChange={(_e, value) => setTab(value)}
              textColor="secondary"
              indicatorColor="secondary"
              sx={{ mb: 1 }}
            >
              <Tab icon={<StarRateIcon />} label="Ratings" />
              <Tab icon={<CommentIcon />} label="Comments" />
              <Tab icon={<FavoriteIcon />} label="Favorites" />
              <Tab icon={<CheckCircleIcon />} label="Completions" />
            </Tabs>

            {/* ----- Ratings Tab ----- */}
            {tab === 0 && (
              <Box sx={{ overflowY: 'auto', height: '100%' }}>
                {ratings && ratings.length > 0 ? (
                  <List dense>
                    {ratings.map((rating, i) => (
                      <ProfileTabItem
                        key={i}
                        to={`/games/${rating.game.id}`}
                        icon={<StarRateIcon color="warning" />}
                        primary={rating.game.title}
                        secondary={`Score: ${rating.score}`}
                      />
                    ))}
                  </List>
                ) : (
                  <Typography>No ratings yet.</Typography>
                )}
              </Box>
            )}

            {/* ----- Comments Tab ----- */}
            {tab === 1 && (
              <Box sx={{ overflowY: 'auto', height: '100%' }}>
                {comments && comments.length > 0 ? (
                  <List dense>
                    {comments.map((comment, i) => (
                      <ProfileTabItem
                        key={i}
                        to={`/games/${comment.game.id}`}
                        icon={<CommentIcon color="info" />}
                        primary={comment.game.title}
                        secondary={comment.content}
                      />
                    ))}
                  </List>
                ) : (
                  <Typography>No comments yet.</Typography>
                )}
              </Box>
            )}

            {/* ----- Favorites Tab ----- */}
            {tab === 2 && (
              <Box sx={{ overflowY: 'auto', height: '100%' }}>
                {favorites && favorites.length > 0 ? (
                  <List dense>
                    {favorites.map((game, i) => (
                      <ProfileTabItem
                        key={i}
                        to={`/games/${game.id}`}
                        icon={<FavoriteIcon color="error" />}
                        primary={game.title}
                        secondary={`Year: ${game.release_year}`}
                      />
                    ))}
                  </List>
                ) : (
                  <Typography>No favorite games yet.</Typography>
                )}
              </Box>
            )}

            {/* ----- Completions Tab ----- */}
            {tab === 3 && (
              <Box sx={{ overflowY: 'auto', height: '100%' }}>
                {favorites && favorites.length > 0 ? (
                  <List dense>
                    {completions.map((completion, i) => (
                      <ProfileTabItem
                        key={i}
                        to={`/games/${completion.game.id}`}
                        icon={<CheckCircleIcon color="primary" />}
                        primary={completion.game.title}
                        secondary={`
                          Main:
                          ${completion.main_story.toFixed(1)}h | 
                          +Extras:
                          ${completion.main_plus_extras?.toFixed(1) ?? 'N/A'}${completion.main_plus_extras ? 'h' : ''} | 
                          Completionist:
                          ${completion.completionist?.toFixed(1) ?? 'N/A'}${completion.completionist ? 'h' : ''}
                        `}
                      />
                    ))}
                  </List>
                ) : (
                  <Typography>No completed games yet.</Typography>
                )}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Profile
