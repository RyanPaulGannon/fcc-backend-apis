import "dotenv/config"
import cors from "cors"
import multer from "multer"
import express, { Application, Request, Response } from "express"

/* config */
const app: Application = express()
const port = process.env.PORT || 4000
const upload = multer({ dest: "uploads/" })

/* cors */
app.use(cors({ origin: "*" }))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

/* routes */
app.get("/", (req: Request, res: Response) => {
  res.sendFile(process.cwd() + "/src/views/index.html")
})

/*  */
app.post(
  "/api/fileanalyse",
  upload.single("file"),
  (req: Request, res: Response) => {
    res.json({
      name: req.body.filename,
      type: req.headers["content-type"],
      size: req.body.size,
    })
  }
)

/* listener */
app.listen(port, () => console.log(`Node Server listening on port ${port}`))
