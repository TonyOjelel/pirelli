const express = require('express');
const router = express.Router();
const passport = require("passport");
const connectEnsureLogin = require("connect-ensure-login");


// Importing Model
const Registration = require("../model/User");

// FARMER REGISTRATION ROUTES.
router.get('/regAdmin', (req, res) => {
    res.render('adminReg');
});

//Agricultural Officer Registration
router.get('/aoReg', (req, res) => {
    res.render('AOReg');
});

router.post('/aoReg', async (req, res) =>{
    console.log(req.body);
    try {
        const user = new Registration(req.body);
        let uniqueExist = await Registration.findOne({uniqueNumber:req.body.uniqueNumber});
        let ninNumberExist = await Registration.findOne({ ninNumber: req.body.ninNumber });
        if (uniqueExist) {
            return res.status(400).send("Sorry this Unique Number is already taken");
		} else if (ninNumberExist) {
            return res.status(400).send("Sorry this NIN Number is already taken");
		} else {
			await Registration.register(user, req.body.password, (error) => {
				if (error) {
					throw error;
				}
				res.redirect("/aoDashboard");
			});
		} 
        
    } catch (error) {
        res.status(400).send('Sorry, it seems there is trouble accessing this page');
        console.log(error);
    }
});

//Farmer One Registration
router.get('/foReg', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
    res.render('FO-Register');
});

router.post('/foReg',  async (req, res) =>{
    console.log(req.body);
    try {
        const user = new Registration(req.body);
        let uniqueExist = await Registration.findOne({uniqueNumber:req.body.uniqueNumber});
        let ninNumberExist = await Registration.findOne({ ninNumber: req.body.ninNumber });
        if (uniqueExist) {
            return res.status(400).send("Sorry this Unique Number is already taken");
		} else if (ninNumberExist) {
            return res.status(400).send("Sorry this NIN Number is already taken");
		} else {
			await Registration.register(user, req.body.password, (error) => {
				if (error) {
					throw error;
				}
				res.redirect("/FarmerOneList");
			});
		} 
        
    } catch (error) {
        res.status(400).send('Sorry, it seems there is trouble accessing this page');
        console.log(error);
    }
});


//Urban farmer Registration

router.get("/ufReg", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
    res.render('UfarmerReg');
});

router.post('/ufReg', connectEnsureLogin.ensureLoggedIn(), async (req, res) =>{
    console.log(req.body);
    try {
        const user = new Registration(req.body);
        let uniqueExist = await Registration.findOne({uniqueNumber:req.body.uniqueNumber});
        let ninNumberExist = await Registration.findOne({ ninNumber: req.body.ninNumber });
        if (uniqueExist) {
            return res.status(400).send("Sorry this Unique Number is already taken");
		} else if (ninNumberExist) {
            return res.status(400).send("Sorry this NIN Number is already taken");
		} else {
			await Registration.register(user, req.body.password, (error) => {
				if (error) {
					throw error;
				}
				res.redirect("/ufList");
			});
		} 
        
    } catch (error) {
        res.status(400).send('Sorry, it seems there is trouble accessing this page');
        console.log(error);
    }
});


//Farmer One List

router.get("/FarmerOneList", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	req.session.user = req.user
    try {
        let fOnez = await Registration.find({ role: "Farmer One" });
        res.render("FOList", {farmerones:fOnez, currentUser:req.session.user});
    } catch (error) {
        res.status(400).send("Unable to find Farmer Ones in the Database");
		console.log(error);
    }
	
});

//Retired Farmer One List

router.get("/retiredList", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	req.session.user = req.user
    try {
        let retiredfos = await Registration.find({ role: "Farmer One" });
        res.render("retiredList", {retireds: retiredfos});
    } catch (error) {
        res.status(400).send("Unable to find Farmer Ones in the Database");
		console.log(error);
    }
	
});

// Urban Farmer List
router.get("/ufList", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	req.session.user = req.user
	try {
		let items = await Registration.find({ role: "Urban Farmer" });
		console.log(items);
		res.render("UFarmerList", { urbanfarmers: items, currentUser:req.session.user });
	} catch (error) {
		res.status(400).send("unable to find urban farmer in the data base");
		console.log(error);
	}
});

//Agricultural Officer Urban Farmers List
router.get("/aOufList", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	req.session.user = req.user
	try {
		let AoUfList = await Registration.find({ role: "Urban Farmer" });
		console.log(AoUfList);
		res.render("aOUfList", { AoUfs: AoUfList, currentUser:req.session.user });
	} catch (error) {
		res.status(400).send("unable to find urban farmer in the data base");
		console.log(error);
	}
});

// Updating urban farmers
router.get("/urbanfarmer/update/:id", async (req, res) => {
	try {
		const urbanFarmerUpdate = await Registration.findOne({ _id: req.params.id });
		res.render("urbanFarmerUpdate", {urbanfarmers: urbanFarmerUpdate });
	} catch (error) {
		res.status(400).send("Unable to update produce");
	}
});

router.post("/urbanfarmer/update", async (req, res) => {
	try {
		await Registration.findOneAndUpdate({ _id: req.query.id }, req.body);
		res.redirect("/uflist");
	} catch (error) {
		res.status(400).send("Unable to update Farmer one");
	}
});
// Updating  farmer one
router.get("/farmerone/update/:id", async (req, res) => {
	try {
		const farmerOneUpdate = await Registration.findOne({ _id: req.params.id });
		res.render("farmerOneUpdate", {farmerones: farmerOneUpdate });
	} catch (error) {
		res.status(400).send("Unable to update farmerone");
	}
});

router.post("/farmerone/update", async (req, res) => {
	try {
		await Registration.findOneAndUpdate({ _id: req.query.id }, req.body);
		res.redirect("/FarmerOneList");
	} catch (error) {
		res.status(400).send("Unable to update Farmer");
	}
});


// Export this file in the server file, for it to be read(executed)
module.exports = router; 