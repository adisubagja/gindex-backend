const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const transport = require('../../plugins/mailtransporter');

//Model Imports
const User = require("../../models/user");
const SpamUser = require("../../models/spamUser");

var allowedOrigin = process.env.NODE_ENV == "production" ? process.env.FRONTENDURL : "http://localhost:8080";
var allowedHost = process.env.NODE_ENV == "production" ? process.env.SITE : "http://localhost:3000";

router.post('/user', function(req, res){
  if(req.headers.origin == allowedOrigin || req.headers.origin == allowedHost){
    User.findOne({ email: req.body.adminuseremail }, function(error, user){
      if(user){
        if(user.admin){
          User.findOne({ email: req.body.email }, function(error, resultUser){
            if(resultUser){
              if(resultUser.superadmin){
                res.status(200).send({
                  auth: false,
                  deleted: false,
                  message: "You are Not Authorized to Delete this User"
                })
              } else {
                if(resultUser.admin){
                  res.status(200).send({
                    auth: false,
                    deleted: false,
                    message: "You are Not Authorized to Delete this User"
                  })
                } else {
                  SpamUser.findOne({ email: req.body.email }, function(error, spamUser){
                    if(spamUser){
                      SpamUser.deleteOne({ email: req.body.email }, function(error){
                        if(error){
                          res.status(200).send({
                            auth: true,
                            deleted: false,
                            message: "Error Occured while Removing the User. Please Try Again Later."
                          })
                        } else {
                          const message = {
    												 from: `"${process.env.FRONTENDSITENAME} - Support"<${process.env.EMAILID}>`, // Sender address
    												 to: req.body.email,
    												 replyTo: process.env.REPLYTOMAIL,
    												 subject: 'You have been Allowed to Login', // Subject line
    												 html: `<p>You Have been Removed from Our Spam List. Now You can Login to Our Website</p><p>Any Issues, Reply to this Mail, Our Admins will Contact You</p>` // Plain text body
    											};
    											transport.sendMail(message, function(err, info){
    												if(err){
    													console.log(err);
    												} else {
    													console.log(info);
    												}
    											})
                          res.status(200).send({
                            auth: true,
                            deleted: true,
                            message: "Successfully Removed the User from Spam List. Now he Can Login."
                          })
                        }
                      })
                    } else {
                      res.status(200).send({
                        auth: false,
                        deleted: false,
                        message: "He is Not in Spam List"
                      })
                    }
                  })
                }
              }
            } else {
              res.status(200).send({
                auth: false,
                deleted: false,
                message: "User Not Found"
              })
            }
          })
        } else {
          res.status(200).send({
            auth: false,
            deleted: false,
            message: "You are Unauthorized"
          })
        }
      } else {
        res.status(200).send({
          auth: false,
          deleted: false,
          message: "BAD REQUEST"
        })
      }
    })
  } else {
    res.status(200).send({
      auth: false,
      message: "Unauthorized"
    });
  }
})

