const fs = require("fs")

function filter(key, value, goods, limit){
    const fileName = `unique_property_${key}_file.json`;
    const dir_name = 'storage';
    const file_path = `${dir_name}/${fileName}`;
    const filesName = fs.readdirSync(dir_name);

    if(!filesName.includes(fileName)) return "key is not defined"
    const result = []
    const funcRes = JSON.parse(Buffer.from(fs.readFileSync(file_path)).toString('utf-8'))

    
    if(!funcRes[key].includes(value)) return "value is not defined"

    for(const good of goods){
        if(good[key] === value) result.push(good)
        else if(result.length >= limit) break
}

  return result
}

module.exports = filter;