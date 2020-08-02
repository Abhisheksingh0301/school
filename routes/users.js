var express = require('express');
var dateFormat = require('dateformat');
var UserModel=require('../schema/studentinfo');
var ClassModel=require('../schema/class_master');

//var { UserModel } = require("../schema/user");
var router = express.Router();

/* GET users listing. */
//To display home page
router.get('/', function(req, res, next) {
  //res.send('respond with a resource');
  res.render('index');
});


//To display all records

router.get('/display', function(req, res, next) {
  UserModel.find(function(err,student_masters){
    if(err){
      console.log(err);
    }else{
      res.render('display-table',{student_masters:student_masters,title:"Display student records",headertext:"Students records"});
    }
  });
});

//Get single user by ID
router.get('/show/:id', function(req, res) {
  console.log(req.params.id);
  UserModel.findById(req.params.id,function(err,student_masters){
    if(err){
      console.log(err);
    }else{
      res.render('show',{student_masters:student_masters,title:"Student Information"});
    }
  });
  });


  //Get QRCode by ID
router.get('/qrcode/:id', function(req, res) {
  console.log(req.params.id);  
  var ttx;
  UserModel.findById(req.params.id,function(err,student_masters){
    if(err){
      console.log(err);
    }else{
      ttx=student_masters.name+"*"+student_masters.fname+"*"+student_masters.mname+"*"+
      student_masters.class+"*Sec-"+student_masters.section+"*Roll-"+student_masters.roll+"*"+
      student_masters.dob+"*"+student_masters.mob+"*"+"Sex-"+student_masters.sex+"*"+
      "Concession(%)-"+student_masters.concession+"*Transport-"+student_masters.transport+"*"+
      student_masters.address.line1+student_masters.address.line2+student_masters.address.district+
      student_masters.address.pin;
      res.render('qrcode',{student_masters:student_masters,title:"Student Information",ttx:ttx});
    }
  });
  });

//To add new records
router.get('/add', function(req, res, next) {
  
  var CLSmodel;
  ClassModel.find(function(err,class_masters){
    if(err){
      console.log(err);
    }  
    else {
      res.render('add-form',{title:"Add new records",
      headertext:"Students records entry", class_masters:class_masters});
    }
  }).sort({"sl":1});
  //res.render('add-form',{title:"Add new records",headertext:"Students records entry"});
});

router.post('/add', function(req, res, next) {
  // var usersx;
  // if(req.body.usex=='male'){
  //   usersx='Male';
  // } else {
  //   usersx='Female';
  // }
  console.log(req.body);
//dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT");
var dobx=dateFormat(req.body.dob,"dd-mmm-yy");
  //Array of data
  const mybodydata={
    
    name:req.body.name,
    fname:req.body.fname,
    mname:req.body.mname,
    mob:req.body.mob,
    roll:req.body.roll,
    class:req.body.class_mst,
    section:req.body.section,
    concession:req.body.concession,
    //dob:req.body.dob,
    dob:dobx,
    sex:req.body.usex,
    transport:req.body.transport,
    address:{
      line1:req.body.line1,
      line2:req.body.line2,
      district:req.body.district,
      pin:req.body.pin
    }
  }
  var data=UserModel(mybodydata);

  data.save(function(err){
    if (err){
    // res.render('add-form', {message: "User registraion not done"});
  }else
  {
    res.render('index', {message: "User registraion successful",title:"Add new records"});
  }
});
});

//Get single user by ID for editing
router.get('/edit/:id', function(req, res) {
  console.log(req.params.id);
  UserModel.findById(req.params.id,function(err,user){
    if(err){
      console.log(err);
    }else{
      res.render('edit',{users:user, message:"Edit records",title:"Edit records"});
    }
  });
  });

  //Update records using POST method
  router.post('/edit/:id',function(req,res){
   console.log("My Id is " + req.params.id);
   if(req.body.usex=='male'){
    usersx='Male';
  } else {
    usersx='Female';
  }
    const mybodydata={
      user_name:req.body.user_name,
      user_email:req.body.user_email,
      user_mobile:req.body.user_mobile,
      user_sex:usersx
    }
    
    UserModel.findByIdAndUpdate(req.params.id,mybodydata,function(err){
      if(err){
        res.redirect('edit/'+req.params.id);
      } else {
        res.redirect('../display');
      }
    });
  });

//Delete recrods by ID
router.get('/delete/:id', function(req, res) {
  UserModel.findOneAndDelete({'_id' : req.params.id},function(err,project){
    if (err){
      res.redirect('../display');
    } else {
      res.redirect('../display');
    }
  });
});

router.get('/about', function(req, res) {

      res.render('about',{title:"This is about page"});
});


module.exports = router;

