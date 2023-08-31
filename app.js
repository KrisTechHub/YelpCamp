const express = require('express');
const path = require('path');
const ExpressError = require('./Utilities/ExpressError');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');


//ROUTES
const campgrounds = require('./routes/campgrounds');//campground router
const reviews = require('./routes/reviews');//campground router


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
app.use(express.urlencoded({ extended : true }));
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


//do this before the route handlers
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    next();
})

//USE ROUTES
app.use('/campgrounds', campgrounds); //campground router
app.use('/campgrounds/:id/reviews', reviews); //campground router


//HOME ROUTE
app.get('/', (req, res) => {
    res.render('home')
});



//HANDLING ERROR
app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
}) //app.all - for every single request, this will run. this will only run if no error matches from the other pre-defined errors


app.use((err, req, res, next) => {
    const { statusCode= 500, message = 'Requested page not found!' } = err;
    if (!err.message) err.message = 'Oh no, something went wrong!'
    res.status(statusCode).render('error', {err});
})


app.listen(3000, () => {
    console.log('Serving on port 3000');
});