import "dotenv/config"
import cors from "cors"
import mongoose, { Schema } from "mongoose"
import express, { Application, Request, Response } from "express"
import { prisma } from "@prisma/client"

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
mongoose.connect(process.env.DATABASE_URL!)

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
    },
  },
  { versionKey: false }
)

const User = mongoose.model("User", userSchema)

const exerciseSchema = new Schema({
  username: String,
  description: String,
  duration: Number,
  date: String,
  userId: String,
})

const Exercise = mongoose.model("Exercise", exerciseSchema)

/* Exercise Tracker */
app
  .route("/api/users")
  .post(async (req: Request, res: Response) => {
    const username = req.body.username
    const userExists = await User.findOne({ username })

    if (userExists) res.send(userExists)

    const user = new User({ username, count: 0 })
    user.save((err, user) => {
      if (err) {
        res.json({ error: err })
      } else {
        res.json(user)
      }
    })
  })
  .get(async (req: Request, res: Response) => {
    const users = await User.find()
    res.send(users)
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
