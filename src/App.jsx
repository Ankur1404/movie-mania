import { useState, useEffect } from "react";
import {useDebounce} from 'react-use'
import Search from "./components/search";
import Card from "./components/Card";
const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
import { updateSearchCount } from "./appwrite";
import { getTrendingMovies } from './appwrite.js'

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      `Bearer ${API_KEY}`,
  },
};

const App = () => {

  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [movie, setMovie] = useState([]);
  const [load, setLoad] = useState(false);
  const [debounce,setDebounce]=useState('')
   const [trendingMovies, setTrendingMovies] = useState([]);


  useDebounce (()=>setDebounce(search),500,[search])

  const fetchMovies = async (query='') => {
    setLoad(true);
    setError("");
    try {
      const endpoint = query ?`${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`:`${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();
      // console.log(data);

      setMovie(data.results || []); 

      if(query&& data.results.length>0)
      {
        await updateSearchCount(query,data.results[0]);
      }

    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setError("Error fetching movies. Please try again later.");
      setMovie([]); 
    } finally {
      setLoad(false);
    }
  };


  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();

      setTrendingMovies(movies);
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
    }
  }

  useEffect(() => {
    fetchMovies(debounce);
    
  }, [debounce]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);
  return (
    <main>
      <div className="pattern w-screen h-screen bg-center bg-cover absolute z-0 bg-[url('/bg.png')]"></div>
      <div className="wrapper">
        <header>
          <img src="./image.png" alt="Logo" />
          <h1>
            <span className="text-gradient">Discover. Watch. Repeat.</span> The
            Ultimate Destination for Movie Lovers!
          </h1>
          <Search search={search} setSearch={setSearch} />
        </header>
        <p className="text-white align-middle">{search}</p>



        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>

            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}


        <section className="all-movies">
          <h2 className="mt-10">All movies</h2>
          {load ? (
            <p className="text-white">Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : movie.length === 0 ? ( 
            <p className="text-white">No movies found</p> 
          ) : (
            <ul>
              {movie.map((movies) => (
              <Card key={movies.id} movie={movies}/>
              ))}
            </ul>
          )}
        </section>

       
      </div>
    </main>
  );
};

export default App;
