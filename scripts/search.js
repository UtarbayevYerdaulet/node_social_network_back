function searchHandler (searchString, goods, limit, smooth) {
    let start_date = new Date();
    
    // const items_copy = [...items];
    // const items_copy = items.map(element => element);

    const items_copy = JSON.parse(JSON.stringify(goods));
  
    
    const searchStr = searchString.toLowerCase().replaceAll(' ', '');
    const resulted_items = [];
  
    for(let item of items_copy) {
        for(let i = 0; i < searchStr.length; i++){
            if(!item['count']) item['count'] = 0;
  
            if(item.product_name.toLowerCase().replaceAll(' ', '').includes(searchStr[i])) {  
                item['count']++;
            }
        }
  
        if(!item['percent']) item['percent'] = 0.0;
        item.percent = (item.count / searchStr.length) * 100;
        
        if(item.percent >= smooth) {
            resulted_items.push(item)
        }
    }
  
    resulted_items.sort((item, next) => {
      if (item.percent < next.percent) {
        return 1;
      }
      if (item.percent > next.percent) {
        return -1;
      }
      return 0;
    });
  
    let end_date = new Date();
  
    console.log(end_date - start_date)
  
    return resulted_items.slice(0, limit);
}

module.exports = searchHandler;