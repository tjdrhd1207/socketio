let app = require('express')();
let server = require('http').createServer(app);
let io = require('socket.io')(server);

let users = [];

app.set('view engine', 'ejs');  // 렌더링 엔진 모드 ejs로 설정
app.set('views', __dirname + '/views');

app.get('/', (req, res) => {
    res.render('index');    // index.ejs를 사용자에게 전달
});

app.get('/createUser', (req, res) => {
    res.render('userCreate');    // index.ejs를 사용자에게 전달
});

io.on('connection', (socket) => {   // 연결이 들어오면 실행되는 이벤트
    // socket 변수에는 실행 시점에 연결한 상대와 연결된 소켓의 객체

    // socket.emit으로 현재 연결한 상대에게 신호를 보냄
    socket.emit('usercount', io.engine.clientsCount);
    
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

        console.log("현재 유저");
        console.log(users);
    });

    socket.on('userAuth', (data) => {
    })
});

server.listen(2060, function() {
    console.log('Listening on http://localhost:2060');
});