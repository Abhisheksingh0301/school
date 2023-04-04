var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var sessn=new Schema({
    sesn:String,
    start_date:Date,
    end_date:Date,
    status:false
});
module.exports=mongoose.model('session_master',sessn);