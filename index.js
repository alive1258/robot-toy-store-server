const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1yov7jc.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const productCollection = client.db("robotToy").collection("products");
    const addToyCollection = client.db("robotToy").collection("toys");



    app.get("/products/:id",async(req,res)=>{
        const id=req.params.id
        const query={_id: new ObjectId(id)}
        const result= await productCollection.findOne(query)
        res.send(result)

    })

    // all toy data load
    app.get("/products/:text", async (req, res) => {
        console.log(req.params.text)
        if(req.params.text =="RoboPets" || req.params.text =="RoboRacers" || req.params.text =="RoboWizards"){
            
            const result = await productCollection.find({subCategory:req.params.text}).toArray();
          return  res.send(result);

        }
        else{
            const result = await productCollection.find({}).toArray();
          res.send(result);

        }

    });





    // addtoys
    app.get("/toys", async (req,res)=>{
        console.log(req.query.email)
        let query = {};
        if(req.query?.email){
           query ={email: req.query.email} 
        }
        const result =await addToyCollection.find(query).toArray();
        res.send(result)
    })
    // all toy data load
    app.get("/toys", async (req,res)=>{
     
        const cursor = addToyCollection.find()
        
        const result =await cursor.toArray();
        res.send(result)
    })
    // read

    app.post("/toys", async (req, res) => {
      const addToy = req.body;
      console.log(addToy);
      const result = await addToyCollection.insertOne(addToy);
      res.send(result);
    });
    // update 
    app.patch("/toys/:id",async(req,res)=>{
        const id =req.params.id;
        const filter = {_id: new ObjectId(id)}
        const options ={upsert:true};
        const UpdateToyData=req.body;
        const toyData={
            $set:{
                quantity:UpdateToyData.quantity,
                price:UpdateToyData.price,
                description:UpdateToyData.description

            }
        }
        const result = await addToyCollection.updateOne(filter,toyData,options)
        res.send(result)

    })



    app.get("/toys/:id",async(req,res)=>{
        const id=req.params.id
        const query={_id: new ObjectId(id)}
        const result= await addToyCollection.findOne(query)
        res.send(result)

    })

       //delete
       app.delete("/toys/:id", async(req,res)=>{
        const id = req.params.id;
        console.log('delete from database',id)
        const query={_id: new ObjectId(id)}
        const result =await addToyCollection.deleteOne(query)
        res.send(result)
    })

 

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("robot toy store is Booking");
});

app.listen(port, () => {
  console.log(`robot toy store is running port: ${port}`);
});
