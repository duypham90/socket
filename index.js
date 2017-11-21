const express = require('express');
const app = express();
const { getHotGirlByID, hitLike, disLike }  = require('./db');
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', './views');
const port = process.env.port || 3000;

const server = require('http').Server(app);
const io = require('socket.io')(server);
server.listen(port, () =>  console.log(`server start on ${port}`));
let count = 0;

class User {
    constructor(username, id) {
        this.username = username;
        this.id = id;
    }
}
const arrUserName = [];
const arrUser = [];
io.sockets.on('connection', (socket) => {
    socket.on('NEW_USER_SIGN_UP', username => {
        if(arrUserName.indexOf(username) === -1){
            socket.username = username;
            arrUserName.push(username);
            arrUser.push(new User(username, socket.id));
            socket.emit('XAC_NHAN_DANG_KY', true);
            io.emit('NEW_USER_CONNECTED',username);
        } else {
            io.emit('NEW_USER_CONNECTED', false);
        }
    });
    socket.on('CLIENT_SEND_NEW_MESSAGE', message => {
        const { dest, msg } = message;
        const { id } = arrUser.find(e => e.username === dest);
        socket.broadcast.to(id).emit('GOT_NEW_MESSAGE', `${socket.username} : ${msg}`);
    });
    socket.on('disconnect', () => {
        if (socket.username) io.emit('USER_DISCONECTED',socket.username);
        const index = arrUser.find(e => e.username === socket.username);
        arrUser.splice(index, 1);
        arrUserName.splice(index, 1);

    });
});
// io.sockets.on('connection', (socket) => {
//     count++;
//     console.log(`co nguoi vua ket noi toi server: ${socket.id}`);
//     io.sockets.emit('userOnline',{usersOnline:count});
//     setInterval(() => io.sockets.emit('SERVER_SEND_MESSAGE','CHAO BAN'), 2000);
//     socket.on('disconnect', () => {
//         count--;
//         io.sockets.emit('userOnline',{usersOnline:count});
//     });
//     socket.on('CLIENT_SEND_MESSAGE', data =>{
//         io.emit('SERVER_SEND_MESSAGE',data)
//     });
// });

app.get('/', (req, res) => {
    res.render('home');
})
app.get('/getData', (req, res) => {
    queryDB('SELECT * FROM "HotGirl"', [], (err, result) => {
        res.send(result.rows);
    });
});

app.get('/show/:id', (req, res) => {
    const { id } = req.params;
    getHotGirlByID(id)
    .then(result => res.render('home',{infor: result}))
    .catch(err => console.log(err));
});
app.get('/hitlike/:id', (req, res) => {
    const { id } = req.params;
    hitLike(id).then(() => res.redirect(`/show/${id}`)).catch(err => console.log(`have some err ${err}`));
});
app.get('/dislike/:id', (req, res) => {
    const { id } = req.params;
    disLike(id).then(() => res.redirect(`/show/${id}`)).catch(err => console.log(`have some err ${err}`));
});