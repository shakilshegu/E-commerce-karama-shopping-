const mongoose=require("mongoose")

const userschema=mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    number:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    status:{
        type:Boolean,
        default:false,
    },
    is_verified:{
        type:Boolean,
        default:false       
    },
    address:[{
        name:{
            type:String,
            required:true,

        },
        phone:{
            type:String,
            required:true,
        },
        conutry:{
            type:String,
            required:true,
        },
        town:{
            type:String,
            required:true,
        },
        street: {
            type: String,
            required: true,
        },
        district:{
            type:String,
            required:true,
        },
        postcode:{
            type:String,
            required:true,
        },
    
    }],
    wallet:{
        type:Number,
        default:0,
    },
    wallehistory:[{
        peramount:{
            type:Number,

        },
        date:{
            type:String
        }
    }]
})

//user collection and export-------------------
module.exports=mongoose.model("user",userschema)