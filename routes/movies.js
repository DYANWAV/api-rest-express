import { Router } from "express"
import { readJSON } from "../utils.js"
import { validateMovie, validatePartialMovie } from "../schemas/movies.js"
import { randomUUID } from "node:crypto"
const movies = readJSON("./movies.json")

export const moviesRouter = Router()

moviesRouter.get("/", (req, res) => {
  const { genre } = req.query
  if (genre) {
    const filteredMovies = movies.filter((movie) =>
      movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
    )

    return res.json(filteredMovies)
  }
  res.json(movies)
})

moviesRouter.get("/:id", (req, res) => {
  const { id } = req.params
  const movie = movies.find((movie) => movie.id === id)
  if (movie) return res.json(movie)

  res.status(404).json({ message: "Movie not found" })
})

moviesRouter.post("/", (req, res) => {
  const result = validateMovie(req.body)

  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const newMovie = {
    id: randomUUID(),
    ...result.data,
  }
  movies.push(newMovie)
  res.status(201).json(newMovie)
})

moviesRouter.delete("/:id", (req, res) => {
  const { id } = req.params
  const movieIndex = movies.findIndex((movie) => movie.id === id)
  if (movieIndex === -1) {
    return res.status(404).json({ message: "Movie not found" })
  }
  movies.splice(movieIndex, 1)
  return res.json({ messasge: `Movie ${id} deleted` })
})

moviesRouter.patch("/movies/:id", (req, res) => {
  const result = validatePartialMovie(req.body)

  if (result.error)
    return res.status(400).json({ error: JSON.parse(result.error.message) })

  const { id } = req.params
  const movieIndex = movies.findIndex((movie) => movie.id === id)

  if (movieIndex === -1)
    return res.status(404).json({ message: "Movie not found" })

  const updatedMovie = { ...movies[movieIndex], ...result.data }
  movies[movieIndex] = updatedMovie
  return res.json(updatedMovie)
})
