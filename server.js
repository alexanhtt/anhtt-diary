const http = require("http");
const fs = require("fs");
const path = require("path");
const https = require("https");

const PORT = process.env.PORT;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const diaryFile = "./data.json";

function sendTelegram(message) {
    if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT_ID) return;

    const data = JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message
    });

    const options = {
        hostname: "api.telegram.org",
        path: `/bot${TELEGRAM_TOKEN}/sendMessage`,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(data)
        }
    };

    const req = https.request(options);
    req.write(data);
    req.end();
}

function getDiary() {
    if (!fs.existsSync(diaryFile)) {
        fs.writeFileSync(diaryFile, JSON.stringify([]));
    }
    return JSON.parse(fs.readFileSync(diaryFile));
}

const server = http.createServer((req, res) => {

    if (req.url === "/") {
        const html = fs.readFileSync("./index.html");
        res.writeHead(200, {"Content-Type":"text/html"});
        res.end(html);

        sendTelegram("📔 Có người vừa mở trang nhật ký");
        return;
    }

    if (req.url === "/script.js") {
        const js = fs.readFileSync("./script.js");
        res.writeHead(200, {"Content-Type":"application/javascript"});
        res.end(js);
        return;
    }

    if (req.url === "/login" && req.method === "POST") {

        let body="";
        req.on("data",chunk=>body+=chunk);

        req.on("end",()=>{

            const {password} = JSON.parse(body);

            if(password===ADMIN_PASSWORD){
                res.end(JSON.stringify({success:true}));
            }else{
                res.end(JSON.stringify({success:false}));
            }

        });

        return;
    }

    if (req.url === "/diary") {

        const data = getDiary();

        res.writeHead(200, {"Content-Type":"application/json"});
        res.end(JSON.stringify(data));
        return;
    }

});

server.listen(PORT, () => {
    console.log("Server running on port", PORT);
});