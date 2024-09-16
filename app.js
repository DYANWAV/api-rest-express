import express, { json } from "express"
import { corsMiddlewares } from "./middlewares/cors.js"
import { moviesRouter } from "./routes/movies.js"

const app = express()

app.disable("x-powered-by")

app.use(json())

app.use(
  corsMiddlewares({
    host: "localhost:4321",
  })
)

app.use("/movies", moviesRouter)

const PORT = process.env.PORT ?? 1234

app.get("/", (req, res) => {
  res.json({ message: "Rest Api" })
})

app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`)
})
