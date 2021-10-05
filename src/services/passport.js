import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
 
const Company = require('../models').Company;


passport.serializeUser((user, done) =>{
    done(null, user.id);
});

// passport.deserializeUser((user, done) => {
//     done(null,user);   
// })

passport.deserializeUser((id, done) =>{
    Company.findByPk(id)
        .then((user) => {
            done(null,user);
    })
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
    proxy: true
}, async (accessToken, refreshToken, profile, done) => {
    
    const existingUser = await Company.findOne({ where: { email: profile.emails[0].value} })
    //.then(existingUser => {
        if(existingUser){
            done(null, existingUser); 
        }else{
            const newUser = await Company.create({
                companyName: profile.displayName,
                email: profile.emails[0].value,
                password: '',
                verified: true,
                logoUrl: profile.photos[0].value
            })
                
            done(null, newUser)
                //.then(user => done(null, user));
        }
    
    }
));