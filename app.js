const express = require('express');
const path = require('path');
const Campground = require('./models/campground')
const ExpressError = require('./Utilities/ExpressError');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const unsplashRoutes = require('./routes/unsplash'); // Import your Unsplash API routes
const catchAsync = require('./Utilities/catchAsync');

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
app.use('/api/unsplash', unsplashRoutes); // Use the Unsplash API routes
app.use(express.urlencoded({ extended : true }));
app.use(methodOverride('_method')); //app.use allow us to run code on every single request


app.get('/', (req, res) => {
    res.render('home')
})

app.get('/campgrounds', async (req, res) => { //all campgrounds
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds})
})

app.get('/campgrounds/new', (req, res) => {//add new campground
    res.render('campgrounds/new');
})

app.post('/campgrounds', catchAsync(async (req, res, next) => { //add new campground
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.get('/campgrounds/:id', catchAsync(async (req, res, next) => { //show detail on campround
    const campground = await Campground.findById(req.params.id) //find by ID
    res.render('campgrounds/show', { campground });
}))

app.get('/campgrounds/:id/edit', catchAsync(async (req, res, next) => { //edit campground
    const campground = await Campground.findById(req.params.id) //find by ID
    res.render('campgrounds/edit', { campground });
}))

app.put('/campgrounds/:id', catchAsync(async (req, res, next) => { //show after edit campground
    const { id } = req.params; //find ID
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground}) //find by ID
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.delete('/campgrounds/:id', catchAsync(async (req, res, next) => {//delete campground
    const { id } = req.params; //find ID
    await Campground.findByIdAndDelete(id) //find by ID
    res.redirect('/campgrounds');
}))

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
}) //app.all - for every single request, this will run. this will only run if no error matches from the other pre-defined errors

app.use((err, req, res, next) => {
    const { statusCode= 500, message = 'Requested page not found!' } = err;
    res.status(statusCode).send(message);
})

app.listen(3000, () => {
    console.log('Serving on port 3000');
});