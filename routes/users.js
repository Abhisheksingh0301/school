var express = require('express');
var dateFormat = require('dateformat');
var UserModel=require('../schema/studentinfo');
var ClassModel=require('../schema/class_master');
var FeeModel=require('../schema/fee_master');
var TransModel=require('../schema/payment_trans')
var SesnModel=require('../schema/session_master')
var moment = require('moment');
var excel = require('exceljs');
var csv = require('csv-express');
var path=require('path');
const { parse } = require('path');

var cls =ClassModel.find({});
var fees=FeeModel.find({});
var trans=TransModel.find({});
var Sess=SesnModel.find({});
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
      ClassModel.find(function(err,class_masters){
        if(err){
          console.log(err);
        }  
        else {
          res.render('display-table',{student_masters:student_masters,title:"Display student records",
          headertext:"Students records", moment: moment, class_masters:class_masters});
          }
      }).sort({"sl":1,"section":1,"roll":1});
    }
   // res.render('display-table',{student_masters:student_masters,title:"Display student records",
      // headertext:"Students records", moment: moment});
  }).sort({"class":1,"section":1,"roll":1});  
});

//Get single user by ID
router.get('/show/:id', function(req, res) {
  console.log(req.params.id);
  UserModel.findById(req.params.id,function(err,student_masters){
    if(err){
      console.log(err);
    }else{
      res.render('show',{student_masters:student_masters,title:"Student Information", moment:moment});
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
      ttx=student_masters.sesn+"*"+student_masters.name+"*"+student_masters.fname+"*"+student_masters.mname+"*"+
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
            // SesnModel.find(function(err,session_master){
              SesnModel.findOne({status:true},function(err,session_master){
              if(err){
                console.log(err);
              } else {
                    res.render('add-form',{title:"Add new records", updtmsg:"", session_master:session_master,
                    headertext:"Students records entry", class_masters:class_masters, moment:moment});
              }
            })
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
    },
    sesn:req.body.txtsessn
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
      SesnModel.find(function(err,session_master){
        if(err){
          console.log(err);
        } else {
              res.render('add-form',{title:"Add new records", updtmsg:"1 record inserted.", session_master:session_master,
              headertext:"Students records entry", class_masters:class_masters, moment:moment});
        }
      })
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
      sesn:req.body.sesn,
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
    fee_freq:req.body.feefreq,
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
        fee_freq:req.body.txtfeefreq,
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
//SEARCH ROUTES
router.post('/search/', function(req, res, next) {

  var fltrname = req.body.txtname;
  var fltrroll = req.body.txtroll;
  var fltrclass = req.body.class_mst;
  console.log(fltrclass);
  if(fltrname !='' && fltrroll !='' && fltrclass !='' ){

   var flterParameter={ $and:[{ name:fltrname},
  {$and:[{roll:fltrroll},{class:fltrclass}]}
  ]
   }
  }else if(fltrname !='' && fltrroll =='' && fltrclass !=''){
    var flterParameter={ $and:[{ name:fltrname},{class:fltrclass}]
       }
  }else if(fltrname =='' && fltrroll !='' && fltrclass !=''){

    var flterParameter={ $and:[{ roll:fltrroll},{class:fltrclass}]
       }
  }else if(fltrname =='' && fltrroll =='' && fltrclass !=''){

    var flterParameter={class:fltrclass}
  }
  else{
    var flterParameter={}
  }
  // if(fltrname !='' && fltrroll !=''){
  //    var flterParameter={$and:[{roll:fltrroll},{name:fltrname}]}
  //   //var flterParameter={name:fltrname};
  //   } else {
  //     var flterParameter={}
  //   }
  var studentFilter =UserModel.find(flterParameter);
  //console.log(studentFilter.count());
  studentFilter.exec(function(err,student_masters){
      if(err){
        console.log(err);
      } else {
        ClassModel.find(function(err,class_masters){
          if(err){
            console.log(err);
          }  
          else {
            res.render('display-table',{student_masters:student_masters,title:"Display student records",
            headertext:"Students records", moment: moment, class_masters:class_masters});
          }
        }).sort({"class":1,"section":1,"roll":1});
      }
      
  });
});
// PAYMENT TRANSACTION
router.get('/payment/:id/class/:idcls', function(req, res, next) {
  console.log(req.params.id);
  var date_on=Date(Date.now());
  var mnt=parseInt(moment("20210101", "YYYYMMDD").fromNow());
  UserModel.findById(req.params.id,function(err,student_masters){
    if(err){
      console.log(err);
    }else{
      ClassModel.findOne({class:req.params.idcls},function(err,class_masters){
        console.log(class_masters.tution_fee);
        if (err){
          console.log(err);
        } else {
          var due_fee=mnt*parseInt(class_masters.tution_fee);
          //res.render('payment-trans',{class_masters:class_masters, student_masters:student_masters,title:"Payment page"});
          FeeModel.find(function(err,fee_masters){
            if (err){
              console.log(err);
            } else {
               console.log("DATE ",date_on);
              res.render('payment-trans',{class_masters:class_masters, student_masters:student_masters,due_fee:due_fee,
                 fee_masters:fee_masters, Tdate:Date.now, title:"Payment page", moment:moment, dt:date_on});
            }
          }).sort({fee_type:1});
        }
      });
     }
  });
});


//Fee process
router.post('/feeprocess/', function(req, res, next) {
  // console.log(req.body);
  var mode_amt="abc";
  
  //var date_ob=new Date.now();
  // var tot_fee=parseInt(req.body.amount[0])+parseInt(req.body.amount[1])+parseInt(req.body.amount[2])+
  //             parseInt(req.body.amount[3])+parseInt(req.body.tfee);
  const { amount }=req.body;
   if(req.body.pmt_mode=='1') { mode_amt="Cash" }
  else if(req.body.pmt_mode=='2') { mode_amt="Cheque" }
  else if(req.body.pmt_mode=='3') { mode_amt="Card" }
  
  var dataRecords={
    student_id:req.body.id,
    payment_mode:mode_amt,
    payment_date:req.body.txtentry,
    amt_recd:parseInt(amount[0]) + parseInt(amount[1]) + parseInt(amount[2]) +
     parseInt(amount[3]) + parseInt(req.body.tfee)
  }
  console.log(dataRecords);
  var data=TransModel(dataRecords);

  data.save(function(err){
    if (err){
    // res.render('add-form', {message: "User registraion not done"});
  }else
  {
      TransModel.aggregate([
        { $lookup: 
        { 
          from: 'student_masters',
          localField: 'student_id',
          foreignField: '_id',
          as: 'skool',
        }},
        {$unwind:"$skool"}
      ],function(err,proj){          //).pretty(); console.log(posts);
         
            if(err){
              console.log("error");
            } else 
            { 
              UserModel.findById(req.params.id,function(err,student_masters){
                if(err){
                } else {
                  console.log(proj);               
                  res.render('payment-page',{title:"Add new records", updtmsg:"Records added successfully!!",
                  headertext:"Process of payment", payment_trans:proj, moment: moment, 
                  student_masters:student_masters});
                }
              })
              //console.log(JSON.stringify(proj));
              // console.log(proj);               
              // res.render('payment-page',{title:"Add new records", updtmsg:"Records added successfully!!",
              // headertext:"Process of payment", payment_trans:proj, moment: moment});
            }
      });

      
    //   TransModel.find(function(err,payment_trans){
    //   if(err){
    //     console.log("error");
    //   }
    //   else {
    //     res.render('payment-page',{title:"Add new records", updtmsg:"Records added successfully!!",
    //     headertext:"Process of payment", payment_trans:payment_trans, moment: moment});
    //   }
    // }).sort({"student_id":1});
  }
});
});

//SESSION MASTER
router.get('/sessnmaster', function(req, res, next) {
  SesnModel.find(function(err,session_master){
    if(err){
          console.log(err);
        }else{
          res.render('sessnmaster',{title:"Session Master",session_master:session_master, moment:moment});
        }
  }).sort({"sesn":1});
});

router.post('/sessnmaster', function(req, res, next) {
  console.log(req.body);
  const mybodydata={
    
    sesn:req.body.txtsesn,
    start_date:req.body.txtstart,
    end_date:req.body.txtend,
    status:req.body.def
  }
  var data=SesnModel(mybodydata);
  data.save(function(err){
      if (err){
        console.log(err);
      }else
      {
        SesnModel.find(function(err,session_master){
          if(err){
                console.log(err);
              }else{
                res.redirect('../sessnmaster');
              }
        }).sort({"status":1, "sesn":1});
      }
  });
});

//Delete recrods by ID
router.get('/sesndelete/:id', function(req, res) {
  SesnModel.findOneAndDelete({'_id' : req.params.id},function(err,project){
    if (err){
      res.redirect('../sessnmaster');
    } else {
      res.redirect('../sessnmaster');
    }
  });
});

//UPDATE THE STATUS TO TRUE IN SESSN_MASTER
router.get('/sesndefault/:id', function(req, res, next) {
  var dataRecords={
      status:true
  }
  var upd=SesnModel.updateMany({}, {status:false});
  upd.exec(function(err,session_master){
    if(err) {
      console.log("error");
      throw err;
    } else { 
      
      var update=SesnModel.findByIdAndUpdate(req.params.id,dataRecords);
      update.exec(function(err,session_master){
      if(err) throw err;
      Sess.exec(function(err,session_master){
      if(err) throw err;
      res.redirect("../sessnmaster"); 
     });
    });
    }
  })
  });


  //EXPORT FEE DATA
  router.get('/feesmstexport/', function(req, res, next) {
      FeeModel.find(function(err,results){
        if(err){
          console.log(err);
        } else {
          console.log(results);
          var workbook=new excel.Workbook();
          var worksheet = workbook.addWorksheet('feemaster');
          worksheet.columns=[
            { header: 'Id', key: '_id', width: 10 },
            { header: 'fee_type', key: 'fee_type', width: 30 },
            { header: 'fee_freq', key: 'fee_freq', width: 30},
            { header: 'amount', key: 'amount', width: 10}
          ];
          // Add Array Rows
              worksheet.addRows(results);

              // Write to File
              var path1=path.join(__dirname,"../public/images/feemaster.xlsx");
              workbook.xlsx.writeFile(path1)
              .then(function() {
                console.log("file saved!");
                console.log(path1);
                // res.sendFile(path.join(__dirname + '/feemaster.xlsx'));
                //res.download(__dirname +'/images/feemaster.xlsx');
                res.redirect("../feemaster");
                });
           }
      })
  });


  //EXPORT TO CSC
  router.get('/exporttocsv', function(req, res, next) {
    var filename ="feemaster.csv";
    var dataArray;
    FeeModel.find().lean().exec({}, function(err, feesexp) {
        if (err) res.send(err);  
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader("Content-Disposition", 'attachment; filename='+filename);
        res.csv(feesexp, true);
    });
 });


module.exports = router;