// // const meter_relation = require("./sam.json")
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const cors = require('cors')
const { pool } = require("../config/config")
router.use(cors())
router.use(cors());
router.use(bodyParser.json());

exports.get_treestructure = async (req, res) => {
    try {
        const company_id = req.body.c_id
        let meter_relation = await pool.query(`SELECT * FROM sch_mstr_data.meter_relationship WHERE c_id='${company_id}'`)
        meter_relation=meter_relation.rows
        // console.log(meter_relation);
        for (let i = 0; i < meter_relation.length; i++) {
            const item = meter_relation[i];
          
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
                    item.p33 = rawDataItem.p33;
        
                    const current_date = new Date();
                    const timeDifference = current_date - item.last_updated_dttm;
                    const hoursDifference = timeDifference / (1000 * 60 * 60);
        
                    if (hoursDifference < 1) {
                        item.status = "on";
                    } else {
                        item.status = "E1";
                    }
                }
            } catch (error) {
                console.error(`Error fetching data for slave_id '${mData}': ${error}`);
                // Handle the error or continue the loop as needed.
            }
        }
        
            console.log(meter_relation);
          
            const tree = [];
            const nodeMap = {};

            for (let i = 0; i < meter_relation.length; i++) {
                const item = meter_relation[i];
                const newNode = { name: item.slave_name, children: [] };

                if (item.parent_id === "root_node") {
                    tree.push(newNode);
                } else {
                    const parentNode = nodeMap[item.parent_id];
                    if (parentNode) {
                        parentNode.children.push(newNode);
                    }
                }

                nodeMap[item.slave_id] = newNode;
            }



            const updateJSON = (data) => {
                data.forEach((node) => {


                    if (node.children && node.children.length === 0) {
                        // node.value = 0;
                        delete node.children;
                        if (node.value == 0) {
                            node.lineStyle = {
                                color: 'red',
                            };
                            node.itemStyle = {
                                borderColor: 'red'
                            };
                        }
                        else {
                            node.value = [
                                { KW: 0 },
                                { A: 0 },
                                { PF: 0 }, // Initialize these values with 0 or null
                                { SS: 0 },
                            ];

                            // Loop through meter_relation to find the corresponding data
                            for (let i = 0; i < meter_relation.length; i++) {
                                if (node.name === meter_relation[i].slave_name) {
                                    node.value[0].KW = meter_relation[i].p32;
                                    node.value[1].A = meter_relation[i].p33;
                                    node.value[2].PF = meter_relation[i].p10;
                                    node.value[3].SS = meter_relation[i].status;
                                }
                            }

                        }
                    }
                    if (node.children && node.children.length > 0) {
                        updateJSON(node.children);
                    }

                });
            };

            updateJSON(tree);

            res.send(JSON.stringify(tree, null, 2));
        } catch (error) {
            console.log(error);
            res.status(400).send({ "error": error })
        }
    }




