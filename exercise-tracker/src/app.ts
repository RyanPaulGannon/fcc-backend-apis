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
  addExerciseData,
  getExerciseLog,
} from "./database/exerciseTracker"
import { Prisma } from "@prisma/client"

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
    const username = req.body.username

    if (!username) res.send("No user entered")

    const doesUserExist = await checkIfUserExists(username)

    if (!doesUserExist) await createUser(username)

    const user = await findUserByUsername(username)

    res.json({ username, _id: user?.id })
  })
  .get(async (req: Request, res: Response) => {
    const users = await getAllUsers()
    res.json(users)
  })

app.post("/api/users/:_id/exercises", async (req: Request, res: Response) => {
  let { description, duration, date } = req.body
  console.log(description, duration, date)
  res.json({})
})

// app.post("/api/users/:_id/exercises", async (req: Request, res: Response) => {
//   const id = req.params._id
//   const description = req.body.description
//   const duration = parseInt(req.body.duration)
//   const date = req.body.date ? req.body.date : new Date()

//   const user = await findUserById(id)
//   if (!user) res.send("No user found")

//   const exercises = [{ description, duration, date }] as Prisma.JsonArray
//   await addExerciseData(id, exercises)

//   res.json({
//     username: user?.username,
//     description,
//     duration,
//     date: date.toDateString(),
//     _id: id,
//   })
// })

// app.get("/api/users/:_id/logs", async (req: Request, res: Response) => {
//   const id = req.params._id
//   const user = await getExerciseLog(id)

//   if (!user) res.json({ message: "User not found" })

//   res.json({
//     username: user?.username,
//     count: 1,
//     _id: user?.id,
//     log: user?.log,
//   })
// })

/* listener */
app.listen(port, () => console.log(`Node Server listening on port ${port}`))
