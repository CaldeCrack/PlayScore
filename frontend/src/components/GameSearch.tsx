import { useEffect, useState } from 'react'
import { useBoundStore } from '../stores/boundStore'
import type Game from '../types/Game'
import gameService from '../services/games'

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
  const { setGames } = useBoundStore()

  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)

  const [developer, setDeveloper] = useState('')
  const [publisher, setPublisher] = useState('')
  const [genres, setGenres] = useState<string[]>([])
  const [platforms, setPlatforms] = useState<string[]>([])
  const [releaseYear, setReleaseYear] = useState<MinMax>({ min: '', max: '' })
  const [minRating, setMinRating] = useState<MinMax>({ min: '', max: '' })

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
  }

  const clearFilters = () => {
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
      .then((data) => setAllGames(data))
  }, [])

  return (
    <Box display="flex" alignItems="center" gap={1}>
      {/* Search Bar */}
      <TextField
        size="small"
        placeholder="Search games..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        sx={{ width: 300 }}
        slotProps={{
          input: {
            endAdornment: (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton size='small'>
                  <SearchIcon onClick={handleSearch} />
                </IconButton>
                <IconButton size='small'>
                  <FilterListIcon onClick={() => setModalOpen(true)} />
                </IconButton>
                <IconButton size='small'>
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
          <Typography variant="h6" mb={2}>Advanced Filters</Typography>

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
              />
            </Box>

            {/* Rating range */}
            <Stack direction="row" spacing={2}>
              <TextField
                label="Min Rating"
                type="number"
                value={minRating.min ?? ''}
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
