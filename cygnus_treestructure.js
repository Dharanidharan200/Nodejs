const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const cors = require('cors')
const pool = require("../connection/connection")
router.use(cors())
router.use(cors());
router.use(bodyParser.json());

//new tree strcuture
exports.get_treestructure = async (req, res) => {
    try {
        const company_id = req.body.c_id
        let meter_relation = await pool.query(`SELECT * FROM sch_mstr_data.meter_relationship WHERE c_id='${company_id}'`)
        meter_relation = meter_relation.rows
        let finaldata = [];
        for (let i = 0; i < meter_relation.length; i++) {
            item = meter_relation[i];

            const mData = item.slave_id;


            try {
                const raw_data = await pool.query(
                    `SELECT * FROM sch_raw_data.data_rt_raw_t1 WHERE slave_id='${mData}' ORDER BY mfm_read_time DESC LIMIT 1`
                );

                const rawDataItem = raw_data.rows[0];

                if (rawDataItem) {
                    item.last_updated_dttm = rawDataItem.mfm_read_time;
                    item.p10 = rawDataItem.p10;
                    item.p32 = rawDataItem.p32;
                    item.p4 = rawDataItem.p4;

                    const current_date = new Date();
                    const timeDifference = current_date - item.last_updated_dttm;
                    const hoursDifference = timeDifference / (1000 * 60 * 60);

                    if (hoursDifference < 1) {
                        item.status = "on";
                    } else {
                        item.status = "E1";
                    }
                }
                finaldata.push(item)

            } catch (error) {
                console.error(`Error fetching data for slave_id '${mData}': ${error}`);
                // Handle the error or continue the loop as needed.
            }
        }

        //Tree Strcutre function
        const buildTreeFlat = (data, parent_id) => {
            const result = [];

            for (const item of data) {
                if (item.parent_id == parent_id || (item.parent_id == 'root-node' && parent_id == null)) {
                    const node = {
                        name: `${item.slave_name}`,
                        id: item.slave_id
                    };

                    // Check if the node has already been processed to avoid infinite recursion
                    const alreadyProcessed = result.some(existingNode => existingNode.id === node.id);
                    if (!alreadyProcessed) {
                        const children = buildTreeFlat(data, item.slave_id);
                        if (children.length > 0) {
                            node.children = children;
                        } else {
                            node.value = [
                                { KW: item.p32 },
                                { A: item.p4 },
                                { PF: item.p10 },
                                { SS: item.status }
                            ];
                        }

                        result.push(node);
                    }
                }
            }

            return result;
        };

        const resultFlat = buildTreeFlat(finaldata, null);

        res.send(JSON.stringify(resultFlat, null, 2))
    } catch (error) {
        console.log(error);
        res.status(400).send({ "error": error })
    }

}

