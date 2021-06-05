const express = require("express") ;
const { MongoClient } = require("mongodb") ; 

const myCluster_uri = 'mongodb+srv://m001-student:m001-mongodb-basics@sandbox.89gos.mongodb.net/myFirstDatabase?retryWrites=true&w=majority' ;

let db, trips, expenses ;

// Create a new MongoClient
const client = new MongoClient(myCluster_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    // Establish and verify connection
    db  = await client.db("tripcost");
    trips = db.collection("trips") ;
    expenses = db.collection("expenses")
    console.log("Connected successfully to server");
    } catch(error){
        throw new error ;
    }
}
run().catch(console.dir);

const app = express() ;
app.use(express.json())

app.post("/trip", (req, res) => {
    const name = req.body.name
    trips.insertOne({ name: name }, (err, result) => {
        if (err) {
        console.error(err)
        res.status(500).json({ err: err })
        return
        }
        console.log(result)
        res.status(200).json({ ok: true })
    })
}) ;

app.get("/trips", (req, res) => {
    trips.find().toArray((err, items) => {
        if (err) {
        console.error(err)
        res.status(500).json({ err: err })
        return
        }
        res.status(200).json({ trips: items })
    })
})
app.post("/expense", (req, res) => {
    expenses.insertOne(
    {
        trip: req.body.trip,
        date: req.body.date,
        amount: req.body.amount,
        category: req.body.category,
        description: req.body.description,
    },
    (err, result) => {
    if (err) {
        console.error(err)
        res.status(500).json({ err: err })
        return
    }
    res.status(200).json({ ok: true })
    }
    )
})
app.get("/expenses", (req, res) => {
    expenses.find({ trip: req.body.trip }).toArray((err, items) => {
        if (err) {
        console.error(err)
        res.status(500).json({ err: err })
        return
        }
        res.status(200).json({ expenses: items })
    })
})

app.listen(3000, () => console.log("Server ready"))