import React from "react";


const apiKey = '0728cfb7b9ceb8241d937de05e0cd620';          //! спрятать ключ в .env
const API_URL = `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}&language=ru-RU`;
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w200";


export type Movie = {
    id: number
    image: string
    title: string
    release_date: string
    rating: number
    original_language: string
    overview: string
}


export function useGetMovies() {
    const [movies, setMovies] = React.useState<Movie[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(()=> {
        fetch(API_URL)
            .then((res)=> res.json())
            .then((data)=> {
                setMovies(
                    data.results.map((movie)=> ({
                        id: movie.id,
                        image: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : "",
                        title: movie.title,
                        release_date: movie.release_date,
                        rating: movie.vote_average,
                        original_language: movie.original_language,
                        overview: movie.overview
                    }))
                );
                setLoading(false);
            })
            .catch(()=> setLoading(false));
    }, []);

    return {
        movies,
        loading
    }
}