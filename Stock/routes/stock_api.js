const express = require("express");
const router = express.Router();

const data=require("../controller/stock_api")

router.get('/all_nse_stocks',data.get_all_data)



module.exports = router





