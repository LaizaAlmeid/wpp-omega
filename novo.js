const qrcode = require('qrcode-terminal');

const { Client, LocalAuth } = require('whatsapp-web.js');

const AuthMidleware = require("./app/Midlewares/AuthMidleware");
const LoginController = require("./app/Controllers/LoginController");

const ejs = require("ejs");
const path = require("path");

const axios = require("axios");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(morgan("dev"));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.json());
app.use(cors());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "view"));

const ip = require('ip');
const ipAddress = ip.address();

const port = process.env.PORT || 3001;
app.listen(port, () => {
    var host = host
    console.log("Express iniciado em: "+ ipAddress +":"+port);
});

app.post("/login", LoginController.index);

app.get('/', function (req, res) {
    res.send('API ESTA FUNCIONANDO!')
  })


app.post("/EnviarMensagem", AuthMidleware, (req, res) => {
    var texto = req.body;
    var FoneEdit1;
    var FoneEdit2;

    //CASO NAO EXISTA UM BODY RETORNA ERRO 400
    if (!req.body) return res.status(400).end();

    let length = texto.result.ParaNumero.length;
    const base64Image = texto.result.img;
    const base64Pdf = texto.result.pdf;
    
//VERIFICA A VALIDADE DO NUMERO E FORMATA
    if (length == 16) {
        let Fone = texto.result.ParaNumero;
        FoneEdit1 = Fone.substring(7, 11);
        FoneEdit2 = Fone.substring(12, 16);

//MENSAGEM SIMPLES
        if (base64Image.length <= 0 && base64Pdf.length <= 0) {
            client.sendMessage(
                "5585" + FoneEdit1 + FoneEdit2 + "@c.us",
                texto.result.mensagem
            );
        }
//MENSAGEM & IMAGEM
        if (base64Image.length > 0) {
            var receivedImg
            const mediaImg = new MessageMedia("image/png", base64Image);

            client.sendMessage(
                "5585" + FoneEdit1 + FoneEdit2 + "@c.us",
                mediaImg,
                { caption: texto.result.mensagem }
            );
            receivedImg = 1
        }
//MENSAGEM PDF
        if (base64Pdf.length > 0) {
            var receivedPdf 
            const mediaPdf = new MessageMedia("application/pdf", base64Pdf, texto.result.filename);

            client.sendMessage(
                "5585" + FoneEdit1 + FoneEdit2 + "@c.us",
                mediaPdf
            );
            receivedPdf = 1
        }
    }
    //NUMERO INVÁLIDO
    if (length != 16) {
        return res.status(200).json({
            result: {
                mensag: "null",
                para: "null",
            },
        });
    }

    // client.sendMessage(
    //     texto.result.ParaNumero + "@c.us",
    //     texto.result.mensagem
    // );

    console.log('A mensagem "' + texto.result.mensagem + '" foi enviada para 5585' + FoneEdit1 + FoneEdit2 );
    //RESPONDE A PROPRIA MENSAGEM
    return res.status(200).json({
        result: {
            mensagem: texto.result.mensagem,
            para: texto.result.ParaNumero,
            img: receivedImg,
            pdf: receivedPdf,
        },
    });
    //return res.json(texto.result.mensagem)
});



// Inicio
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true }
});
 

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('authenticated', (session) => {    
    // Save the session object however you prefer.
    // Convert it to json, save it to a file, store it in a database...
});

client.on('auth_failure', msg => {
    // Fired if session restore was unsuccessful
    console.error('AUTHENTICATION FAILURE', msg);
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', message => {
	if(message.body === '!ping') {
		message.reply('pong');
	}
});
 
client.initialize();
 