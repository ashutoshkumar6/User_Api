const express=require('express')
const User=require('../models/users')
const router=new express.Router()
const jwt=require('jsonwebtoken')
const auth=require('../middleware/auth')
//creating new user
router.post('/users',async (req,res)=>{
    const user=new User(req.body)
    
    try{
        await user.save()
        const token=await user.generateAuthToken()
        console.log(user)
         res.status(201).send({user,token})
    }catch(e){
          res.status(404).send(e)
    }
})

//login 
router.post('/users/login',async (req,res)=>{
    try{
        const user=await User.findByCredentials(req.body.email,req.body.password)
        const token=await user.generateAuthToken()
        res.send({user,token})
    }catch(e){
        res.status(404).send(e)
    }
})

//logging-out
router.post('/users/logout',auth,async (req,res,next)=>{
    try{
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token!==req.token
        })
        await req.user.save()
        res.send()
    }catch(e)
    {
        res.status(505).send()
    }
})

//logging out from all devices
router.post('/users/logout-all',auth,async(req,res,next)=>{
    try{
        req.user.tokens=[]
        await req.user.save()
        res.send()
    }catch(e)
    {
        res.status(505).send()
    }
})

//all fetched-users in database
router.get('/users/me',auth,async (req,res)=>{
   res.send(req.user)
})

//updating the user id
router.patch('/users/me',auth,async (req,res)=>{
    const update_value=Object.keys(req.body)
    const allowedupdate=["name","email","password"]
    const isvalidupdate=update_value.every((update)=>{
        return allowedupdate.includes(update)
    })
    if(!isvalidupdate){
        return res.status(404).send({error:'Invalid update'})
    }
    try{
      // const user=await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
    //    const user=await User.findById(req.params.id)

       update_value.forEach((update)=>{
           req.user[update]=req.body[update]
       })  
       await req.user.save()

       res.status(201).send(req.user)
    }catch(e){
        res.status(404).send({error:'Cant help'})
    }
})


//deleting the user
router.delete('/users/me',auth,async (req,res)=>{
    try{
        // const user=await User.findByIdAndDelete(req.user._id)
        // if(!user){
        //     return res.status(404).send()
        // }
        await req.user.remove()
        removeMail(req.user.email,req.user.name)
        res.send(req.user)
    }catch(e){
        res.status(404).send({error:'not found'})
    }
})

module.exports=router