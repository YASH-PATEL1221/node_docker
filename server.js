const express = require('express');
const mongoose = require('mongoose');
const app = express();
const mongo = require("./config/config");
const session = require('express-session');
const redis = require('redis');
const postRouter = require("./routes/postRoutes");
const usersRoute = require('./routes/userRoute');
const cors = require('cors');
const PORT = 3000;

const mongo_URL = `mongodb://${mongo.MONGO_USER}:${mongo.MONGO_PASSWORD}@${mongo.MONGO_IP}:${mongo.MONGO_PORT}/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.0`

let redisStore = require('connect-redis')(session);
let redisClient = redis.createClient({
    url: `redis://${mongo.REDIS_URL}:${mongo.REDIS_PORT}`,
    legacyMode: true
});

redisClient.connect();


function ConnectToDB(){
    mongoose.connect(mongo_URL)
    .then(() => {
        console.log("connected to mongoDB");
    })
    .catch(e => {
        console.log("Error",e);
        setTimeout(ConnectToDB,5000);
    })
}

ConnectToDB();


app.set('trust proxy');
app.use(cors());
app.use(session({
    store: new redisStore({
        client : redisClient
    }),
    secret : mongo.SESSION_SECRET,
    cookie:{
        secure : false,
        resave : false,
        saveUninitilized : false,
        httpOnly : true,
        maxAge : 30000
    }
}));


app.use(express.json());

app.get('/api/v1',(req,res) => {
    res.send('NginX with Docker and NodeJS!!!!!!!!!!!!!!!!!!!!!');
    console.log("Yaaa NginX");
})

app.use("/api/v1/posts",postRouter);
app.use("/api/v1/users",usersRoute);

app.get("/home",(req,res) => {
    res.send("Welcome to home");
})

app.listen(PORT,() => {
    console.log(`server is listning on http://localhost:${PORT}`);
})
