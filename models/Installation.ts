
import  mongoose, {Schema} from 'mongoose';
const installationSchema=new Schema({
  installationId:{
    type:Number,
    required:true,
    unique:true
  } ,
  account:{
    type:String,
  } ,
  targetType:{
    type:String
  },
  repositories:{
    type:Array,
    default:[]
  },
  
},{timestamps:true});

export default  mongoose.models.Installation || mongoose.model("Installation",installationSchema)