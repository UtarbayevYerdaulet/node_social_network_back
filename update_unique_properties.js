const fs = require("fs")
const searchSmooth = 60


function getUniqueProperties (itemsArr){
    let obj = {}
    for(let item of itemsArr){
        for(let key in item){
            if(!Object.keys(obj).includes(key)) {obj[key] = []}
            
            if(!obj[key].includes(item[key])) {obj[key].push(item[key])}
        }
    }
    return obj
  }

function saveUniqueProperties(){
    const goods = JSON.parse(Buffer.from(fs.readFileSync("dataBase/dataSet.json").toString("utf-8")))
    const amazonGoods = goods.amazon
    const uniqueProperties = getUniqueProperties(amazonGoods)

    for(const key in uniqueProperties){
        fs.writeFileSync(`storage/unique_property_${key}_file.json`, JSON.stringify(uniqueProperties))
    }

    
}

saveUniqueProperties()
setInterval(() => saveUniqueProperties(), 1 * 60 * 60 * 1000)

