import { useEffect, useState } from 'react'
import gameService from '../services/games'
import { useNavigate } from 'react-router-dom'
import { useBoundStore } from '../stores/boundStore'

import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import Divider from '@mui/material/Divider'
import UploadFileRoundedIcon from '@mui/icons-material/UploadFileRounded'
import PublishIcon from '@mui/icons-material/Publish'
import Tooltip from '@mui/material/Tooltip'


const AddGame = () => {
  const [title, setTitle] = useState('')
  const [developers, setDevelopers] = useState<string[]>([])
  const [publisher, setPublisher] = useState('')
  const [releaseYear, setReleaseYear] = useState<number | ''>('')
  const [platforms, setPlatforms] = useState<string[]>([])
  const [genres, setGenres] = useState<string[]>([])
  const [description, setDescription] = useState('')
  const [cover, setCover] = useState<File>()

  const [newDeveloper, setNewDeveloper] = useState('')
  const [newPlatform, setNewPlatform] = useState('')
  const [newGenre, setNewGenre] = useState('')

  const navigate = useNavigate()
  const { user, addGame, setMessage, setSeverity, toggleOn } = useBoundStore()


  const handleSubmitGame = async (event: React.FormEvent) => {
    event.preventDefault()

    if (
      !title.trim() ||
      developers.length === 0 ||
      !publisher.trim() ||
      !releaseYear ||
      platforms.length === 0 ||
      genres.length === 0 ||
      !description.trim()
    ) {
      setMessage('All fields are required.')
      setSeverity('warning')
      toggleOn()
      return
    }

    const formData = new FormData()
    formData.append('title', title)
    developers.forEach((dev, i) => formData.append(`developers[${i}]`, dev))
    formData.append('publisher', publisher)
    formData.append('release_year', releaseYear!.toString())
    platforms.forEach((plt, i) => formData.append(`platforms[${i}]`, plt))
    genres.forEach((gen, i) => formData.append(`genres[${i}]`, gen))
    formData.append('description', description)
    if (cover) formData.append('cover', cover)

    try {
      const response = await gameService.postGame(formData)
      addGame(response.data)
      setMessage('Game succesfully uploaded!')
      setSeverity('success')
      toggleOn()
      navigate('/')
    } catch {
      setMessage('Error while uploading game')
      setSeverity('error')
      toggleOn()
    }
  }

  useEffect(() => {
    if (!user || user.username !== 'admin') {
      navigate('/login')
    }
  }, [user, navigate])

  return (
    <Box sx={{
      width: '100%',
      height: '90%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Paper sx={{ p: 2, width: '80vw' }}>
        <Box component="form" onSubmit={handleSubmitGame}>
          <Stack direction='row' sx={{ justifyContent: 'space-between', alignItems:' center', mb: 2 }}>
            <Typography variant="h4">Add Game</Typography>
            {/* Submit */}
            <Tooltip title='Upload Game' placement='top' arrow>
              <Button type="submit" variant="contained" size="small" color='secondary'>
                <PublishIcon />
              </Button>
            </Tooltip>
          </Stack>

          <Stack divider={<Divider orientation="vertical" flexItem />} direction='row' spacing={2}>
            <Stack spacing={3}  flexGrow={1} flexBasis={0}>
              <TextField
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
              />

              {/* Publisher */}
              <TextField
                label="Publisher"
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
                fullWidth
              />

              {/* Release year */}
              <TextField
                label="Release Year"
                type="number"
                onChange={(e) => setReleaseYear(Number(e.target.value))}
                fullWidth
              />

              {/* Description */}
              <TextField
                label="Description"
                value={description}
                multiline
                minRows={3}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
              />
            </Stack>

            <Stack spacing={1} divider={<Divider />}  flexGrow={1} flexBasis={0}>
              {/* Developers */}
              <Box flexGrow={1} flexBasis={0}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <TextField
                    label="Add Developer"
                    value={newDeveloper}
                    onChange={(e) => setNewDeveloper(e.target.value)}
                    size="small"
                  />

                  <IconButton
                    onClick={() => {
                      if (!newDeveloper.trim()) return
                      setDevelopers([...developers, newDeveloper.trim()])
                      setNewDeveloper('')
                    }}
                  >
                    <AddCircleIcon color="secondary" />
                  </IconButton>
                </Stack>

                <Stack direction="row" spacing={1} flexWrap="wrap" mt={1}>
                  {developers.map((dev, i) => (
                    <Chip
                      key={i}
                      label={dev}
                      onDelete={() =>
                        setDevelopers(developers.filter((_, idx) => idx !== i))
                      }
                      color="secondary"
                      variant="outlined"
                    />
                  ))}
                </Stack>
              </Box>

              {/* Platforms */}
              <Box flexGrow={1} flexBasis={0}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <TextField
                    label="Add Platform"
                    value={newPlatform}
                    onChange={(e) => setNewPlatform(e.target.value)}
                    size="small"
                  />

                  <IconButton
                    onClick={() => {
                      if (!newPlatform.trim()) return
                      setPlatforms([...platforms, newPlatform.trim()])
                      setNewPlatform('')
                    }}
                  >
                    <AddCircleIcon color="secondary" />
                  </IconButton>
                </Stack>

                <Stack direction="row" spacing={1} flexWrap="wrap" mt={1}>
                  {platforms.map((plt, i) => (
                    <Chip
                      key={i}
                      label={plt}
                      onDelete={() =>
                        setPlatforms(platforms.filter((_, idx) => idx !== i))
                      }
                      color="secondary"
                      variant="outlined"
                    />
                  ))}
                </Stack>
              </Box>

              {/* Genres */}
              <Box flexGrow={1} flexBasis={0}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <TextField
                    label="Add Genre"
                    value={newGenre}
                    onChange={(e) => setNewGenre(e.target.value)}
                    size="small"
                  />

                  <IconButton
                    onClick={() => {
                      if (!newGenre.trim()) return
                      setGenres([...genres, newGenre.trim()])
                      setNewGenre('')
                    }}
                  >
                    <AddCircleIcon color="secondary" />
                  </IconButton>
                </Stack>

                <Stack direction="row" spacing={1} flexWrap="wrap" mt={1}>
                  {genres.map((gen, i) => (
                    <Chip
                      key={i}
                      label={gen}
                      onDelete={() =>
                        setGenres(genres.filter((_, idx) => idx !== i))
                      }
                      color="secondary"
                      variant="outlined"
                    />
                  ))}
                </Stack>
              </Box>
            </Stack>

            {/* Cover upload */}
            <Stack spacing={1}  flexGrow={1} flexBasis={0} sx={{ alignItems: 'flex-start' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h6" display='inline'>Cover Image</Typography>
                <IconButton sx={{ ml: 1 }} component="label" >
                  <UploadFileRoundedIcon color='secondary' />
                  <input type="file" hidden onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) setCover(file)
                  }} />
                </IconButton>
              </Box>
              {cover && <img src={URL.createObjectURL(cover)} alt="preview" style={{ maxWidth: '24vw', maxHeight: '56vh' }} />}
              {cover && (
                <Typography variant="body2">
                  Selected: {cover.name}
                </Typography>
              )}
            </Stack>
          </Stack>
        </Box>
      </Paper>
    </Box>
  )
}

export default AddGame
