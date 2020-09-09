const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is not valid')
            }
        }
    },
    password:{
         type:String,
         required:true,
         trim:true,
         validate(value){
             if(value.length<7){
                 throw new Error('Password length must be greater than 6')
             }
             else if(value.includes('password')){
                 throw new Error('Password must"nt contain password as a value')
             }
         }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
},{
    timestamps:true
})


userSchema.methods.toJSON=function (){
    const user=this
    const userObject = user.toObject()
    return userObject
}


userSchema.methods.generateAuthToken=async function(){
    const user=this
    const token=jwt.sign({_id:user._id.toString()},process.env.jwt_token)

    user.tokens=user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.statics.findByCredentials =async (email,password)=>{
    const user=await User.findOne({email})
    if(!user){ 
        throw new Error('Unable to login')
    }
    const isMatch=await bcrypt.compare(password,user.password)
    if(!isMatch){
        throw new Error('Unable to login')
    }
    return user
} 

//hash the plain text pwd 
userSchema.pre('save',async function(next){
    const user=this
    if(user.isModified('password')){
        user.password=await bcrypt.hash(user.password,8)
    }
    next()
})

//removing user taks when we delete user profile
// userSchema.pre('remove',async function(next){
//     const user=this
//     await tasks.deleteMany({owner:user._id})
//     next()
// })

const User= mongoose.model('users',userSchema)


module.exports=User