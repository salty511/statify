import express from "express"
import serverless from "serverless-http"
import querystring from "querystring"
import cors from "cors"
import axios from "axios"
import dotenv from "dotenv"
dotenv.config()

const app = express()
const router = express.Router()

const redirect_uri = process.env.REDIRECT_URI || "http://localhost:9000/.netlify/functions/api/callback"

router.use(cors())

router.get("/", (req, res) => {
    console.log("hi")
	res.send("Hi from root")
})

router.get("/scrape", async (req, res) => {
    const url = req.headers.url
    console.log(url)
    const response = await axios.get(url)
    res.send(response.data)
})

router.get("/login", (req, res) => {
    let queryParams = querystring.stringify({
        client_id: process.env.CLIENT_ID,
        response_type: "code",
        redirect_uri: redirect_uri,
        scope: "user-top-read user-modify-playback-state"
    })
    res.redirect("https://accounts.spotify.com/authorize?" + queryParams)
})

router.get("/callback", async (req, res) => {
    try {
        let code = req.query.code || null
        const tokenResponse = await axios.post("https://accounts.spotify.com/api/token", 
            querystring.stringify({
                grant_type: "authorization_code",
                code: code,
                redirect_uri: redirect_uri
            }), 
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": "Basic " + (Buffer.from(
                        process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET
                    ).toString("base64"))
                }
            }
        )
        
        let accessToken = tokenResponse.data.access_token
        let uri = process.env.FRONTEND_URI || "http://localhost:3000"
        console.log("Authorization complete!")
        res.redirect(uri + "?" + "access_token=" + accessToken)
    } catch (error) {
        console.error("Error getting access token:", error)
        res.status(500).send("Error during authorization")
    }
})

app.use(cors())
app.use(`/.netlify/functions/api`, router)

app.listen(9000, () => {
    console.log("Server is running on port 9000")
})

export default app;
export const handler = serverless(app);
