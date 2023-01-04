import dns from "dns"
import url from "url"
import "dotenv/config"
import cors from "cors"
import express, { Application, Request, Response } from "express"
import { connect } from "./database/connect"
import {
  checkIfUrlExists,
  getUrlData,
  getUrlIdData,
  postUrlData,
} from "./database/urlShortener"

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

/* URL Shortener */
app.post("/api/shorturl", async (req: Request, res: Response) => {
  const parsedUrl = url.parse(req.body.url)
  const hostName = parsedUrl.hostname
  const href = parsedUrl.href
  let id: number

  if (!hostName) {
    res.json({ error: "Invalid Url" })
  } else {
    dns.lookup(hostName!, async (err, address) => {
      if (!address || err) {
        res.json({ error: "Invalid Url" })
      } else {
        const doesUrlExist = await checkIfUrlExists(href)

        if (!doesUrlExist) {
          await postUrlData(href)
          const data: any = await getUrlData(href)
          if (data) id = data.id
        } else {
          const data: any = await getUrlData(href)
          if (data) id = data.id
        }
        res.json({ original_url: href, short_url: id })
      }
    })
  }
})

app.get("/api/shorturl/:id", async (req: Request, res: Response) => {
  const id = req.params.id

  const dbId = await getUrlIdData(id)

  if (!id) {
    res.json({ error: "Invalid Url" })
  } else {
    if (dbId) {
      res.redirect(dbId.url)
    }
  }
})

/* listener */
app.listen(port, () => console.log(`Node Server listening on port ${port}`))
