import express, { json } from "express"
import { randomUUID } from "node:crypto"
import { validateMovie, validatePartialMovie } from "./schemas/movies.js"
import cors from "cors"
import { readJSON } from "./utils.js"

const movies = readJSON("./movies.json")

const app = express()
app.disable("x-powered-by")
app.use(json())
app.use(cors())

const PORT = process.env.PORT ?? 1234

app.get("/", (req, res) => {
  res.json({ message: "Rest Api" })
})

app.get("/movies", (req, res) => {
  const { genre } = req.query
  if (genre) {
    const filteredMovies = movies.filter((movie) =>
      movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
    )

    return res.json(filteredMovies)
  }
  res.json(movies)
})

app.get("/movies/:id", (req, res) => {
  const { id } = req.params
  const movie = movies.find((movie) => movie.id === id)
  if (movie) return res.json(movie)

  res.status(404).json({ message: "Movie not found" })
})

app.post("/movies", (req, res) => {
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

app.delete("/movies/:id", (req, res) => {
  const { id } = req.params
  const movieIndex = movies.findIndex((movie) => movie.id === id)
  if (movieIndex === -1) {
    return res.status(404).json({ message: "Movie not found" })
  }
  movies.splice(movieIndex, 1)
  return res.json({ messasge: `Movie ${id} deleted` })
})

app.patch("/movies/:id", (req, res) => {
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

app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`)
})