router.post('/admin', function(req, res){
  if(req.headers.origin == allowedOrigin || req.headers.origin == allowedHost){
    User.findOne({ email: req.body.adminuseremail }, function(error, user){
      if(user){
        if(user.admin){
          if(user.superadmin){
            User.findOne({ email: req.body.email }, function(error, resultUser){
              if(resultUser){
                if(resultUser.superadmin){
                  res.status(200).send({
                    auth: false,
                    deleted: false,
                    message: "You are Not Authorized to Delete this User"
                  })
                } else {
                  SpamUser.findOne({ email: req.body.email }, function(error, spamUser){
                    if(spamUser){
                      SpamUser.deleteOne({ email: req.body.email }, function(error){
                        if(error){
                          res.status(200).send({
                            auth: true,
                            deleted: false,
                            message: "Error Occured while Removing the User. Please Try Again Later."
                          })
                        } else {
                          const message = {
    												 from: `"${process.env.FRONTENDSITENAME} - Support"<${process.env.EMAILID}>`, // Sender address
    												 to: req.body.email,
    												 replyTo: process.env.REPLYTOMAIL,
    												 subject: 'You have been Allowed to Login', // Subject line
    												 html: `<p>You Have been Removed from Our Spam List. Now You can Login to Our Website</p><p>Any Issues, Reply to this Mail, Our Admins will Contact You</p>` // Plain text body
    											};
    											transport.sendMail(message, function(err, info){
    												if(err){
    													console.log(err);
    												} else {
    													console.log(info);
    												}
    											})
                          res.status(200).send({
                            auth: true,
                            deleted: true,
                            message: "Successfully Removed the User from Spam List. Now he Can Login."
                          })
                        }
                      })
                    } else {
                      res.status(200).send({
                        auth: false,
                        deleted: false,
                        message: "He is Not in Spam List"
                      })
                    }
                  })
                }
              } else {
                res.status(200).send({
                  auth: false,
                  deleted: false,
                  message: "User Not Found"
                })
              }
            })
          } else {
            res.status(200).send({
              auth: false,
              deleted: false,
              message: "You are Unauthorized"
            })
          }
        } else {
          res.status(200).send({
            auth: false,
            deleted: false,
            message: "You are Unauthorized"
          })
        }
      } else {
        res.status(200).send({
          auth: false,
          deleted: false,
          message: "BAD REQUEST"
        })
      }
    })
  } else {
    res.status(200).send({
      auth: false,
      message: "Unauthorized"
    });
  }
})

router.post('/superadmin', function(req, res){
  if(req.headers.origin == allowedOrigin || req.headers.origin == allowedHost){
    User.findOne({ email: req.body.adminuseremail }, function(error, user){
      if(user){
        if(user.admin){
          if(user.superadmin){
            User.findOne({ email: req.body.email }, function(error, resultUser){
              if(resultUser){
                SpamUser.findOne({ email: req.body.email }, function(error, spamUser){
                  if(spamUser){
                    SpamUser.deleteOne({ email: req.body.email }, function(error){
                      if(error){
                        res.status(200).send({
                          auth: true,
                          deleted: false,
                          message: "Error Occured while Removing the User. Please Try Again Later."
                        })
                      } else {
                        const message = {
                           from: `"${process.env.FRONTENDSITENAME} - Support"<${process.env.EMAILID}>`, // Sender address
                           to: req.body.email,
                           replyTo: process.env.REPLYTOMAIL,
                           subject: 'You have been Allowed to Login', // Subject line
                           html: `<p>You Have been Removed from Our Spam List. Now You can Login to Our Website</p><p>Any Issues, Reply to this Mail, Our Admins will Contact You</p>` // Plain text body
                        };
                        transport.sendMail(message, function(err, info){
                          if(err){
                            console.log(err);
                          } else {
                            console.log(info);
                          }
                        })
                        res.status(200).send({
                          auth: true,
                          deleted: true,
                          message: "Successfully Removed the User from Spam List. Now he Can Login."
                        })
                      }
                    })
                  } else {
                    res.status(200).send({
                      auth: false,
                      deleted: false,
                      message: "He is Not in Spam List"
                    })
                  }
                })
              } else {
                res.status(200).send({
                  auth: false,
                  deleted: false,
                  message: "User Not Found"
                })
              }
            })
          } else {
            res.status(200).send({
              auth: false,
              deleted: false,
              message: "You are Unauthorized"
            })
          }
        } else {
          res.status(200).send({
            auth: false,
            deleted: false,
            message: "You are Unauthorized"
          })
        }
      } else {
        res.status(200).send({
          auth: false,
          deleted: false,
          message: "BAD REQUEST"
        })
      }
    })
  } else {
    res.status(200).send({
      auth: false,
      message: "Unauthorized"
    });
  }
})

module.exports = router;
