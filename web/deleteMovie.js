export function deleteMovie(id, element) {
  fetch(`http://localhost:1234/movies/${id}`, { method: "DELETE" }).then(
    (res) => {
      if (res.ok) {
        element.remove()
      }
    }
  )
}
