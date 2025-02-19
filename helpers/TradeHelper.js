class TradeHelper {
    constructor() { }
    static onTradeListReceived(data, user) {
        let strIndex = data.indexOf("tl")
        if (strIndex != -1) {
            data = data.slice(strIndex)
            data.unshift("tl");
        }
        data.shift()
        let finalObj = [];
        let i = 0;
        let numDenItems = 0;
        let id = null;
        let color = null;
        let invIdx = null;
        let isApproved = false;
        let uniqueImageId = null;
        let uniqueImageCreator = null;
        let numPetItems = 0;
        let createdTs = NaN;
        let lBits = 0;
        let uBits = null;
        let eBits = null;
        let petName = null;
        let traitDefId = null;
        let toyDefId = null;
        let foodDefId = null;
        const userName = data[2];
        let j = 2;
        //console.log(userName);
        if (user.toLowerCase() === userName.toLowerCase()) throw new Error("Cannot check own Trade list!");
        else {
            j++;
            const numClothingItems = data[j]
            //console.log(numClothingItems);
            for (i = 0; i < numClothingItems; i++) {
                j++;
                id = data[j]
                //console.log(id)
                j++;
                invIdx = data[j]
                j++;
                color = data[j]
                if (!constants.c.file.hasOwnProperty(id)) continue;
                finalObj.push({ type: "c", id: id, color: color, name: constants.c.file[id].name });
            }
            j++;
            numDenItems = parseInt(data[j])
            //console.log(numDenItems)
            for (i = 0; i < numDenItems; i++) {
                j++;
                id = data[j];
                j++;
                invIdx = data[j];
                j++;
                color = data[j]
                j++;
                isApproved = data[j] == "true";
                j++;
                uniqueImageId = data[j];
                j++;
                uniqueImageCreator = data[j];
                j++;
                if (!constants.d.file.hasOwnProperty(id)) continue;
                finalObj.push({ type: "d", id: id, name: constants.d.file[id].name });
            }
            j++;
            numPetItems = parseInt(data[j])
            //console.log(numPetItems)
            for (i = 0; i < numPetItems; i++) {
                j++;
                id = data[j]
                j++;
                invIdx = data[j]
                j++;
                createdTs = data[j];
                j++;
                lBits = parseInt(data[j])
                j++;
                uBits = data[j]
                j++;
                eBits = data[j]
                j++;
                petName = data[j];
                j++;
                traitDefId = data[j]
                j++;
                toyDefId = data[j]
                j++;
                foodDefId = data[j]
                if (!constants.p.file.hasOwnProperty(getDefIdFromLBits(lBits))) continue;
                finalObj.push({ type: "p", id: getDefIdFromLBits(lBits), name: constants.p.file[getDefIdFromLBits(lBits)].name })
            }
            return [userName, finalObj];
        }
    }
    static onPetListRecieved(data, user) {
        let strIndex = data.indexOf("pl")
        if (strIndex != -1) {
            data = data.slice(strIndex)
            data.unshift("pl");
        }
        let finalObj = [];
        let id = null;
        let lBits = 0;
        const userName = data[4];
        let j = 2;
        let i = 0;
        //console.log(userName);
        if (user.toLowerCase() === userName.toLowerCase()) throw new Error("Cannot check own Trade list!");
        else {
            j++
            j++
            j++
            var numPets = data[j];
            //console.log(numPets);
            for (i = 0; i < numPets; i++) {
                j++;
                j++;
                j++;
                j++;
                id = getDefIdFromLBits(parseInt(data[j]));
                //console.log(id)
                j++;
                j++;
                j++;
                j++;
                j++;
                j++;
                j++;
                if (!constants.p.file.hasOwnProperty(id)) continue;
                finalObj.push({ type: "p", id: id, name: constants.p.file[id].name })
            }
            //console.log(finalObj);
            return [userName, finalObj];
        }
    }
    static onItemListRecieved(data, user) {
        var finalObj = [];
        let strIndex = data.indexOf("il")
        if (strIndex != -1) data = data.slice(strIndex)
        const x = "c";
        const size = 3
        const offset = 9
        const count = 8
        const file = constants[x]["file"]
        if (data[5].toLowerCase() === user.toLowerCase()) throw new Error("Cannot check own Trade list!");
        for (let i = offset; i < offset + data[count] * size; i += size) {
            let id = data[i]
            //console.log(id)
            if (!file.hasOwnProperty(id)) continue;
            finalObj.push({ type: "c", id: id,color: data[i+2], name: file[id].name })
        }
        return [data[5].toLowerCase(), finalObj];
    }
}
module.exports = TradeHelper;
function getDefIdFromLBits(lBits) {
    return lBits & 255;
}
let constants = {
    d: {
        file: require('../DenItems.json')
    },
    p: {
        file: require('../Pets.json')
    },
    c: {
        file: require('../Clothing.json')
    },
}