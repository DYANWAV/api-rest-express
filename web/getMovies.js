export const getMovies = () => {
  return fetch("http://localhost:1234/movies")
    .then((res) => res.json())
    .then((data) => data)
}
