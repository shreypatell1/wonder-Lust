const User=require("../models/user");

module.exports.signupRender=(req,res)=>{
    res.render("user/signup.ejs");
 }


 module.exports.signup=async(req,res)=>{
    try{
    let {email,username,password}=req.body;
    const Newuser=new User({email,username});
    const registeredUser=await User.register(Newuser,password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
       if(err){
          next(err);
       }
       req.flash("success","Welcome To Wanderlust");
       res.redirect("/listings");
    })
 
    }catch(e){
       req.flash("error",e.message);
       res.redirect("/signup");
    }
 }

module.exports.loginRender=(req,res)=>{
    res.render("user/login.ejs");
 
 }


 module.exports.login=async(req,res)=>{
    req.flash("success","Welcome Back to Wandelust!!");
    let redirect=res.locals.redirectUrl || "listings";
    res.redirect(redirect);
 }

 module.exports.logout=(req,res)=>{
    req.logout((err)=>{
       if(err){
         return next(err);
       }
       req.flash("success","Looged you out!");
       res.redirect("/listings")
    });
 
 }