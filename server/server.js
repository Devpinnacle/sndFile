// const express = require('express')
// const app = express()
// const port = 3000;
// const ip='192.168.6.65'
// const cors = require('cors')
// const connectDB = require('./config/db');

// connectDB();

// app.use(
//   cors({
//     origin: "*",
//     credentials: true,
//   })
// );
// app.options("*", cors());

// app.use(express.json({ limit: "20mb", extended: true }));

// app.use(
//   express.urlencoded({ limit: "20mb", extended: true, parameterLimit: 50000 })
// );



// // Init Middleware
// app.use(express.json({ extended: false }));


// app.use("/api/user", require("./route/user"));
// app.use("/api/image",require("./route/imageRoute"))

// app.listen(port, ip, () => {
//   console.log(`Example app listening on http://${ip}:${port}`); 
// });

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const socketIo = require('socket.io');

const cors = require('cors');
const connectDB = require('./config/db');


connectDB();

const io = socketIo(server, {
  cors: {
    origin: "http://192.168.6.65:5173", // Replace with your frontend URL
    credentials: true
  },
});

// Middleware
app.use(cors());
app.use(express.json());

app.use("/transfer",require("./route/transferRout")) 
app.use("/api/user", require("./route/user"));

const port = 3000;
const ip = '192.168.6.65';
 
server.listen(port, ip,
  () => {
    console.log(`Example app listening on http://${ip}:${port}`);
  });



