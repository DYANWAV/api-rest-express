import { MovieModel } from "../models/movie.js"
import { validateMovie, validatePartialMovie } from "../schemas/movies.js"

export class MovieController {
  static async getAll(req, res) {
    const { genre } = req.query
    const movies = await MovieModel.getAll({ genre })
    res.json(movies)
  }

  static async getByID(req, res) {
    const { id } = req.params
    const movie = await MovieModel.getByID({ id })
    if (movie) return res.json(movie)
    res.status(400).json({ message: "Movie not found" })
  }

  static async create(req, res) {
    const result = validateMovie(req.body)

    if (result.error) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const newMovie = await MovieModel.create({ data: result.data })
    res.status(201).json(newMovie)
  }

  static async delete(req, res) {
    const { id } = req.params
    const movieDeleted = await MovieModel.delete({ id })
    if (movieDeleted === false) {
      return res.status(404).json({ message: "Movie not found" })
    }

    return res.json({ messasge: `Movie ${id} deleted` })
  }

  static async update(req, res) {
    const result = validatePartialMovie(req.body)

    if (result.error)
      return res.status(400).json({ error: JSON.parse(result.error.message) })

    const { id } = req.params
    const updatedMovie = await MovieModel.update({ id, data: result.data })
    if (updatedMovie === false)
      return res.status(400).json({ message: "Movie not found" })

    return res.json(updatedMovie)
  }
}
