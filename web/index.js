import { deleteMovie } from "./deleteMovie.js"
import { getHTMLMoviesTemplate } from "./getHTMLMoviesTemplate.js"
import { getMovies } from "./getMovies.js"

getMovies().then((movies) => {
  const moviesHTML = getHTMLMoviesTemplate(movies)
  document.querySelector("main").innerHTML = moviesHTML

  document.querySelector("main").addEventListener("click", (e) => {
    if (e.target.matches(".btn-delete-movie")) {
      const article = e.target.closest("article")
      const id = article.dataset.id

      deleteMovie(id, article)
    }
  })
})
