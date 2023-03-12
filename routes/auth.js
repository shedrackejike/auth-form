const  router = require('express').Router();

const  bcrypt = require('bcryptjs');
const { json } = require('express');
const Joi = require('joi');
const { schema } = require('../model/user');
const userData = require('../model/user');
const jwt = require('jsonwebtoken');
// const {U} = require("../model/user")
const {validateRegister, validateLogin } = require('../Validation/validation');
const user = require('../model/user');
// const catchAsync = require('catchAsync')





router.post("/register", async(req,res)=>{
    console.log(validateRegister);

     
    try {
        

    let data = {
        password : req.body.password,
        email: req.body.email,
        name: req.body.name
    }
    console.log("1");

    const {error} = validateRegister(data);
    if (error) return res.status(400).send(error.details[0].message)
      
    console.log("2");

     if (error) {
        
      return res.json({status:400, message: error.message});
     }

     console.log("3");

   

     let User = await userData.findOne({email:data.email});

     if (User) {
       return  res.json({status:401, message: "user already exist"});
     }
     console.log("4");

     //Hash Password
     const salt = await bcrypt.genSalt(10) 
    //  const hashedPassword = await bcrypt.hash(req.body.password, salt);
    

     console.log("5");


     //CREATE A NEW USER

     const userMoudel = new userData({
        name: req.body.name,
        email:req.body.email,
         password: req.body.password
     })


    //  const userMoudel = new user(data);

     const Newuser = await userMoudel.save();

   return res.status(200).json( {status:200, message:"success registration",data:Newuser});

} catch (error) {
    return res.status(500).json( { message:"bad request"});     
}

});


//LOGIN

router.post('/login',async (req,res) => {
    //LETS VALIDATE THE DATE BEFORE WE A USER
    console.log("1");
    const {error} = validateLogin(req.body);
    console.log("2");

    if (error) return res.status(400).send(error.details[0].message);
    console.log("3");


        //checking if the email exists
        const user = await userData.findOne({email: req.body.email});
        console.log(user);
        if (!user) return res.status(400).send('Email is not found');
        
        //PASSWORD IS CORRECT
        const valiPass = await bcrypt.compare(req.body.password, user.password);
        if (!valiPass) return res.status(400).send('Invalid password');


    console.log(process.env.TOKEN_SECRET);

        //create and assign a token
        const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)

        res.send({
            token: token
        })

    
});

router.get('/forgotpassword',async (req,res) => {
    

        // GET USER BASED ON POSTED EMAIL
        const user = await userData.findOne({email: req.body.email});
        console.log(user);
        if (!user) {
            return res.send("No user found with Email")
        } 
    
        //GENERATE RANDOM RESET TOKEN 
        const resetToken = user.createPasswordResetToken();
        await user.save({  validatebeforeSave: false})
    
        //SEND IT TO USER EMAIL

    
        try {
            const reseltURL = `${req.protocol}://${req.get('host')}//api/v1/user/resetPassword/${resetToken}`;
            await new  email(user, reseltURL).sendPasswordReset();
    
            res.status(200).json({
                status: 'success',
                massage: 'Token sent to email!'
            });
        } catch (err) {
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save({validatebeforeSave: false});
    
            return next(
                new AppError('there was an error sending the email. try again later!'),
                500
            );
        }
})





router.get('/resetpassword',async (req,res) => {

    // get user based on token 
    // const hashedToken = crypto
    // .createHash('sha256')
    // .update(req.params.token)
    // .digest('hex');

    // const userData = await user.findOne({
    //     passwordResetToken: hashedToken,
    //     passwordResetExpires: {$gt: date.now()}
    // });

    var user = await userData.findOne({
            password: req.body.password
        });
    

    //if there is user, set the new password
    if (!user) {
        return res.send("current Password is wrong")
    }

    if(req.body.newPassword === req.body.passwordConfirm){
        var updatedUser = await userData.findByIdAndUpdate(user.id,{password:req.body.newPassword})
    }else{
        return res.send("Passwords are not the same")
    }

    //update changedpassword at property for the user
    //log the user in, send jwt
    res.status(200).json({
        message: "password change successful",
        user: updatedUser
    })
    
} )





module.exports = router;






        // exports.forgotPassword = ( async (req, res, next) =>{
        //     // GET USER BASED ON POSTED EMAIL
        //     const User = await User.findOne({email: req.body.email});
        //     if (!user) {
        //         return next(new appError('they is no user with email address ',404 ));
        //     } 
        
        //     //GENERATE RANDOM RESET TOKEN 
        //     const resetToken = user.createPasswordResetToken();
        //     await user.save({  validatebeforeSave: false})
        
        //     //SEND IT TO USER EMAIL
        
        //     try {
        //         const reseltURL = `${req.protocol}://${req.get('host')}//api/v1/user/resetPassword/${resetToken}`;
        //         await new  email(user, reseltURL).sendPasswordReset();
        
        //         res.status(200).json({
        //             status: 'success',
        //             massage: 'Token sent to email!'
        //         });
        //     } catch (err) {
        //         user.passwordResetToken = undefined;
        //         user.passwordResetExpires = undefined;
        //         await user.save({validatebeforeSave: false});
        
        //         return next(
        //             new AppError('there was an error sending the email. try again later!'),
        //             500
        //         );
        //     }
        
        // });