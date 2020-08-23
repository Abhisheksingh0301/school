var express = require('express');
var dateFormat = require('dateformat');
var UserModel=require('../schema/studentinfo');
var ClassModel=require('../schema/class_master');
var FeeModel=require('../schema/fee_master');
var moment = require('moment');

var cls =ClassModel.find({});
var fees=FeeModel.find({});
//var { UserModel } = require("../schema/user");
var router = express.Router();

/* GET users listing. */
//To display home page
router.get('/', function(req, res, next) {
  //res.send('respond with a resource');
  res.render('index',{title: 'School Management System'});
});


//To display all records

router.get('/display', function(req, res, next) {
  UserModel.find(function(err,student_masters){
    var dobx=dateFormat(req.body.dob,"dd-mmm-yy");
    if(err){
      console.log(err);
    }else{
      res.render('display-table',{student_masters:student_masters,title:"Display student records",
      headertext:"Students records", moment: moment});
    }
  }).sort({"class":1,"section":1,"roll":1});
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
      res.render('add-form',{title:"Add new records", updtmsg:"",
      headertext:"Students records entry", class_masters:class_masters});
    }
  }).sort({"sl":1});
  //res.render('add-form',{title:"Add new records",headertext:"Students records entry"});
});

router.post('/add', function(req, res, next) {
  console.log(req.body);
//dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT");
//var dobx=dateFormat(req.body.dob,"dd-mmm-yy");
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
    dob:req.body.dob,
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
   // res.render('add-form',{title:"Add new records", updtmsg:"Records added successfully!!",
   //    headertext:"Students records entry", class_masters:class_masters});
      ClassModel.find(function(err,class_masters){
    if(err){
      console.log("error");
    }
    else {
      res.render('add-form',{title:"Add new records", updtmsg:"Records added successfully!!",
      headertext:"Students records entry", class_masters:class_masters});
    }
  }).sort({"sl":1});
  }
});
});

//Get single user by ID for editing
//Update records of Class master
router.get('/edit-student/:id', function(req, res, next) {
  var id=req.params.id;
  var edit= UserModel.findById(id);
  edit.exec(function(err,data){
  if(err) throw err;
  //res.render('edit-student', { title: 'Update student\'s records',headertext:"Update student\'s records", records:data });
  ClassModel.find(function(err,class_masters){
    if(err){
      console.log("error");
    }
    else {
      res.render('edit-student',{title: 'Update student\'s records', updtmsg:"",
      headertext:'Update student\'s records', class_masters:class_masters, records:data, moment: moment});
    }
  }).sort({"sl":1});    
});
    
  });

  //Update records using POST method
  router.post('/updtstudent/', function(req, res, next) {
    console.log(req.body);
    var dataRecords={
      name:req.body.name,
      fname:req.body.fname,
      mname:req.body.mname,
      mob:req.body.mob,
      roll:req.body.roll,
      class:req.body.class_mst,
      section:req.body.section,
      concession:req.body.concession,
      dob:req.body.dob,
      sex:req.body.usex,
      transport:req.body.transport,
      address:{
        line1:req.body.line1,
        line2:req.body.line2,
        district:req.body.district,
        pin:req.body.pin
      }
    }
    console.log(dataRecords);
    var update=UserModel.findByIdAndUpdate(req.body.id,dataRecords);
    update.exec(function(err,data){
      if(err) throw err;
      cls.exec(function(err,data){
        if(err) throw err;
        res.redirect("/display"); 
       });
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


router.get('/classmaster', function(req, res, next) {
  ClassModel.find(function(err,class_masters){
    if(err){
          console.log(err);
        }else{
          res.render('classmaster',{title:"Class Master",class_masters:class_masters,sl:""});
        }
  }).sort({"sl":1});
});

router.post('/classmaster', function(req, res, next) {
  console.log(req.body);
  const mybodydata={
    
    sl:req.body.txtsl,
    class:req.body.txtclass,
    tution_fee:req.body.txtfee
  }
  var data=ClassModel(mybodydata);
  data.save(function(err){
      if (err){
        //res.render('classmaster',{title:"Class Master",class_masters:class_masters});
        console.log(err);
      }else
      {
        ClassModel.find(function(err,class_masters){
          if(err){
                console.log(err);
              }else{
                // res.render('classmaster',{title:"Class Master",class_masters:class_masters});
                res.redirect('../classmaster');
              }
        }).sort({"sl":1});
      }
  });
});
//Delete recrods by ID of Class Madter
router.get('/classmstdelete/:id', function(req, res) {
  ClassModel.findOneAndDelete({'_id' : req.params.id},function(err,project){
    if (err){
      res.redirect('../classmaster')
    } else {
      res.redirect('../classmaster');
    }
  });
});

//Update records of Class master
router.get('/updateclassmaster/:id', function(req, res, next) {
var id=req.params.id;
var edit= ClassModel.findById(id);
edit.exec(function(err,data){
if(err) throw err;
res.render('updateclassmaster', { title: 'Edit Class Information', records:data });
  });
  
});

router.post('/updtclassmaster/', function(req, res, next) {
  console.log(req.body);
  var dataRecords={
      sl:req.body.txtsl,
      class:req.body.txtclass,
      tution_fee:req.body.txtfee
  }
  console.log(dataRecords);
  var update=ClassModel.findByIdAndUpdate(req.body.id,dataRecords);
  update.exec(function(err,data){
    if(err) throw err;
    cls.exec(function(err,data){
      if(err) throw err;
      res.redirect("/classmaster"); 
     });
    });
  });

//FEE MASTER
router.get('/feemaster', function(req, res, next) {
  FeeModel.find(function(err,fee_masters){
    if(err){
          console.log(err);
        }else{
          res.render('feemaster',{title:"Fees Master",fee_masters:fee_masters});
        }
  }).sort({"fee_type":1});
});

router.post('/feemaster', function(req, res, next) {
  console.log(req.body);
  const mybodydata={
    fee_type:req.body.txtfeetype,
    amount:req.body.txtamount
  }
  var data=FeeModel(mybodydata);
  data.save(function(err){
      if (err){
        console.log(err);
      }else
      {
        FeeModel.find(function(err,fee_masters){
          if(err){
                console.log(err);
              }else{
                // this line is disabled to prevent duplicate insert on page refresh. 18-08-2020
                // res.render('feemaster',{title:"Fees Master",fee_masters:fee_masters});
                res.redirect('../feemaster');
              }
        }).sort({"fee_type":1});
      }
  });
});

router.get('/feemstdel/:id', function(req, res) {
  FeeModel.findOneAndDelete({'_id' : req.params.id},function(err,project){
    if (err){
      res.redirect('../feemaster');
    } else {
      res.redirect('../feemaster');
    }
  });
});


//Update records of Fee master
router.get('/feemstedit/:id', function(req, res, next) {
  var id=req.params.id;
  var edit= FeeModel.findById(id);
  edit.exec(function(err,data){
  if(err) throw err;
  res.render('feemstedit', { title: 'Edit Fee Data', records:data });
    });
    
  });

  router.post('/updtfeemaster/', function(req, res, next) {
    console.log(req.body);
    var dataRecords={
        fee_type:req.body.txtfeetype,
        amount:req.body.txtamount
    }
    console.log(dataRecords);
    var update=FeeModel.findByIdAndUpdate(req.body.id,dataRecords);
    update.exec(function(err,data){
      if(err) throw err;
      fees.exec(function(err,data){
        if(err) throw err;
        res.redirect("/feemaster"); 
       });
      });
    });
module.exports = router;

