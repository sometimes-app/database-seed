const { MongoClient, ServerApiVersion } = require('mongodb')
const { premade, userInfo, userMessages } = require('./mockData')
const { username, password } = require('./config')
const uri = `mongodb+srv://${username}:${password}@atlascluster.fmyifhu.mongodb.net/?retryWrites=true&w=majority`

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect()
    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 })
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    )

    // Check if Test collection exists before dropping it
    const collections = await client.db('Sometimes').listCollections().toArray()

    const DropIfFound = ['Test', 'Premade', 'UserInfo', 'Messages']

    for (let collectionName of DropIfFound) {
      if (collections.find((c) => c.name === collectionName)) {
        await client.db('Sometimes').collection(collectionName).drop()
        console.log(collectionName + ' collection dropped')
      }
    }

    var result = await client
      .db('Sometimes')
      .collection('Premade')
      .insertMany(premade)
    console.log(
      `${result.insertedCount} document(s) inserted to Premade collection`
    )

    var result = await client
      .db('Sometimes')
      .collection('UserInfo')
      .insertMany(userInfo)
    console.log(
      `${result.insertedCount} document(s) inserted to UserInfo collection`
    )

    var result = await client
      .db('Sometimes')
      .collection('Messages')
      .insertMany(userMessages)
    console.log(
      `${result.insertedCount} document(s) inserted to Messages collection`
    )
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close()
  }
}

run().catch(console.dir)
