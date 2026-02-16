import { requireAuth } from "@clerk/express";
import {User} from "../models/user.model.js";
import {ENV} from "../config/env.js";


//method to check if user is authorized or not
export const protectRoute = [
    requireAuth(), //clerk middleware to check if user is authenticated or not
    async (req,res,next) => {
        try{
            const clerkId = req.auth().userId;
            if (!clerkId) return res.status(401).json({message:"Unauthorized - invalid token"});

            //find user uing clerkId 
            const user = await User.findOne({clerkId});
            if(!user) return res.status(404).json({message:"User not found"});
            
            req.user = user; //attach user to req object 
            next();

        } catch(error){
            console.error("Error in protectRoute middleware", error);
            res.status(500).json({message:"Internal server error"});

        }
    },
];

//method to check if user is admin or not , in order to access the admin routes
//by checking admin email (.env)
export const adminOnly = (req,res,next) => {
    if (!req.user){
         return res.status(401).json({message:"Unauthorized - user not found"});
    }

  if(req.user.email !== ENV.ADMIN_EMAIL){
    return res.status(403).json({message:"Forbidden - admin access only"});
  }
  //call method - means user is admin
  next();
};