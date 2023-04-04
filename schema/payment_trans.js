var mongoose=require('mongoose');
var Schema=mongoose.Schema;


var trans= new  Schema({
    student_id:mongoose.Schema.Types.ObjectId,
    amt_recd:Number,
    payment_mode:String,
    payment_date:Date,
    Entry_Date:{type:Date, default:Date.now}
});

module.exports=mongoose.model('transaction',trans);

