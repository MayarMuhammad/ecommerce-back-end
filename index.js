import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
//set directory dirname 
const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, './config/.env') })
import express from 'express'
import bootstrap from './src/index.router.js'

const app = express()
// setup port and the baseUrl
const port = process.env.PORT || 5000
bootstrap(app ,express)

app.listen(port, () => {
  console.log(`Server is running on port ..... ${port}`);
});