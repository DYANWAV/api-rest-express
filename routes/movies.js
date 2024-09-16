import { Router } from "express"
import { readJSON } from "../utilities/require"
const movies = readJSON("../movies.json")

const router = Router()

router.get("/", (req, res) => {
  const { genre } = req.query
  if (genre) {
    const filteredMovies = movies.filter((movie) =>
      movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
    )

    return res.json(filteredMovies)
  }
  res.json(movies)
})
