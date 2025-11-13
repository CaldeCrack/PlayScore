import { useEffect, useState } from 'react'
import type Duration from '../types/Duration'
import type Game from '../types/Game'
import gameService from '../services/games'
import loginService from '../services/login'
import { useNavigate } from 'react-router-dom'


const AddGame = () => {
  const [title, setTitle] = useState<string>('')
  const [developers, setDevelopers] = useState<string[]>([])
  const [publisher, setPublisher] = useState<string>('')
  const [releaseYear, setReleaseYear] = useState<number>(0)
  const [platforms, setPlatforms] = useState<string[]>([])
  const [genres, setGenres] = useState<string[]>([])
  const [mainDuration, setMainDuration] = useState<number>(0)
  const [extraDuration, setExtraDuration] = useState<number>(0)
  const [completeDuration, setCompleteDuration] = useState<number>(0)
  const [description, setDescription] = useState<string>('')
  const [cover, setCover] = useState<string>('')

  const navigate = useNavigate()

  const addDeveloper = () => {
    setDevelopers(developers.concat(''))
  }

  const removeDeveloper = () => {
    setDevelopers(developers.slice(0, -1))
  }

  const addPlatform = () => {
    setPlatforms(platforms.concat(''))
  }

  const removePlatform = () => {
    setPlatforms(platforms.slice(0, -1))
  }


  const addGenre = () => {
    setGenres(genres.concat(''))
  }

  const removeGenre = () => {
    setGenres(genres.slice(0, -1))
  }

  const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value)
  }

  const handleChangeDeveloper = (event: React.ChangeEvent<HTMLInputElement>, changed: number) => {
    setDevelopers(developers.map((dev, index) => {
      return index === Number(changed)
        ? event.target.value
        : dev
    }))
  }

  const handleChangePlatform = (event: React.ChangeEvent<HTMLInputElement>, changed: number) => {
    setPlatforms(platforms.map((plt, index) => {
      return index === Number(changed) ? event.target.value
        : plt
    }))
  }

  const handleChangeGenre = (event: React.ChangeEvent<HTMLInputElement>, changed: number) => {
    setGenres(genres.map((gen, index) => {
      return index === Number(changed) ? event.target.value
        : gen
    }))
  }

  const handleChangePublisher = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPublisher(event.target.value)
  }

  const handleChangeReleaseYear = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReleaseYear(Number(event.target.value))
  }

  const handleChangeMainDuration = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMainDuration(Number(event.target.value))
  }

  const handleChangeExtraDuration = (event: React.ChangeEvent<HTMLInputElement>) => {
    setExtraDuration(Number(event.target.value))
  }

  const handleChangeCompleteDuration = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCompleteDuration(Number(event.target.value))
  }

  const handleChangeDescription = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value)
  }

  const handleChangeCover = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.item(0)
    if (file)
      setCover(file.name)
  }

  const handleSubmitGame = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault()
    const duration: Duration = {
      main_story: mainDuration,
      main_plus_extras: extraDuration,
      completionist: completeDuration
    }
    const game: Omit<Game, 'id' | 'ratings' | 'comments'> = {
      title: title,
      developers: developers,
      publisher: publisher,
      release_year: releaseYear,
      platforms: platforms,
      genres: genres,
      average_duration: duration,
      description: description,
      cover_image: cover
    }
    gameService
      .postGame(game)
      .then((response) => console.log(response))
      .catch((error) => console.log(error))
  }

  useEffect(() => {
    const init = async () => {
      const user = await loginService.restoreLogin()
      if (!user || (user && user.username !== 'admin'))
        navigate('/login')
    }
    init()
  })

  return (
    <form onSubmit={handleSubmitGame}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <h1>Add Game</h1>
        <div style={{ display: 'flex', flexDirection: 'column',  width: '500px', gap:'15px' }}>
          <label htmlFor="title"><strong>Title</strong></label>
          <input type="text" id="title" value={title} placeholder="Title" onChange={handleChangeTitle}/>

          <label htmlFor="devs-button"><strong>Developers</strong></label>
          <button onClick={addDeveloper} type="button" id="devs-button">Add Developer</button>
          <button onClick={removeDeveloper} type="button" disabled={developers.length === 0} style={{ backgroundColor: '#be1818ff' }}>Remove Developer</button>
          {developers.map((dev, i) => <input key={i} value={dev} onChange={(e) => handleChangeDeveloper(e, i)}/>)}

          <label htmlFor="title"><strong>Publisher</strong></label>
          <input type="text" id="publisher" value={publisher} placeholder="Publisher" onChange={handleChangePublisher}/>

          <label htmlFor="release"><strong>Release Year</strong></label>
          <input type="number" id="release" value={releaseYear} placeholder="Release Year" onChange={handleChangeReleaseYear}/>

          <label htmlFor="platforms-button"><strong>Platforms</strong></label>
          <button onClick={addPlatform} type="button" id="platforms-button">Add Platform</button>
          <button onClick={removePlatform} type="button" disabled={platforms.length === 0} style={{ backgroundColor: '#be1818ff' }}>Remove Platform</button>
          {platforms.map((plt, i) => <input key={i} value={plt} onChange={(e) => handleChangePlatform(e, i)}/>)}

          <label htmlFor="genres-button"><strong>Genres</strong></label>
          <button onClick={addGenre} type="button" id="genres-button">Add Genre</button>
          <button onClick={removeGenre} type="button" disabled={genres.length === 0} style={{ backgroundColor: '#be1818ff' }}>Remove Genre</button>
          {genres.map((gen, i) => <input key={i} value={gen} onChange={(e) => handleChangeGenre(e, i)}/>)}

          <label htmlFor="duration"><strong>Average Duration</strong></label>
          <div id="duration" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <label htmlFor="main">Average Time Main Story</label>
            <input type="number" id="main" value={mainDuration} onChange={handleChangeMainDuration}/>

            <label htmlFor="extra">Average Time Main Story + Extra</label>
            <input type="number" id="extra" value={extraDuration} onChange={handleChangeExtraDuration}/>

            <label htmlFor="complete">Average Time Completionist</label>
            <input type="number" id="complete" value={completeDuration} onChange={handleChangeCompleteDuration}/>
          </div>

          <label htmlFor="description">Description</label>
          <textarea id="description" value={description} placeholder="Description" onChange={handleChangeDescription}></textarea>

          <label htmlFor="cover">Cover</label>
          <input type="file" id="cover" onChange={handleChangeCover}/>
        </div>
        <button type="submit">Submit Game</button>
      </div>
    </form>
  )

}

export default AddGame