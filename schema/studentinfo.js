var mongoose=require('mongoose');
var Schema=mongoose.Schema;


var studinfo= new  Schema({
    name:String,
    fname:String,
    mname:String,
    mob:String,
    roll:String,
    class:String,
    section:String,
    dob:String,
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
    Entry_Date:{type:Date, default:Date.now}
});

module.exports=mongoose.model('student_master',studinfo);

