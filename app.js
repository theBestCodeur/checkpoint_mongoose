//============= REFERENCING MONGOOSE ==============
const mongoose = require('mongoose'); 
const nodemon = require('nodemon');
const Schema = mongoose.Schema;

//========== CONNECTING TO THE DATABASE ===========
let db;
async function dbConnect() {
    console.log(">>mongo");
    const url = "mongodb://127.0.0.1:27017/dbCheckpoint";
    mongoose.connect(url, { useNewUrlParser: true});
    db = mongoose.connection;
    db.once("open", (_) => {
        console.log("Database connected:", url)
    });
    db.on("error", (err) => {
        console.log("connection error:", err);
    });
}

dbConnect();

//========= DEFINING A PERSON SCHEMA  =============
const personSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    age: Number,
    favoriteFoods: [String],
    hometown: String 
});

//========== CREATING A PERSON MODEL ==============
const Person = mongoose.model('Person', personSchema, "dbCollection");
// mongoose.model('model', schema, collection)


// CREATING AND SAVING A RECORD OF THE PREVIOUS MODEL

const mike = new Person({
        name: 'Mike', 
        age: 27,
        favoriteFoods: ["Pistache", "Alloco", "Pizza"],
        hometown: 'Abidjan'
    })

const createAndSaveRecord = (person) => {
    person.save((err) => {
        if (err) return console.log(err)
    })
}

createAndSaveRecord(mike);


// === CREATING MANY RECORDS WITH model.create() =====
let arrayOfPeople = [
    {
        name: 'Jack', 
        age: 25,
        favoriteFoods: ['Pistache', 'Pizza'],
        hometown: 'Abidjan'
    },
    {
        name: 'William', 
        age: 37,
        favoriteFoods: ['Ogbono Soup', 'Jollof Rice', 'Pizza'],
        hometown: 'Abuja'
    },
    {
        name: 'Didier', 
        age: 30,
        favoriteFoods: ["N'gbô", "foutou", "Puff-Puff"],
        hometown: 'Bouaké'
    },
    {
        name: 'Matt', 
        age: 22,
        favoriteFoods: ['Burrito', 'Sushi', 'pizza'],
        hometown: 'Tokyo'
    },
    {
        name: 'Mary', 
        age: 41,
        favoriteFoods: ['yuca', 'Sushi', 'dolo'],
        hometown: 'Bamako'
    },
    {
        name: 'Marco', 
        age: 15,
        favoriteFoods: ['Sushi'],
        hometown: 'Tokyo'
    }
];

const createManyPeople = (arrayOfPeople) => {
    Person.create(arrayOfPeople, (err) => {
        if(err) return console.log(err)
    })
}

createManyPeople(arrayOfPeople);


//USING model.find() TO SEARCH THROUGH THE DATABASE
let searchedName = "Didier";
const findPeopleByAGivenName = (searchedName) => {
    Person.find({name: searchedName}, (err, peopleFound) => {
        if(err) return console.log(err)
        console.log(peopleFound)
    })
}

findPeopleByAGivenName(searchedName);


// USING model.findOne() TO RETURN A SINGLE MATCHING DOCUMENT FROM THE DATABASE
let food = "Sushi";
const findOneByFood = (food) => {
    Person.findOne({favoriteFoods: food}, (err, personFound) => {
        if(err) console.log(err)
        console.log(personFound)
    })
}

findOneByFood(food);


// // USING model.findById() TO SEARCH THROUGH THE DATABASE BY _ID
let personId1 = '626ef1799f3fee746695b2db';
const findPersonById = (personId1) => {
    Person.findById(personId1, (err, result) => {
        if(err) return console.log(err)
        console.log(result)
    })
}

findPersonById(personId1);


// // PERFORMING CLASSIC UPDATES BY RUNNING Find, Edit, THEN Sav
let personId = "626ef1799f3fee746695b2d9";
let classicUpdate = (personId) => {
    Person.findById(personId, (err, person) => {
        if(err) return console.log(err)
        person.favoriteFoods.push("hamburger")
        person.save((err) => {
            if(err) console.log(err)
        })
    })
}

classicUpdate(personId);

// // PERFORMING NEW UPDATES ON A DOCUMENT USING model.findOneAndUpdate()
let personName = "William";
const findPersonAndUpdateThem = (personName) => {
    Person.findOneAndUpdate({name: personName}, {age: 20}, {new: true}, 
        (err, updatedPerson) => {
            if(err) console.log(err)
            console.log(updatedPerson)
        })
}

findPersonAndUpdateThem(personName);

// DELETING ONE DOCUMENT USING model.findByIdAndRemove 
let personId2 = '626ef1799f3fee746695b2de';
const deleteSomeoneById = (personId2) => {
    Person.findOneAndRemove(personId2, (err) => {
        if(err) console.log(err)
    })
}

deleteSomeoneById(personId2);

// DELETING MANY DOCUMENTS WITH model.remove()
let targetName = "Mary";
const deleteManyDoc = (targetName) => {
    Person.deleteMany({name: targetName}, (err) => {
        if(err) return console.log(err)
    })
}

deleteManyDoc(targetName);

// CHAINING SEARCH QUERY HELPERS TO NARROW SEARCH RESULTS
const chainingSearchQuery = () => {
    Person.find({favoriteFoods: "Burrito"})
        .sort({name: 'asc'})
        .limit(2)
        .select('-age')
        .exec((err, results) => {
            if(err) return console.log(err)
            console.log(results)
        })
}

chainingSearchQuery();