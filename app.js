const express = require("express")
const moviesJSON = require("./movies.json")
const crypto = require("node:crypto")
const z = require("zod")
const { validateMovie, validatePartialMovie } = require("./schemas/movies")

const app = express()
app.disable("x-powered-by")
app.use(express.json())

const ACCPETED_ORIGINS = []

const PORT = process.env.PORT ?? 1234

app.get("/", (req, res) => {
  res.json({ message: "Rest Api" })
})

app.get("/movies", (req, res) => {
  res.header("Acces-Control-Allow-Origin", "")

  const { genre } = req.query
  if (genre) {
    const filteredMovies = moviesJSON.filter((movie) =>
      movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
    )

    return res.json(filteredMovies)
  }
  res.json(moviesJSON)
})

app.get("/movies/:id", (req, res) => {
  const { id } = req.params
  const movie = moviesJSON.find((movie) => movie.id === id)
  if (movie) return res.json(movie)

  res.status(404).json({ message: "Movie not found" })
})

app.post("/movies", (req, res) => {
  const result = validateMovie(req.body)

  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data,
  }
  moviesJSON.push(newMovie)
  res.status(201).json(newMovie)
})

app.patch("/movies/:id", (req, res) => {
  const result = validatePartialMovie(req.body)

  if (result.error)
    return res.status(400).json({ error: JSON.parse(result.error.message) })

  const { id } = req.params
  const movieIndex = moviesJSON.findIndex((movie) => movie.id === id)

  if (movieIndex === -1)
    return res.status(404).json({ message: "Movie not found" })

  const updatedMovie = { ...moviesJSON[movieIndex], ...result.data }
  moviesJSON[movieIndex] = updatedMovie
  return res.json(updatedMovie)
})

app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`)
})
