import axios from "axios";
import { useEffect, useState } from "react";
import type { Game } from "../types/Game";
import GameDisplay from "./GameDisplay";

const Home = () => {
    const [games, setGames]     = useState<Game[]>([]);

    useEffect(() =>{
        console.log("loading games");

        axios.get("http://localhost:3001/games")
            .then((response) => {
            console.log(response.data)
            setGames(response.data)
        })
    }, [])

    return <>
        <h1>PlayScore</h1>

        <ul>
            {
                games.map((game: Game, idx: number) => {
                    return <li key={ idx }>
                        <GameDisplay
                            id={ game.id }  
                            title={ game.title }  
                            release_year={ game.release_year }  
                            publisher={ game.publisher }  
                            genres={ game.genres }  
                            platforms={ game.platforms }  
                            rating={ game.rating }  
                            cover={ game.cover }  
                        />
                    </li>
                })     
            }
        </ul>
    </>
}

export default Home;