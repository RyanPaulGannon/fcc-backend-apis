import "dotenv/config"
import cors from "cors"
import express, { Application, Request, Response } from "express"
import { connect } from "./database/client"
import {
  checkIfUserExists,
  createUser,
  findUserByUsername,
  findUserById,
  getAllUsers,
} from "./database/exerciseTracker"

/* config */
const app: Application = express()
const port = process.env.PORT || 4000

/* cors */
app.use(cors({ origin: "*" }))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

/* routes */
app.get("/", (req: Request, res: Response) => {
  res.sendFile(process.cwd() + "/src/views/index.html")
})

/* database */
connect()

/* Exercise Tracker */
app
  .route("/api/users")
  .post(async (req: Request, res: Response) => {
    let username = req.body.username

    if (!username) res.send("No user entered")

    const doesUserExist = await checkIfUserExists(username)

    if (!doesUserExist) await createUser(username)

    const user = await findUserByUsername(username)

    if (user) {
      res.json({ username: user.username, _id: user.id })
    } else {
      res.send("Invalid")
    }
  })
  .get(async (req: Request, res: Response) => {
    const users = await getAllUsers()
    res.json(users)
  })

app.post("/api/users/:_id/exercises", async (req: Request, res: Response) => {
  let { description, duration, date } = req.body
  let id = req.params._id

  const user = await findUserById(id)

  if (!user) res.send("No user found")

  if (!date) {
    date = new Date()
  } else {
    new Date(date)
  }

  // await addExerciseData(description, Number(duration), date, id)

  res.json({
    _id: id,
    username: user?.username,
    date: date.toDateString(),
    duration: Number(duration),
    description,
  })
})

// app.get("/api/users/:_id/logs", async (req: Request, res: Response) => {
//   const userId = req.params._id
//   const user = await findUserById(userId)

//   if (!user) res.json({ message: "User not found" })

//   const exercises = await findExerciseLog(userId)

//   res.json({ username: user?.username, exercises: exercises })
// })

/* listener */
app.listen(port, () => console.log(`Node Server listening on port ${port}`))
