const bcrypt = require("bcryptjs");
const { db } = require('../model/db');
const jwt=require('jsonwebtoken');
const { promisify } = require('util');

exports.register = (req, res) => {

    console.log(req.body);
    console.log(req.body.name);
    console.log(req.body.email);
    console.log(req.body.password);

    const { name, email, password, passwordConfirm } = req.body;

    db.query("select email from users where email=?", [email], async (err, result) => {
        if (err) {
            console.log(err);
        }
        if (result.length > 0) {
            return res.render("register.hbs", {
                message: "this Email Account Alredy",
            });
        }
        else if (!name || !email || !password || !passwordConfirm) {
            return res.render('register.hbs', {
                message: 'Fill All Detail'
            })
        }
        else if (password != passwordConfirm) {
            return res.render("register.hbs", {
                message: "Password Dose Not Mach",
            });
        }
        else {
            const harsedPassword = await bcrypt.hash(password, 8);
            console.log(harsedPassword);
            db.query("insert into users SET ?", { name: name, email: email, password: harsedPassword }, (err, result) => {

                if (err) {
                    console.log(err);
                } else {
                    db.query('select * from  users where email=?',[email],(err,row)=>{
                        if (err) {
                            console.log(err);
                        }else{
                        const id=row[0].id;
                        console.log(id);
                        const token=jwt.sign({id},'vijay',{
                            expiresIn:process.env.JWT_EXPIRES_IN
                        })
                        const cookiesOptions={
                            expires:new Date(Date.now()+(60)),
                            httpOnly:true

                        };
                        res.cookie('jwt',token,cookiesOptions)
                        }
                    })
                    return res.render("register.hbs", {
                        message: "Application Submited",
                    });
                }
            });
        }
    });
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        console.log(req.body);

        // 1) Check if email and password exist
        if (!email || !password) {
            return res.render("login.hbs", {
                message: 'Please provide email and password'
            });
        }
        //  2) Check if user exists && password is correct

        else {
            db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
                console.log(results);
                if (err) {
                    console.log('err in login');
                    console.log(err);

                }
                const isMatch = bcrypt.compareSync(password, results[0].password);
                console.log(isMatch);

                if (!results[0].email || !isMatch) {
                    return res.render('login.hbs', {
                        message: 'Increct Passworld',
                    });
                }
                else if (results[0].email && isMatch) {
                    const id=results[0].id;
                    const token=jwt.sign({id},process.env.JWT_TOKEN,{
                        expiresIn:'10m'
                    })
                    const cookiesOptions={
                        // expires: new Date(Date.now()+(60)),
                        maxAge:new Date(Date.now() + 1000 * 60),
                        httpOnly: true
                    }
                    res.cookie('jwt',token,cookiesOptions)
                    res.redirect('/data_page');
                }
                else {
                    res.redirect('/login');
                }
            });
        }
    }
    catch (err) {

        console.log('err ')
    }
}


exports.isLoggedIn=async(req,res,next)=>{
        console.log(req.cookies);
        try{
            const token=req.cookies.jwt;
            if(!token){
                console.log('token expires')
            }else{
                jwt.verify(token,process.env.JWT_TOKEN)
                next();
            }

        }catch(err) {
            console.log('some err occure')
            res.redirect('/login')
        }
      };
