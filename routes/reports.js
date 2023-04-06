const express = require('express');
const router = express.Router();
const connectEnsureLogin = require("connect-ensure-login");
const UrbanFarmerProdUpload = require('../model/UrbanFarmerUpload');
const Registration = require("../model/User");


// Agricultural Officer Reports
router.get("/report", connectEnsureLogin.ensureLoggedIn(), async(req, res) => {
    req.session.user = req.user;
    if(req.user.role == 'Agricultural Officer'){
        try {
            let totalPoultry = await UrbanFarmerProdUpload.aggregate([
            { $match: { prodCategory: "Poultry" } },
            { $group: { _id: "$all", 
            totalQuantity: { $sum: "$prodQuantity" },
            totalCost: { $sum: { $multiply: [ "$price", "$prodQuantity" ] } },             
            }}
            ])

            let totalHort = await UrbanFarmerProdUpload.aggregate([
                { $match: { prodCategory: "Horticulture" } },
                { $group: { _id: "$all", 
                totalQuantity: { $sum: "$prodQuantity" },
                totalCost: { $sum: { $multiply: [ "$price", "$prodQuantity" ] } },            
                }}
            ])
			let totalDairy = await UrbanFarmerProdUpload.aggregate([
                { $match: { prodCategory: "Dairy" } },
                { $group: { _id: "$all", 
                totalQuantity: { $sum: "$prodQuantity" },
                totalCost: { $sum: { $multiply: [ "$price", "$prodQuantity" ] } },            
                }}
            ])
            
            console.log("Poultry collections", totalPoultry)
            console.log("Hort collections", totalHort)
            console.log("Dairy collections", totalDairy)

            res.render("aoReport", { 
            title: 'Reports', 
            totalP:totalPoultry[0],
            totalH:totalHort[0],
            totalD:totalDairy[0],
            });
        } catch (error) {
            res.status(400).send("unable to find items in the database");
        }
        
    }else {
        res.redirect("/aoOnly")
    }
});

//Farmer One Report
router.get("/foReport", connectEnsureLogin.ensureLoggedIn(), async(req, res) => {
    req.session.user = req.user;
    if(req.user.role == 'Farmer One'){
        try {
            
            let totalPoultry = await UrbanFarmerProdUpload.aggregate([
                { $match: { "$and":[{wardName:req.user.wardName}, {prodCategory: "Poultry"}]  } },
                { $group: { _id: "$all", 
                totalQuantity: { $sum: "$prodQuantity" },
                totalCost: { $sum: { $multiply: [ "$price", "$prodQuantity" ] } },            
                }}
            ])

            let totalHort = await UrbanFarmerProdUpload.aggregate([
                { $match: { "$and":[{wardName:req.user.wardName}, {prodCategory: "Horticulture"}]  } },
                { $group: { _id: "$all", 
                totalQuantity: { $sum: "$prodQuantity" },
                totalCost: { $sum: { $multiply: [ "$price", "$prodQuantity" ] } },            
                }}
            ])
			let totalDairy = await UrbanFarmerProdUpload.aggregate([
                { $match: { "$and":[{wardName:req.user.wardName}, {prodCategory: "Dairy"}]  } },               
                {$group: { _id: "$all", 
                totalQuantity: { $sum: "$prodQuantity" },
                totalCost: { $sum: { $multiply: [ "$price", "$prodQuantity" ] } },            
                }}
            ])
            
            console.log("Poultry collections", totalPoultry)
            console.log("Hort collections", totalHort)
            console.log("Dairy collections", totalDairy)

            res.render("foReport", { 
            title: 'Reports', 
            currentUser:req.session.user,
            totalP:totalPoultry[0],
            totalH:totalHort[0],
            totalD:totalDairy[0],
            });
        } catch (error) {
            res.status(400).send("unable to find items in the database");
        }
        
    }else {
        res.redirect("/foOnly")
    }
});

//Urban farmer Report
router.get("/ufReport", connectEnsureLogin.ensureLoggedIn(), async(req, res) => {
    req.session.user = req.user;
    if(req.user.role == 'Urban Farmer'){
        try {
            
            let totalPoultry = await UrbanFarmerProdUpload.aggregate([
                { $match: { "$and":[{wardName:req.user.wardName}, {prodCategory: "Poultry"}]  } },
                { $group: { _id: "$all", 
                totalQuantity: { $sum: "$prodQuantity" },
                totalCost: { $sum: { $multiply: [ "$price", "$prodQuantity" ] } },            
                }}
            ])

            let totalHort = await UrbanFarmerProdUpload.aggregate([
                { $match: { "$and":[{wardName:req.user.wardName}, {prodCategory: "Horticulture"}]  } },
                { $group: { _id: "$all", 
                totalQuantity: { $sum: "$prodQuantity" },
                totalCost: { $sum: { $multiply: [ "$price", "$prodQuantity" ] } },            
                }}
            ])
			let totalDairy = await UrbanFarmerProdUpload.aggregate([
                { $match: { "$and":[{wardName:req.user.wardName}, {prodCategory: "Dairy"}]  } },               
                {$group: { _id: "$all", 
                totalQuantity: { $sum: "$prodQuantity" },
                totalCost: { $sum: { $multiply: [ "$price", "$prodQuantity" ] } },            
                }}
            ])
            
            console.log("Poultry collections", totalPoultry)
            console.log("Hort collections", totalHort)
            console.log("Dairy collections", totalDairy)

            res.render("ufReport", { 
            currentUser:req.session.user,
            totalP:totalPoultry[0],
            totalH:totalHort[0],
            totalD:totalDairy[0],
            });
        } catch (error) {
            res.status(400).send("unable to find items in the database");
        }
        
    }else {
        res.redirect("/ufOnly")
    }
});


module.exports = router;