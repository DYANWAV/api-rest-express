export const getHTMLMoviesTemplate = (movies) =>
  movies
    .map((movie) => {
      return `
          <article class='movie-card' data-id="${movie.id}">
            <h2>${movie.title}</h2>
            <img src="${movie.poster}" alt="${movie.title}">
            <p>${movie.year}</p>

            <button class='btn-delete-movie'>asdf</button>
            </article>
            `
    })
    .join("")
