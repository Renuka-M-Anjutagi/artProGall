import { hashPassword, comparePassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import JWT from  'jsonwebtoken';
export const registerController = async(req, res) =>{
try {
    
    const {name, email, password, phone, address} = req.body;
   if(!name) return res.send({error: 'Name is missing'});
   if(!email) return res.send({error: 'email is missing'});
   if(!password) return res.send({error: 'password is missing'});
   if(!phone) return res.send({error: 'phone is missing'});
   if(!address) return res.send({error: 'address is missing'});

   const existinguser = await userModel.findOne({email});
   if(existinguser) 
   {
     return res.status(200).send(
        {
            success: false,
            message: 'Already registred user, please login'

        }
     )
   }

   const hashedPassword = await hashPassword(password);
   const user = await new userModel({name, email, phone, address, password: hashedPassword}).save();
   res.status(201).send({
    success: true,
    message: 'User regisrted success',
    user
   })
} catch (error) {
    console.log(error);

    res.status(500).send({
        success: false,
        message: 'Error in Regirestration',
        error
    })
}
}

export const loginController = async(req, res) =>{
try {
    const {email, password} = req.body;

    if(!email) return res.status(404).send({error: 'email is missing'});
    if(!password) return  res.status(404).send({error: 'Password is missing'});
//get user
const user = await userModel.findOne({email});

if(!user) return  res.status(404).send({ success: false, message: 'Email is not registered'});

    const match = await comparePassword(password, user.password)

if(!match) return  res.status(200).send({ success: false, message: 'User or Passwod is invalid'});
// token create
const token = JWT.sign({_id: user._id}, process.env.JWT_SECRET, {
    expiresIn: "1d"
})

res.status(200).send({
    success: true,
    message: 'login Success',
    user:{name : user.name, email: user.email, phone: user.phone, address:user.address},
    token
})
} catch (error) {
    console.log('error', error);
    res.status(500).send({
        success: false,
        message: 'Error in login',
        error
    })
}
}

export const testController = (req, res) =>
    {
        try {
            res.send('Protected - route');
        } catch (error) {
            console.log(error);
            res.send({error})
        }
      
    }
    
    export const dashboradController  = (req, res) =>
        {
            try {
                res.send('Protected - route');
            } catch (error) {
                console.log(error);
                res.send({error})
            }
          
        }

export const forgotPassword = async(req,res) =>
    {
        const {email} = req.body;
        try{
            const oldUser = await userModel.findOne({email});
            if(!oldUser){
                return res.status(200).send(
                    {
                        success: false, 
                        message: 'User Not Exist'
            
                    }
                 )
            }
           // const secret = JWT_SECRET + oldUser.password;
           //  const token = JWT.sign({ email:oldUser.email, id: oldUser._id},secret,{expiresIn:"5m"});
            const token = JWT.sign({ email:oldUser.email, id: oldUser._id }, process.env.JWT_SECRET, {
                expiresIn: "1d"
            });
            const link = `http://localhost:8080/login/reset-password/${oldUser._id}/${token}`;
            console.log(link);
            return link;
        }catch(error)
        {
            console.log(error);
        }
    }
export const resetPassword =  async(req,res) =>{
    const {id , token} = req.params;
    console.log(req.params);
    const oldUser = await userModel.findOne({ _id:id});

    if(!oldUser)
        {
            return res.json( { status : "User Not Exist"});
        }
    const secret = JWT + oldUser.password;
    try{

        const verify = verify(token,secret);
        res.render("ResetNewPassword", { email:verify.email})
    }catch(error)
    {
        console.log("Not Verified");
    }
    res.send("Done");

 }
// export default {registerController};
