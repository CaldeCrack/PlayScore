import { useEffect, useState, useRef } from 'react'
import { useBoundStore } from '../stores/boundStore'
import type Game from '../types/Game'
import gameService from '../services/games'
import KeyboardShortcut from './KeyboardShortcut'
import { useNavigate, useLocation } from 'react-router-dom'

import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import Stack from '@mui/material/Stack'
import Chip from '@mui/material/Chip'

import FilterListIcon from '@mui/icons-material/FilterList'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'


const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 420,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 3,
  borderRadius: 2
}

interface MinMax {
  min: number | ''
  max: number | ''
}

const GameSearch = () => {
  const [allGames, setAllGames] = useState<Game[]>([])
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [developer, setDeveloper] = useState('')
  const [publisher, setPublisher] = useState('')
  const [genres, setGenres] = useState<string[]>([])
  const [platforms, setPlatforms] = useState<string[]>([])
  const [releaseYear, setReleaseYear] = useState<MinMax>({ min: '', max: '' })
  const [minRating, setMinRating] = useState<MinMax>({ min: '', max: '' })

  const navigate = useNavigate()
  const location = useLocation()
  const { games, setGames } = useBoundStore()
  const searchRef = useRef<HTMLInputElement | null>(null)

  // --- Perform the default title search ---
  const handleSearch = () => {
    if (!query.trim()) {
      setGames(allGames)
      return
    }

    const filtered = allGames.filter((game: Game) =>
      game.title.toLowerCase().includes(query.toLowerCase())
    )

    setGames(filtered)

    if (location.pathname !== '/' && location.pathname !== '/games') {
      navigate('/')
      return
    }
  }

  // --- Filter search from modal ---
  const applyFilters = () => {
    let filtered = [...allGames]

    if (query.trim())
      filtered = filtered.filter(g =>
        g.title.toLowerCase().includes(query.toLowerCase())
      )

    if (developer.trim())
      filtered = filtered.filter(g =>
        g.developers.some(d =>
          d.toLowerCase().includes(developer.toLowerCase())
        )
      )

    if (releaseYear.min !== '' || releaseYear.max !== '') {
      filtered = filtered.filter(g => {
        const y = g.release_year
        const minOk = releaseYear.min === '' || y >= releaseYear.min
        const maxOk = releaseYear.max === '' || y <= releaseYear.max
        return minOk && maxOk
      })
    }

    if (publisher.trim())
      filtered = filtered.filter(g =>
        g.publisher.toLowerCase().includes(publisher.toLowerCase())
      )

    if (genres.length > 0)
      filtered = filtered.filter(g =>
        g.genres.some(genre => genres.includes(genre))
      )

    if (platforms.length > 0)
      filtered = filtered.filter(g =>
        g.platforms.some(p => platforms.includes(p))
      )

    if (minRating.min !== '' || minRating.max !== '') {
      filtered = filtered.filter(g => {
        if (g.ratings.length === 0) return false
        const avg = g.ratings.reduce((a, r) => a + r.score, 0) / g.ratings.length

        const minOk = minRating.min === '' || avg >= minRating.min
        const maxOk = minRating.max === '' || avg <= minRating.max

        return minOk && maxOk
      })
    }

    setGames(filtered)
    setModalOpen(false)

    if (location.pathname !== '/' && location.pathname !== '/games') {
      navigate('/')
      return
    }
  }

  const clearFilters = () => {
    setQuery('')
    setDeveloper('')
    setPublisher('')
    setGenres([])
    setPlatforms([])
    setReleaseYear({ min: '', max: '' })
    setMinRating({ min: '', max: '' })
    setGames(allGames)
  }

  useEffect(() => {
    gameService
      .getAllGames()
      .then((data) => {
        setAllGames(data)
        setGames(data)
      })
  }, [games])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()

      // Ctrl + Shift + Space → open modal
      if (e.ctrlKey && e.shiftKey && key === '/') {
        e.preventDefault()
        setModalOpen(true)
        return
      }

      // Ctrl + Space → focus search bar
      if (e.ctrlKey && key === '/') {
        e.preventDefault()
        searchRef.current?.focus()
        return
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <Box display="flex" alignItems="center" gap={1}>
      {/* Search Bar */}
      <TextField
        inputRef={searchRef}
        size="small"
        placeholder="Search games..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSearch()
          if (e.key === 'Escape') searchRef.current?.blur()
        }}
        sx={{ width: '100%', backgroundColor: '#020412', borderRadius: 1 }}
        slotProps={{
          input: {
            startAdornment: (
              <IconButton color='primary' size='small' sx={{ ml: -1 }}>
                <SearchIcon onClick={handleSearch} />
              </IconButton>
            ),
            endAdornment: (
              <Box sx={{ display: 'flex', alignItems: 'center', mr: -1 }}>
                <KeyboardShortcut keys='Ctrl+/' />
                <IconButton color='primary' size='small'>
                  <FilterListIcon onClick={() => setModalOpen(true)} />
                </IconButton>
                <IconButton color='primary' size='small'>
                  <ClearIcon onClick={() => clearFilters()} />
                </IconButton>
              </Box>
            ),
          }
        }}
      />

      {/* FILTER MODAL */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Paper
          sx={modalStyle}
          component="form"
          onSubmit={(e) => {
            e.preventDefault()
            applyFilters()
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2
            }}>
            <Typography variant="h6">Advanced Filters</Typography>
            <KeyboardShortcut keys='Ctrl+Shift+/' />
          </Box>

          <Stack spacing={2}>
            {/* Title */}
            <TextField
              label="Title"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              fullWidth
            />

            {/* Developer */}
            <TextField
              label="Developer"
              value={developer}
              onChange={(e) => setDeveloper(e.target.value)}
              fullWidth
            />

            {/* Release Year Range */}
            <Stack direction="row" spacing={2}>
              <TextField
                label="Min Year"
                type="number"
                value={releaseYear.min ?? ''}
                slotProps={{ htmlInput: { min: 0, step: 1 } }}
                onChange={(e) =>
                  setReleaseYear((prev) => ({
                    ...prev,
                    min: e.target.value === '' ? '' : Number(e.target.value)
                  }))
                }
                fullWidth
              />

              <TextField
                label="Max Year"
                type="number"
                value={releaseYear.max ?? ''}
                slotProps={{ htmlInput: { min: 1, step: 1 } }}
                onChange={(e) =>
                  setReleaseYear((prev) => ({
                    ...prev,
                    max: e.target.value === '' ? '' : Number(e.target.value)
                  }))
                }
                fullWidth
              />
            </Stack>

            {/* Publisher */}
            <TextField
              label="Publisher"
              value={publisher}
              onChange={(e) => setPublisher(e.target.value)}
              fullWidth
            />

            {/* Platforms (Autocomplete + Chips) */}
            <Box>
              <Autocomplete
                freeSolo
                multiple
                options={Array.from(new Set(allGames.flatMap(g => g.platforms)))}
                value={platforms}
                onChange={(_, newValue) => setPlatforms(newValue)}
                renderValue={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={index}
                      label={option}
                      color="primary"
                      variant="outlined"
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Platforms"
                    placeholder="Add a platform"
                  />
                )}
                slotProps={{ paper: { sx: { backgroundColor: '#0d1025' } } }}
              />
            </Box>

            {/* Genres (Autocomplete + Chips) */}
            <Box>
              <Autocomplete
                freeSolo
                multiple
                options={Array.from(new Set(allGames.flatMap(g => g.genres)))}
                value={genres}
                onChange={(_, newValue) => setGenres(newValue)}
                renderValue={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={index}
                      label={option}
                      color="secondary"
                      variant="outlined"
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Genres"
                    placeholder="Add a genre"
                  />
                )}
                slotProps={{ paper: { sx: { backgroundColor: '#0d1025' } } }}
              />
            </Box>

            {/* Rating range */}
            <Stack direction="row" spacing={2}>
              <TextField
                label="Min Rating"
                type="number"
                value={minRating.min ?? ''}
                slotProps={{ htmlInput: { min: 1, max: 10, step: 0.1 } }}
                onChange={(e) =>
                  setMinRating((prev) => ({
                    ...prev,
                    min: e.target.value === '' ? '' : Number(e.target.value)
                  }))
                }
                fullWidth
              />

              <TextField
                label="Max Rating"
                type="number"
                value={minRating.max ?? ''}
                slotProps={{ htmlInput: { min: 1, max: 10, step: 0.1 } }}
                onChange={(e) =>
                  setMinRating((prev) => ({
                    ...prev,
                    max: e.target.value === '' ? '' : Number(e.target.value)
                  }))
                }
                fullWidth
              />
            </Stack>

            <Stack direction="row" spacing={2} justifyContent="flex-end" mt={1}>
              <Button onClick={clearFilters}>Clear</Button>
              <Button type="submit" variant="contained" color="secondary">
                Apply
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Modal>
    </Box>
  )
}

export default GameSearch
