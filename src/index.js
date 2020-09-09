const express=require('express')

require('./db/mongoose')
const userRouter=require('./routers/user')
const bcrypt=require('bcryptjs')//for hashing the pwd(library)

const app=express()
const port= process.env.PORT || 3000


app.use(express.json())
app.use(userRouter)


app.listen(port,()=>{
    console.log('Server is up on the port'+port)
})


