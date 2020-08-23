var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var fees=new Schema({
    fee_type:String,
    amount:Number
});
module.exports=mongoose.model('fee_master',fees);