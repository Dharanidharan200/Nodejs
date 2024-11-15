const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require('cors');
var axios = require('axios');
const fs = require('fs')
const all_nse_stocks = require('./routes/stock_api')


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept, Accept-Language, X-Authorization");
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
});

app.use(cors());

app.use(express.static(__dirname + "/public"));
app.get("/", async (req, res, next) => {
    res.sendFile(__dirname + "/public/index.html");

});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', all_nse_stocks);

const port = 5639;
setInterval(fetchData, 1000);

app.listen(port, () => {
    console.log("app running on port " + `${port}`)
})



async function fetchData() {
    let total_stock_names = [];

    var dataToSend = {
        "data": {
            "sort": "Mcap",
            "sorder": "desc",
            "count": 2457,
            "params": [
                { "field": "OgInst", "op": "", "val": "ES" },
                { "field": "Exch", "op": "", "val": "NSE" }
            ],
            "fields": [
                "Isin", "DispSym", "Mcap", "Pe", "DivYeild", "Revenue", "Year1RevenueGrowth",
                "NetProfitMargin", "YoYLastQtrlyProfitGrowth", "EBIDTAMargin", "volume",
                "PricePerchng1year", "PricePerchng3year", "PricePerchng5year", "Ind_Pe",
                "Pb", "DivYeild", "Eps", "DaySMA50CurrentCandle", "DaySMA200CurrentCandle",
                "DayRSI14CurrentCandle", "ROCE", "Roe", "Sym", "PricePerchng1mon", "PricePerchng3mon"
            ],
            "pgno": 1
        }
    };

    try {
        const response = await axios.post('https://ow-scanx-analytics.dhan.co/customscan/fetchdt', dataToSend);
        const first_100_data = response.data.data;
        fs.writeFileSync('data/stockall_Data.json', JSON.stringify(first_100_data, null, 2));
    
    } catch (error) {
        console.error('Error fetching data:', error);
    }

}