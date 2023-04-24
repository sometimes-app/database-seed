// require the necessary libraries
const {faker} = require("@faker-js/faker");
const { MongoClient, ServerApiVersion } = require('mongodb');

function generateRandom(min = 0, max = 100) {

    // find diff
    let difference = max - min;

    // generate random number 
    let rand = Math.random();

    // multiply with difference 
    rand = Math.floor( rand * difference);

    // add with min value 
    rand = rand + min;

    return rand;
}

function createUser(uuid, friends){
    return {
        uuid: uuid,
        FirstName: faker.name.firstName(),
        LastName: faker.name.lastName(),
        UserName: faker.internet.userName(),
        Email: faker.internet.email(),
        ProfilePicUrl: faker.internet.url(),
        Friends: friends
    }
}

async function seedDB() {
    // Connection URL
    const uri = "";

    const client = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
      });

    try {
        await client.connect();
        console.log("Connected correctly to server");

        const messagesCollection = client.db("Sometimes").collection("Messages");
        const userInfoCollection = client.db("Sometimes").collection("UserInfo");

        // // The drop() command destroys all data from a collection.
        // // Make sure you run it against proper database and collection.
        messagesCollection.drop();
        userInfoCollection.drop();

        // make a bunch of time series data
        const userMessages = [];
        const users = [];

        const uuids = [];
        for (let i = 0; i < 10; i++) {
            uuids.push(faker.datatype.uuid())
        }

        uuids.forEach(uuid => {
            const startIndex = generateRandom(0, uuids.length)
            const stopIndex = generateRandom(startIndex, uuids.length)
            const frienduuids = uuids.filter(i => i != uuid).slice(startIndex, stopIndex)
            users.push(createUser(uuid, frienduuids))
        });

        users.forEach(user => {
            const uuid = user.uuid;
            const messages = [];
            console.log(user)

            if(user.Friends.length > 0){
                for (let j = 0; j < 10; j ++){
                    const message = {
                        _id: faker.database.mongodbObjectId(),
                        messageId: faker.datatype.uuid(),
                        sentTime: faker.datatype.datetime(),
                        body: faker.music.songName(),
                        senderUuid: user.Friends[generateRandom(0, user.Friends.length)],
                        readTime: faker.datatype.datetime(),
                        read: faker.datatype.boolean()
                    }
                    messages.push(message)
                }
            }

            const userMessage = {
                uuid: uuid,
                messages: messages,
            }
            userMessages.push(userMessage)
        })

        await messagesCollection.insertMany(userMessages);
        await userInfoCollection.insertMany(users)


        console.log("Database seeded! :)");
        client.close();
    } catch (err) {
        console.log(err.stack);
    }
}

seedDB();