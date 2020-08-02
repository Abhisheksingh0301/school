var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var myclass=new Schema({
    sl:Number,
    class:String,
    tution_fee:Number
});
module.exports=mongoose.model('class_master',myclass);

