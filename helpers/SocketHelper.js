const crypto = require('crypto');
const tls = require('tls');
const FileHelper = require('./FileHelper');
const TradeHelper = require('./TradeHelper');
const ItemFormatter = require('./ItemFormatter');
const fs = require('fs');
class SocketHelper {
    #username;
    #token;
    #server;
    #deployVersion
    #reconnect = false;
    #socket;
    constructor(username, token, server, deployVersion, reconnect = false, filePath) {
        this.#username = username;
        this.#token = token;
        this.#server = server;
        this.#deployVersion = deployVersion;
        this.#reconnect = reconnect;
        this.fh = new FileHelper(filePath);
        this.outputName = `AJTR-OUTPUT-${new Date().getTime()}.txt`
    }
    start(u1 = null, t1 = null, s1 = null, d1 = null) {
        var u = this === undefined ? u1 : this.#username;
        var t = this === undefined ? t1 : this.#token;
        var d = this === undefined ? d1 : this.#deployVersion;
        var s = this === undefined ? s1 : this.#server;
        this.#socket = tls.connect({ host: this.#server || s1, port: 443, rejectUnauthorized: false });
        var socket = this.#socket;
        var fh1 = this.fh;
        var outFile = this.outputName;
        var userName = this.#username;
        const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));
        try {
            this.#socket.on('secureConnect', () => {
                connected = true
                socket.write(`<msg t='sys'><body action='rndK' r='-1'></body></msg>\x00`);
            });
            var sentDJ = false;
            var ready = false;
            var userId = -1;
            var connected = false;
            this.#socket.on('data', async function (data) {
                data = data.toString();
                console.log(data);
                if (data.includes(`<msg t='sys'><body action='rndK' r='-1'><k>`)) {
                    var loginTag = `<login z="sbiLogin"><nick><![CDATA[${u}%%0%${d}%electron%1.4.3%WIN%0]]></nick><pword><![CDATA[${t}]]></pword></login>`;
                    var hash = Buffer.from(crypto.createHmac('sha256', data.split("<k>")[1].split("</k>")[0]).update(loginTag).digest()).toString("base64");
                    socket.write(`<msg t='sys' h="${hash}"><body action="login" r="0">${loginTag}</body></msg>\x00`);
                }
                if (data.includes("\"b\":") && !sentDJ) {
                    data = data.substr(0, data.lastIndexOf('xt"}')) + "xt\"}"
                    userId = JSON.parse(data).b.o.userId;
                    socket.write(`%xt%o%dj%0%den${u}%1%-1%\x00`);
                    sentDJ = true;
                }
                if (data.includes("%xt%rj%") && sentDJ) {
                    console.log("Bot is ready!")
                    ready = true
                    let lineNumber = 1;
                    let currentLine;
                    while ((currentLine = fh1.next()) !== null) {
                        var corrected = currentLine.replace(/[^a-zA-Z0-9]/g, '');
                        socket.write(`%xt%o%refa%0%${corrected}%\x00`);
                        await snooze(800)
                        socket.write(`%xt%o%pl%0%${corrected}%\x00`);
                        socket.write("%xt%o%ag%0%" + corrected + "%1%\x00");
                        await snooze(800)
                        lineNumber++;
                        await snooze(1800)
                    }
                    await snooze(2500)
                    console.log("done.")
                }
                if (data.includes("%xt%tl%") && ready) {
                    let arr = data.split('%');
                    if (arr.length > 8) {
                        let tradeData = TradeHelper.onTradeListReceived(arr, userName);
                        var tradeFormatted = ItemFormatter.formatItems(tradeData[0], tradeData[1]) + `\n${tradeData[0]}-------------------------------------------------\n`;
                        fs.writeFileSync("out/"+outFile, tradeFormatted, { flag: "a+" })
                        //console.log(tradeData);
                    }
                }
                if (data.includes("%xt%pl%") && ready) {
                    let arr = data.split('%');
                    if (arr.length > 6) {
                        let tradeData = TradeHelper.onPetListRecieved(arr, userName);
                        var tradeFormatted = ItemFormatter.formatPetsWithCounts(tradeData[0], tradeData[1]) + `\n${tradeData[0]}-------------------------------------------------\n`;
                        fs.writeFileSync("out/"+outFile, tradeFormatted, { flag: "a+" })
                        //console.log(tradeData);
                    }
                }
                if (data.includes("%xt%ag%")) { let arr = data.split('%'); socket.write("%xt%o%ad%0%" + arr[4] + "%" + arr[10] + "%1%\x00") };
                if (data.includes("%xt%il%") && ready && !data.includes(userName)) {
                    let arr = data.split('%');
                    if (arr.length > 6) {
                        try {
                            let tradeData = TradeHelper.onItemListRecieved(arr, userName);
                            var tradeFormatted = ItemFormatter.formatItemsList(tradeData[0], tradeData[1]) + `\n${tradeData[0]}-------------------------------------------------\n`;
                            fs.writeFileSync("out/"+outFile, tradeFormatted, { flag: "a+" })
                            //console.log(tradeData);
                        } catch { }
                    }
                }
            })
            this.#socket.on('close', async function () { console.log("Socket Closed!"); });
            this.#socket.on('error', function (e) { console.log(`Error! ${e}`); socket.end(); });
        }
        catch (error) {
            console.log(`Error : ${error}`);
        }
    }

    send(data) {
        this.#socket.write(`${data}\x00`);
    }
    splitTextIntoChunks(text, chunkSize) {
        const words = text.split(' ');
        const chunks = [];
        let currentChunk = '';

        for (let i = 0; i < words.length; i++) {
            const word = words[i];

            if (currentChunk.length + word.length <= chunkSize) {
                currentChunk += (currentChunk ? ' ' : '') + word;
            } else {
                chunks.push(currentChunk);
                currentChunk = word;
            }
        }

        if (currentChunk) {
            chunks.push(currentChunk);
        }

        return chunks;
    }

}
module.exports = SocketHelper;