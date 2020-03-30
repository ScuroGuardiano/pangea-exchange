const express = require("express");
const Cache = require("./cache");
const simplifyItemStats = require("./simplify-item-stats");

const app = express();
const nicolasCache = new Cache(6 * 3600 * 1000);

const PORT = parseInt(process.env.PORT) || 3000;
const HOST = process.env.HOST || "0.0.0.0";

app.use((req, res, next) => {
    res.setHeader("X-Powered-By", "Twój Stary Pijany");
    next();
});

/**
 * Raw output from https://pangeayt2.eu/offshop_exchange_stat.php  
 * Basically it's proxy
 */
app.get("/raw", async (req, res) => {
    try {
        const data = await nicolasCache.getWithCache("https://pangeayt2.eu/offshop_exchange_stat.php");
        return res.status(200).json(data);
    }
    catch(err) {
        return res.status(500).json({error: err.toString()});
    }
});

/**
 * Will calculate most popular, average and sold items from 7 days, much smaller json size
 */
app.get("/optimized", async(req, res) => {
    try {
        const items = await nicolasCache.getWithCache("https://pangeayt2.eu/offshop_exchange_stat.php");
        const optimized = {};
        Object.keys(items)
            .forEach(item => optimized[item] = simplifyItemStats(items[item]));
        return res.json(optimized);
    }
    catch(err) {
        return res.status(500).json({error: err.toString()});
    }
});



app.listen(PORT, HOST, () => {
    console.log(`App is listening on ${HOST}:${PORT}.`);
});
