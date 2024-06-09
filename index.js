const http = require('http');
const server = http.createServer();

const io = require('socket.io')(server, {
    cors: {
        origin: "https://chat-app-5c3e8.web.app",
        methods: ["GET", "POST"]
    }
});

const users = {};

io.on('connection', (socket) => {
    socket.on('user-joined', (name) => {
        console.log("the user joined",name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    socket.on('send', (message) => {
        socket.broadcast.emit('receive', {
            message: message,
            name: users[socket.id]
        });
    });

    socket.on('disconnect', () => {
        if (users[socket.id]) {
            socket.broadcast.emit('user-left', users[socket.id]);
            delete users[socket.id];
        }
    });
});

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
    console.log('Server is running on http://localhost:8000');
});
