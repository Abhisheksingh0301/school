var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var fees=new Schema({
    fee_type:String,
    amount:Number,
    fee_freq:String   //Monthly, Quartely, Yearly, Never
});
module.exports=mongoose.model('fee_master',fees);