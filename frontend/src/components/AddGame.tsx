import { useEffect, useState } from 'react'
import gameService from '../services/games'
import { useNavigate } from 'react-router-dom'
import { useBoundStore } from '../stores/boundStore'

import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
import Divider from '@mui/material/Divider'
import UploadFileRoundedIcon from '@mui/icons-material/UploadFileRounded'


const AddGame = () => {
  const [title, setTitle] = useState('')
  const [developers, setDevelopers] = useState<string[]>([])
  const [publisher, setPublisher] = useState('')
  const [releaseYear, setReleaseYear] = useState<number | null>(null)
  const [platforms, setPlatforms] = useState<string[]>([])
  const [genres, setGenres] = useState<string[]>([])
  const [description, setDescription] = useState('')
  const [cover, setCover] = useState<File>()

  const navigate = useNavigate()
  const { user, addGame } = useBoundStore()

  const addDeveloper = () => setDevelopers([...developers, ''])
  const removeDeveloper = () => setDevelopers(developers.slice(0, -1))

  const addPlatform = () => setPlatforms([...platforms, ''])
  const removePlatform = () => setPlatforms(platforms.slice(0, -1))

  const addGenre = () => setGenres([...genres, ''])
  const removeGenre = () => setGenres(genres.slice(0, -1))

  const handleSubmitGame = async (event: React.FormEvent) => {
    event.preventDefault()

    const formData = new FormData()
    formData.append('title', title)
    developers.forEach((dev, i) => formData.append(`developers[${i}]`, dev))
    formData.append('publisher', publisher)
    formData.append('release_year', releaseYear!.toString())
    platforms.forEach((plt, i) => formData.append(`platforms[${i}]`, plt))
    genres.forEach((gen, i) => formData.append(`genres[${i}]`, gen))
    formData.append('average_duration[main_story]', (0).toString())
    formData.append('average_duration[main_plus_extras]', (0).toString())
    formData.append('average_duration[completionist]', (0).toString())
    formData.append('description', description)
    if (cover) formData.append('cover', cover)

    const response = await gameService.postGame(formData)
    addGame(response.data)
    navigate('/')
  }

  useEffect(() => {
    if (!user || user.username !== 'admin') {
      navigate('/login')
    }
  }, [user, navigate])

  return (
    <Box sx={{
      width: '100%',
      height: '92%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Paper sx={{ p: 2, width: '80vw' }}>
        <Box component="form" onSubmit={handleSubmitGame}>
          <Stack direction='row' sx={{ justifyContent: 'space-between', alignItems:' center', mb: 2 }}>
            <Typography variant="h4">Add Game</Typography>
            {/* Submit */}
            <Button type="submit" variant="contained" size="small" color='secondary'>
              Submit Game
            </Button>
          </Stack>

          <Stack direction='row' spacing={5}>
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
              <Box  flexGrow={1} flexBasis={0} sx={{ alignItems: 'flex-start' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="h6">Developers</Typography>
                  <Stack direction="row" sx={{ ml: 1 }} >
                    <IconButton onClick={addDeveloper}>
                      <AddCircleIcon color='secondary' />
                    </IconButton>
                    <IconButton
                      color="error"
                      disabled={developers.length === 0}
                      onClick={removeDeveloper}
                    >
                      <RemoveCircleIcon />
                    </IconButton>
                  </Stack>

                  <Stack spacing={0.8}>
                    {developers.map((dev, i) => (
                      <TextField
                        key={i}
                        label={`Developer #${i + 1}`}
                        value={dev}
                        onChange={(e) =>
                          setDevelopers(
                            developers.map((d, idx) => (idx === i ? e.target.value : d))
                          )
                        }
                        fullWidth
                      />
                    ))}
                  </Stack>
                </Box>
              </Box>

              {/* Platforms */}
              <Box  flexGrow={1} flexBasis={0} sx={{ alignItems: 'flex-start' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="h6">Platforms</Typography>
                  <Stack direction="row" sx={{ ml: 1 }} >
                    <IconButton onClick={addPlatform}>
                      <AddCircleIcon color='secondary' />
                    </IconButton>
                    <IconButton
                      color="error"
                      disabled={platforms.length === 0}
                      onClick={removePlatform}
                    >
                      <RemoveCircleIcon />
                    </IconButton>
                  </Stack>

                  {platforms.map((plt, i) => (
                    <TextField
                      key={i}
                      label={`Platform #${i + 1}`}
                      value={plt}
                      onChange={(e) =>
                        setPlatforms(
                          platforms.map((p, idx) => (idx === i ? e.target.value : p))
                        )
                      }
                      fullWidth
                    />
                  ))}
                </Box>
              </Box>

              {/* Genres */}
              <Box  flexGrow={1} flexBasis={0} sx={{ alignItems: 'flex-start' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="h6" display='inline'>Genres</Typography>
                  <Stack direction="row" sx={{ ml: 1 }} >
                    <IconButton onClick={addGenre}>
                      <AddCircleIcon color='secondary' />
                    </IconButton>
                    <IconButton
                      color="error"
                      disabled={genres.length === 0}
                      onClick={removeGenre}
                    >
                      <RemoveCircleIcon />
                    </IconButton>
                  </Stack>

                  {genres.map((gen, i) => (
                    <TextField
                      key={i}
                      label={`Genre #${i + 1}`}
                      value={gen}
                      onChange={(e) =>
                        setGenres(
                          genres.map((g, idx) => (idx === i ? e.target.value : g))
                        )
                      }
                      fullWidth
                    />
                  ))}
                </Box>
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
              {cover && <img src={URL.createObjectURL(cover)} alt="preview" style={{ maxWidth: '24vw' }} />}
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
