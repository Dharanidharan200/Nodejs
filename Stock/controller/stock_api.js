
var yahooFinance = require('yahoo-finance2').default;
var axios = require('axios');
const fs = require('fs')
exports.get_all_data = async (req, res) => {
    try {
        var data = await main()
        // data=JSON.parse(fs.readFileSync('data/top100.json', 'utf-8'));
        res.send(data)
    } catch (error) {
        console.log(error);
        res.send(error.message)
    }
}
async function main() {
    // var all_data = await fetchData();
    var all_data = await fetchData();
    return getStockData(all_data);

}
async function getStockData(symbols) {
    try {

        const dataToWrite = JSON.stringify(symbols, null, 2);

        fs.writeFileSync('data/stockData.json', dataToWrite);
        // var result = dataToWrite
        var result = await yahooFinance.quote(symbols);
        return result
    } catch (error) {
        console.error(error);
    }
}
async function fetchData() {
    try {
        var first_100_data=JSON.parse(fs.readFileSync('data/stockall_Data.json', 'utf-8'));
        const filteredData = first_100_data.filter(item => item.PPerchange > 0);
        const sortedDataDesc = filteredData.sort((a, b) => b.PPerchange - a.PPerchange);
        const slicedData = sortedDataDesc.slice(0, 100);
        let total_stock_names = [];
        for (let i = 0; i < slicedData.length; i++) {
            total_stock_names.push(`${slicedData[i].Sym}.NS`);
        }
        
        return total_stock_names;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
    
}
// async function fetchData() {
//     let total_stock_names = [];

//     var dataToSend = {
//         "data": {
//             "sort": "Mcap",
//             "sorder": "desc",
//             "count": 2457,
//             "params": [
//                 { "field": "OgInst", "op": "", "val": "ES" },
//                 { "field": "Exch", "op": "", "val": "NSE" }
//             ],
//             "fields": [
//                 "Isin", "DispSym", "Mcap", "Pe", "DivYeild", "Revenue", "Year1RevenueGrowth",
//                 "NetProfitMargin", "YoYLastQtrlyProfitGrowth", "EBIDTAMargin", "volume",
//                 "PricePerchng1year", "PricePerchng3year", "PricePerchng5year", "Ind_Pe",
//                 "Pb", "DivYeild", "Eps", "DaySMA50CurrentCandle", "DaySMA200CurrentCandle",
//                 "DayRSI14CurrentCandle", "ROCE", "Roe", "Sym", "PricePerchng1mon", "PricePerchng3mon"
//             ],
//             "pgno": 1
//         }
//     };

//     try {
//         var response = await axios.post('https://ow-scanx-analytics.dhan.co/customscan/fetchdt', dataToSend);
    
//         var first_100_data = response.data.data;
//         const filteredData = first_100_data.filter(item => item.PPerchange > 0);
//         const sortedDataDesc = filteredData.sort((a, b) => b.PPerchange - a.PPerchange);
//         const slicedData = sortedDataDesc.slice(0, 100);
//         let total_stock_names = [];
//         for (let i = 0; i < slicedData.length; i++) {
//             total_stock_names.push(`${slicedData[i].Sym}.NS`);
//         }
        
//         return total_stock_names;
//     } catch (error) {
//         console.error('Error fetching data:', error);
//     }
    
// }




