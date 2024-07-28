let app = require('express')();
let server = require('http').createServer(app);
let io = require('socket.io')(server);

let users = [];
const clients = {};
let count = 1;
app.set('view engine', 'ejs');  // 렌더링 엔진 모드 ejs로 설정
app.set('views', __dirname + '/views');

app.get('/', (req, res) => {
    res.render('userCreate');    // index.ejs를 사용자에게 전달
});

app.get('/chat', (req, res) => {
    res.render('index');    // index.ejs를 사용자에게 전달
});

io.on('connection', (socket) => {   // 연결이 들어오면 실행되는 이벤트
    // socket 변수에는 실행 시점에 연결한 상대와 연결된 소켓의 객체

    // socket.emit으로 현재 연결한 상대에게 신호를 보냄

    socket.on('joinChat', () => {
        clients[socket.id] = socket;
        countUser();
        console.log('채팅방에 Join한 Client 정보');
        Object.keys(clients).forEach(clientId => {
            console.log(`남아있는 Client ID : ${clientId}`);
        });
    });
    
    // on 함수로 이벤트를 정의해 신호를 수신할 수 있음
    socket.on('message', (msg) => {
        // msg에는 클라이언트에서 전송한 매개변수
        console.log('Message received : ', msg);
        console.log('연결 정보 : ');
        console.log(socket.id);
        // io.emit에 연결된 모든 소켓들에 신호를 보냄
        io.emit('message', msg);
    });

    // 유저 생성 요청 처리
    socket.on('createUser', (data) => {
        let newUser = {
            id : socket.id,
            username : data.username
        };
        users.push(newUser);
        console.log('User created : ', newUser);

        // 유저 생성 완료를 클라이언트에게 알림
        socket.emit('userCreated', newUser);

        console.log("현재 생성한 유저");
        console.log(users);
    });

    // 유저가 채팅방 떠날 시 처리
    socket.on('leaveChat', (user) => {
        console.log('채팅방 나간대~')
    });

    // socket.on('disconnect', () => {
    //     console.log(`Client disconnected : ${socket.id}`);
    //     delete clients[socket.id];
    //     Object.keys(clients).forEach(clientId => {
    //         console.log(`남아있는 Client ID : ${clientId}`);
    //     });
    // })

    socket.on('userAuth', (data) => {
    })
});

server.listen(2060, function() {
    console.log('Listening on http://localhost:2060');
});

/* io.on('disconnect', (socket) => {
    
    // 유저가 채팅방 떠날 시 처리
    socket.on('leaveChat', (user) => {
        console.log('리브 챗');
        console.log(user);
    })

    console.log(Object.entries(clients));
}); */

function allConnectedClients() {
    console.log(`--------------------${count++}-------------`);
    Object.keys(clients).forEach(clientId => {
        console.log(`Client ID : ${clientId}`);
    });
}

function countUser() {
    const userCount = Object.keys(clients).length;
    console.log('유저수');
    console.log(userCount);
    io.emit('usercount', userCount);
}

setInterval(allConnectedClients, 5000);