const http = require('http');
const server = http.createServer();

const io = require('socket.io')(server, {
    cors: {
        origin: "http://127.0.0.1:5501",
        methods: ["GET", "POST"]
    }
});

const users = {};

io.on('connection', (socket) => {
    socket.on('user-joined', (name) => {
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

server.listen(8000, () => {
    console.log('Server is running on http://localhost:8000');
});
