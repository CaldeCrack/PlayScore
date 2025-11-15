import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type User from '../types/User'
import usersService from '../services/users'
import ratingsService from '../services/ratings'
import commentsService from '../services/comments'
import type Rating from '../types/Rating'
import type Comment from '../types/Comment'
import loginService from '../services/login'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

import StarRateIcon from '@mui/icons-material/StarRate'
import CommentIcon from '@mui/icons-material/Comment'
import PersonIcon from '@mui/icons-material/Person'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import EmailIcon from '@mui/icons-material/Email'
import CircularProgress from '@mui/material/CircularProgress'


interface Props {
  guest?: boolean
}

function Profile({ guest = false }: Props) {
  const { id } = useParams()
  const [ratings, setRatings] = useState<Rating[] | null>(null)
  const [comments, setComments] = useState<Comment[] | null>(null)
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

  if (loading) {
    return (
      <Box
        sx={{
          height: '78vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <CircularProgress color="secondary" size={60} />
      </Box>
    )
  }

  return (
    <Box p={3} sx={{ height: '78vh' }}>
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
            <Typography variant="h6" my={1}>Basic Info</Typography>
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
            <Typography variant="h6" my={1}>Stats</Typography>
            <Divider sx={{ width: '100%', mb: 1 }} />

            <List dense sx={{ width: '100%' }}>
              {/* Ratings stats */}
              <ListItem>
                <ListItemIcon>
                  <StarRateIcon color="warning" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    ratings
                      ? `${ratings.length} rating${ratings.length === 1 ? '' : 's'}`
                      : '0 ratings'
                  }
                  secondary={
                    ratings && ratings.length > 0
                      ? `Mean rating: ${(ratings.reduce((a, r) => a + r.score, 0) / ratings.length).toFixed(1)}`
                      : 'Mean rating: N/A'
                  }
                />
              </ListItem>

              {/* Comments stats */}
              <ListItem>
                <ListItemIcon>
                  <CommentIcon color="info" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    comments
                      ? `${comments.length} comment${comments.length === 1 ? '' : 's'}`
                      : '0 comments'
                  }
                  secondary="Total comments"
                />
              </ListItem>
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
            </Tabs>

            {/* ----- Ratings Tab ----- */}
            {tab === 0 && (
              <Box sx={{ overflowY: 'auto', height: '100%' }}>
                {ratings && ratings.length > 0 ? (
                  <List dense>
                    {ratings.map((rating, i) => (
                      <ListItem disablePadding disableGutters key={i}>
                        <ListItemButton component={Link} to={`/games/${rating.game.id}`}>
                          <ListItemIcon sx={{ mr: -1 }}>
                            <StarRateIcon color="warning" />
                          </ListItemIcon>
                          <ListItemText
                            primary={rating.game.title}
                            secondary={`Score: ${rating.score}`}
                          />
                        </ListItemButton>
                      </ListItem>
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
                      <ListItem disablePadding key={i}>
                        <ListItemButton component={Link} to={`/games/${comment.game.id}`}>
                          <ListItemIcon sx={{ mr: -1 }}>
                            <CommentIcon color="info" />
                          </ListItemIcon>
                          <ListItemText
                            primary={comment.game.title}
                            secondary={comment.content}
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography>No comments yet.</Typography>
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
