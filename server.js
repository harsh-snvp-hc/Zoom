const express=require("express")
const app=express()
const server=require("http").createServer(app)
const { v4: uuidV4 } = require('uuid')
const io = require('socket.io')(server)
app.use(express.static("public"))
app.set("view engine","ejs")
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});
app.use('/peerjs', peerServer);


app.get("/", (req,res)=>{
  res.redirect(`/${uuidV4()}`)
})

app.get("/:room",(req,res)=>{
  res.render('rooms', { roomId: req.params.room })
})

io.on('connection', function(socket) {
  socket.on("join-room",(roomId,userId)=>{
    console.log("New User connected:",userId),
    socket.join(roomId)
    socket.broadcast.emit('user-connected', userId);
  
 
   socket.on("message",(message)=>{
    io.to(roomId).emit('createMessage', message, userId)

   }) 


   socket.on('disconnect', () => {
    console.log("user disconnected:",userId)
    socket.to(roomId).emit('user-disconnected', userId)
     })
  })

});

server.listen(process.env.PORT||3030,()=>{
  console.log("server is listening")
})
