import "dotenv/config"
import express from "express";
import cors from "cors"
import { router } from "./routes";

const PORT = process.env.PORT_EXPRESS || 3900
const app = express()   
app.set('server.timeout', 600000);
app.use(cors())
app.use(express.json({ strict: false }))

app.use('/api', router)

async function main(){
    app.listen(PORT,() => {
        console.log(`BACK || Lead manager in port: ${PORT}`)
    })

    //createSheet('1QX9_3gLUVP5_I3kaGxnqS9-6Ji4PMYbR8_oEBIbpys8')
}

  
main()



