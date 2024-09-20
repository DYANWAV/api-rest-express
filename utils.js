import { createRequire } from "node:module"
export const require = createRequire(import.meta.url)

export const readJSON = (path) => require(path)

export const getMovieIndex = (movies, id) =>
  movies.findIndex((movie) => movie.id === id)
