import mongoose, { models, Schema } from "mongoose";
import { stringifyFetchCacheStore } from "next/dist/server/resume-data-cache/cache-store";

const AdminSchema = new Schema({
    name:{
        type:String,
        required: true,
    },
    email:{
        type:String,
        required: true,
    },
    password:{
        type: String,
        required:true,
    }
},
{timestamps:true});

const Admins = models.Admins || mongoose.model("Admins", AdminSchema)
export default Admins;