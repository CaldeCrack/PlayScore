import type { Rating } from '../types/Rating'

interface GameDisplayProps {
    id: number,
    title: string,
    release_year: number,
    publisher: string,
    genres: string[],
    platforms: string[],
    rating: Rating,
    cover: string,
}

const GameDisplay = (props: GameDisplayProps) => {
  return <>
    <h2><a href={ '/games/' + props.id }>{ props.title } ({ props.release_year })</a> [{ props.rating.average_score }]</h2>
    <p>{ props.publisher }</p>
  </>
}


export default GameDisplay