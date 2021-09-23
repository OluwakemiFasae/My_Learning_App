import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
 
const Admin = require('../models').Admin;


passport.serializeUser((user, done) =>{
    done(null, user.id);
});

passport.deserializeUser((id, done) =>{
    Admin.findByPk(id)
        .then((user) => {
            done(null,user);
    })
});


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:5000/auth/google/callback',
    proxy: true
}, async (accessToken, refreshToken, profile, done) => {
    console.log(profile.emails[0].value)
    const existingUser = await Admin.findOne({ where: { email: profile.emails[0].value} })
    //.then(existingUser => {
        if(existingUser){
            done(null, existingUser); 
        }else{
            const newUser = await Admin.create({
                firstname: profile.name.givenName,
                lastname: profile.name.familyName,
                email: profile.emails[0].value,
                password: 'default',
                companyId: 1
            })
                
            done(null, newUser)
                //.then(user => done(null, user));
        }
    
    }
));