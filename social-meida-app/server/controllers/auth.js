import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// REGISTER USER
export const register= async(req,res)=>{
    try {
      const {
        firstname,
        lastname,
        email,
        password,
        picturePath,
        friends,
        location,
        occupation,
      } = req.body;

      // ENCRYPTING PASSWORD
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);

      const newUser = new User({
        firstname,
        lastname,
        email,
        password: passwordHash,
        picturePath,
        friends,
        location,
        occupation,
        viewedProfile: Math.floor(Math.random() * 10000),
        impressions: Math.floor(Math.random() * 10000),
      });
      const savedUser = await newUser.save();
      res.status(201).json(savedUser);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
}

//LOGGING IN
export const login=async(req,res)=>{
    try{
        const {email,password}=req.body;
        const user=await User.findOne({email:email});
        if(!user) return res.status(400).json({msg:"User does not exist!!"});

        const isMatchPass=await bcrypt.compare(password,user.password);
        if(!isMatchPass) return res.status(400).json({msg:"Invalid password"});

        const token=jwt.sign({id:user.__id},process.env.JWT_SECERET);
        delete user.password;
        res.status(200).json({token,user}); 

    }catch(e){
        res.status(500).json({ error: e.message });
    }
}