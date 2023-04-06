const express = require("express");
const router = express.Router();
const passport = require("passport");


router.get("/login", (req, res) => {
	res.render("login");
});

router.post("/login", passport.authenticate("local", { failureRedirect: "/login" }),  (req, res) => {
    req.session.user = req.user;
    console.log("This is the current user",   req.session.user);
    console.log(req.body);                                     
    if (req.user.role == 'Agricultural Officer') {
          res.redirect("/aOdashboard");
    } else if (req.user.role == 'Farmer One') {
          res.redirect('/fOdashboard');
    } else if (req.user.role == 'Urban Farmer') {
          res.redirect('/uFdashboard');
    } else {
      res.send('Sorry either your session has expired or you are not a registered user.')
    }
    });
  
    
    
//    Logout route
router.post("/logout", (req, res) => {
    if(req.session){
        req.session.destroy(function(err){
            if(err){
                res.status(400).send('Unable to logout,Please check your Internet connection');
            } else{
                return res.redirect('/login');
            }
        })
    }
	
});



module.exports = router;
