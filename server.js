const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

//database
const mongoDB = 'mongodb://127.0.0.1/items';
mongoose.connect(mongoDB, {useNewUrlParser: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const itemSchema = new mongoose.Schema({
    name: String
});

const itemsModel = mongoose.model('items', itemSchema);
const itemsStudyModel = mongoose.model('itemsStudy', itemSchema);

app.get('/', async (req, res)=>{
    let today = new Date();
    //to get the date and the day of the week
    let options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    }
    
    let day = today.toLocaleDateString("en-US", options);
    //console.log(day);

    const all = await itemsModel.find({});

    res.render('index', {
        listTitle: day,
        newListItems: all
    })
});

app.post('/', (req, res)=>{
    console.log(req.body.list);
    let item = req.body.newItem;
    if(req.body.list === "Study TODO"){
        //itemsStudy.push(item);
        const studyItem = new itemsStudyModel({name: item});
        studyItem.save(function(err) {
            if (err) return console.error(err);
        });
        res.redirect('/study');
    } else {
        //items.push(item);
        const studyItem = new itemsModel({name: item});
        studyItem.save(function(err) {
            if (err) return console.error(err);
        });
        res.redirect('/');
    }

    
});

app.get('/study', async (req, res) => {
    const all = await itemsStudyModel.find({});

    res.render('index', {
        listTitle: "Study TODO",
        newListItems: all
    })
});

app.listen(3000, ()=>{
    console.log("Server is running on port 3000");    
})