var mongoose=require('mongoose');
var Schema=mongoose.Schema;


var studinfo= new  Schema({
    name:String,
    fname:String,
    mname:String,
    mob:String,
    roll:Number,
    class:String,
    section:String,
    dob:Date,
    sex:String,
    concession:Number,
    transport:false,
    address:
    {
        line1:String,
        line2:String,
        district:String,
        pin:String
    },
    sesn:String,
    adv_amt:{type:Number, default:0.0},
    due_amt:{type:Number, default:0.0},
    Entry_Date:{type:Date, default:Date.now}
});

module.exports=mongoose.model('student_master',studinfo);

