import express from 'express'

import './config'
import router from './router'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(router)

export default app