import JWT from 'jsonwebtoken';
import userModel from '../models/userModel.js';
// protected route

export const  requireSignIn = async (req, res, next) =>{
try {
    const decode = JWT.verify(req.headers.authorization, process.env.JWT_SECRET);
    req.user = decode;
   
    next();
} catch (error) {
    console.log('error :', error)
}
}
// admin access
export const isAdmin  = async (req, res, next) =>
    {
        try {
            const user = await userModel.findById(req.user._id)
            if(user.role !== 1)
            {
                return res.status(401).send({
                    success: false,
                    message: 'Un authorized access'
                })
            }
            else
            {
                next();
            }
        } catch (error) {
            console.log(error, 'error');
            res.status(401).send({
                success: false,
                message: 'Error in Admin Middleware'
            })
        }
    }
    