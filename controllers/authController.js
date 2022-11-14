const User = require("../models/userModel");
const bcrypt = require('bcryptjs');

exports.signUp = async (req,res) => {
    const {
        username,
        password
    } = req.body;

    try {
        const HashPassword = await bcrypt.hash(password,10);
        const newUser = await User.create({
            username:username,
            password:HashPassword
        });
        res.session.user = newUser;
        res.status(201).json({
            status:"succcess",
            data:{
                user : newUser
            }
        })
    } catch (error) {
        res.status(400).json({
            status:"fail"
        })   
    }
}

exports.login = async (req,res,next) => {
    const {
        username,
        password
    } = req.body;

    try {
        const user = await User.findOne({
            username
        });

        if(!user){
            return res.status(404).json({
                status:"fail",
                message:"user not found"
            })
        }

        const isPasswordCorrect = await bcrypt.compare(password,user.password)

        if(isPasswordCorrect){
            req.session.user = user;
            res.status(200).json({
                status:"success"
            });
        }else{
            res.status(200).json({
                status:"success",
                message:"incorrect password"
            });
        }

    } catch (error) {
        res.status(400).json({
            status:"fail"
        })   
    }
}