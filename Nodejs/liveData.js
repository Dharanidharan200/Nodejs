const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const cors = require('cors');
const { pool } = require("../config/config");
var CryptoJS = require("crypto-js");

router.use(cors());
router.use(bodyParser.json());

exports.post_clusterData = async (req, res) => {
    const company_id = req.body.c_id;

    try {
        const clusterdata = await pool.query(`SELECT * FROM sch_mstr_data.cluster_details where c_id='${company_id}'`);
        res.send(clusterdata.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};
exports.post_liveData = async (req, res) => {
    const company_id = req.body.c_id;
    const cluster = req.body.cluster;
    let final_data = []
    try {
        let query = "";

        if (cluster == 'off' || cluster == 'no_load') {
            query = await pool.query(`SELECT * FROM sch_mstr_data.meter_details where c_id='${company_id}' and status=1`);
        } else if (cluster == 'main') {
            query = await pool.query(`SELECT * FROM sch_mstr_data.meter_details where c_id='${company_id}' and meter_type='main'`);
        } else {
            query = await pool.query(`SELECT * FROM sch_mstr_data.meter_details where c_id='${company_id}' and cluster_id='${cluster}' and status=1`);
        }
        query = query.rows;
        console.log(query.length);

        const current_date = new Date();

        for (let i = 0; i < query.length; i++) {
            const item = query[i];
            const meterNo = item.slave_id;


            const raw_data = await pool.query(`SELECT * FROM sch_raw_data.data_rt_raw_t1 WHERE slave_id='${meterNo}' ORDER BY mfm_read_time DESC LIMIT 1`);
            const rawDataItem = raw_data.rows[0];
            // if(item.meter_type)
            console.log(item.meter_type, "metertype");

            //Change meter type name
            if (item.meter_type == 'main') {
                item.meter_type = "IcProfile";
            }
            else {
                item.meter_type = "IndividualProfile"
            }

            //encrpt slave id
            var encryptText = 'abcdeFGHIJKLMNOpqrstUVWXYz@*123789456#'
            var conversionEncryptOutput = CryptoJS.AES.encrypt(rawDataItem.slave_id.trim(), encryptText.trim()).toString();
            let node_id = conversionEncryptOutput.replace(/\//gi, "*")
            console.log(node_id);
            if (rawDataItem) {
                item.last_updated_dttm = rawDataItem.mfm_read_time;
                item.pf = rawDataItem.p10;
                item.vr = rawDataItem.p1;
                item.vy = rawDataItem.p2;
                item.vb = rawDataItem.p3;
                item.ir = rawDataItem.p4;
                item.iy = rawDataItem.p5;
                item.ib = rawDataItem.p6;
                item.kw = rawDataItem.p7;
                item.kva = rawDataItem.p8;
                item.kwh = rawDataItem.p32;
                item.kwh_export = rawDataItem.p33;
                item.kvah = rawDataItem.p30;
                item.freq = rawDataItem.p11;
                item.Date = rawDataItem.mfm_read_time.toLocaleDateString();
                item.Time = rawDataItem.mfm_read_time.toLocaleTimeString();
                item.node_id=node_id

                const timeDifference = current_date - item.last_updated_dttm;
                const hoursDifference = timeDifference / (1000 * 60 * 60);

                if (hoursDifference < 1) {
                    item.comm_status = 0;
                    item.status = 'on';
                } else {
                    item.comm_status = 1;
                    item.status = 'E1';
                }

                final_data.push(item);
            }
        }

        res.send(final_data);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};


