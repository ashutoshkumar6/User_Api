const mongoose=require('mongoose')



mongoose.connect(process.env.url,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false,
    useUnifiedTopology: true
})