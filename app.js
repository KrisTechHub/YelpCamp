//running dotenv when in development mode, and not on production
if (process.env.NODE_ENV !== "production") { //enviroment variable thats usually dev or prod. 
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const ExpressError = require('./Utilities/ExpressError');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');


//ROUTES
const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');//campground router
const reviewRoutes = require('./routes/reviews');//campground router


//MONGOSH  CONNECTION
const mongoose = require('mongoose');
main().catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/YelpCamp'); // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
    console.log("connected to mongo");
}


const app = express();
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true })); //parse the req.body
app.use(methodOverride('_method')); //app.use allow us to run code on every single request
app.use(express.static(path.join(__dirname, 'public')))//use the static pages, then the directory



const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());



//PASPORT USE
app.use(passport.initialize())
app.use(passport.session())

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()))

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser()); //how to store a user in a session
passport.deserializeUser(User.deserializeUser()); //how to get a user out of the session


//do this before the route handlers
app.use((req, res, next) => {
    res.locals.currentUser = req.user //check if logged in
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.get('/fake', async (req, res) => {
    const user = new User({
        email: 'abc@gmail.com',
        username: 'abcUser'
    })
    const newU = await User.register(user, 'abcde');
    res.send(newU);
})

//USE ROUTES
app.use('/campgrounds', campgroundRoutes); //campground router
app.use('/campgrounds/:id/reviews', reviewRoutes); //campground router
app.use('/', userRoutes); //campground router



//HOME ROUTE
app.get('/', (req, res) => {
    res.render('home')
});



//HANDLING ERROR
app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
}) //app.all - for every single request, this will run. this will only run if no error matches from the other pre-defined errors


app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Requested page not found!' } = err;
    if (!err.message) err.message = 'Oh no, something went wrong!'
    res.status(statusCode).render('error', { err });
})


app.listen(3005, () => {
    console.log('Serving on port 3005');
});