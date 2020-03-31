const moment = require("moment");

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

module.exports = function simplifyItemStats(item) {
    let totalSold = 0;
    let soldByMostPopularPrice = {}; //Will use to calculate weighted average and most popular price

    Object.keys(item).forEach(day => {
        const current = item[day];
        totalSold += current.ca;

        soldByMostPopularPrice[current.m] != undefined ?
            soldByMostPopularPrice[current.m] += current.c :
            soldByMostPopularPrice[current.m] = current.c
    });

    let mostPopularPrice = 
        parseInt(getKeyByValue(
            soldByMostPopularPrice, 
            Math.max(...Object.values(soldByMostPopularPrice))
        ));
    let soldForMostPopularPrices = 
        Object.values(soldByMostPopularPrice)
        .reduce((acc, curr) => acc += curr);

    /** Weighted average of most popular prices */
    let mostPopularPriceAvg = 
            Object.keys(soldByMostPopularPrice)
            .reduce((acc, curr) => {
                return acc + parseInt(curr) * soldByMostPopularPrice[curr]
            }, 0)
            / soldForMostPopularPrices;
    mostPopularPriceAvg = Math.floor(mostPopularPriceAvg);

    let todayStringDate = moment().format("DD-MM-YYYY");
    let todaysMostPopularPrice = item[todayStringDate].m || null;

    let soldTodayForMostPopularPrice = item[todayStringDate].c || null;
    let soldToday = item[todayStringDate].ca || null;

    return {
        totalSold,
        mostPopularPrice,
        soldForMostPopularPrices,
        mostPopularPriceAvg,
        todaysMostPopularPrice,
        soldTodayForMostPopularPrice,
        soldToday
    }
}