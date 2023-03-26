import "dotenv/config"
import cors from "cors"
import mongoose, { Schema } from "mongoose"
import express, { Application, Request, Response } from "express"
import { connect } from "./database/client"

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
// mongoose.connect(process.env.DATABASE_URL!)

const userSchema = new Schema({
  username: { type: String, required: true },
  log: [
    {
      description: { type: String, required: true },
      duration: { type: Number, required: true },
      date: { type: Date, required: true },
    },
  ],
})

const User = mongoose.model("user", userSchema)

/* Exercise Tracker */
app
  .route("/api/users")
  .post(async (req: Request, res: Response) => {
    const username = req.body.username

    let user = new User({
      username: `${username}`,
    })
    user.save(function (err, data) {
      if (err) return console.error(err)
      res.send({
        username,
        _id: data._id,
      })
    })
  })
  .get(async (req: Request, res: Response) => {
    User.find({}, function (err: Error, users: any) {
      var userMap: any = []

      users.forEach(function (user: any) {
        userMap.push({
          _id: user.id,
          username: user.username,
        })
      })
      res.send(userMap)
    })
  })

app.post("/api/users/:_id/exercises", async (req: Request, res: Response) => {
  const _id = req.params._id
  const description = req.body.description
  const duration = req.body.duration
  const date = req.body.date
    ? new Date(req.body.date).toDateString()
    : new Date().toDateString()

  const expObj = {
    description,
    duration,
    date,
  }

  User.findByIdAndUpdate(
    _id,
    { $push: { log: expObj } },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        return res.json(err)
      }

      let returnObj = {
        _id,
        username: updatedUser?.username,
        date: expObj.date,
        duration: parseInt(expObj.duration),
        description: expObj.description,
      }
      res.json(returnObj)
    }
  )
})

app.get("/api/users/:_id/logs", async (req: Request, res: Response) => {
  const _id = req.params._id
  const from: any = req.query.from
  const to: any = req.query.to
  const limit = +req.query.limit!

  User.findById({ _id }, (err: any, user: any) => {
    if (err) return console.log(err)

    let log = user.log.map((item: any) => {
      return {
        description: item.description,
        duration: item.duration,
        date: new Date(item.date).toDateString(),
      }
    })
    if (from) {
      const fromDate = new Date(from)
      log = log.filter((exe: any) => new Date(exe.date) >= fromDate)
    }
    if (to) {
      const toDate = new Date(to)
      log = log.filter((exe: any) => new Date(exe.date) <= toDate)
    }
    if (limit) {
      log = log.slice(0, limit)
    }

    res.send({
      username: user.username,
      count: log.length,
      _id,
      log,
    })
  })
})

/* listener */
app.listen(port, () => console.log(`Node Server listening on port ${port}`))
