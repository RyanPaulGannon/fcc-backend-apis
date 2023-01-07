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
  upload.single("upfile"),
  (req: Request, res: Response) => {
    res.json({
      name: req.file?.originalname,
      type: req.file?.mimetype,
      size: req.file?.size,
    })
  }
)

/* listener */
app.listen(port, () => console.log(`Node Server listening on port ${port}`))
