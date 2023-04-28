const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const productschema = new mongoose.Schema({
    productname:{
        type:String,
        required:true
    },
    brand:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    category:{
        type:ObjectId,
        ref:"Category",
        required:true
    },
    image:{
        type:Array,
       
    },
    deleted:{
        type:Boolean,
        default:true
    },

});

module.exports = mongoose.model('products',productschema)