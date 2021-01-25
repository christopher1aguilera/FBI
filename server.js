const express = require('express')
const app = express()
const secretKey = 'Mi Llave Ultra Secreta'

const users = require('./data/agentes.js')
app.listen(3003, () => console.log('Servidor encendido en el puerto 3003'))
const jwt = require("jsonwebtoken")


app.get('/', (req, res) =>{
    res.sendFile(__dirname + '/index.html')
  })  

app.get("/SignIn", (req, res) => {
    const { email, password } = req.query;
    const user = users.results.find((u) => u.email == email && u.password ==
    password);
    if (user) {
    const token = jwt.sign(
    {
    exp: Math.floor(Date.now() / 1000) + 300,
    data: user,
    },
    secretKey
    );
    res.send(`
    <a href="/Dashboard?token=${token}"> <p> Ir al Dashboard </p> </a>
    Bienvenido, ${email}.
    <script>
    sessionStorage.setItem('token', JSON.stringify("${token}"))
    </script>
    `);
    } else {
    res.send("Usuario o contraseña incorrecta");
    }
    });


app.get("/Dashboard", (req, res) => {
    let { token } = req.query;
    jwt.verify(token, secretKey, (err, decoded) => {
    err
    ? res.status(401).send({
    error: "401 Unauthorized",
    message: err.message,
    })
    : res.send(`
    Bienvenido al Dashboard ${decoded.data.email}
    <script>
    localStorage.setItem('email', "${decoded.data.email}")
    </script>
    `);
    });
    });