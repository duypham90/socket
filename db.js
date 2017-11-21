const pg = require('pg');
const config = {
  user: 'vwgghiedqzfjey',
  database: 'd63u3bpcv3qpdd',
  password: 'c5ca4831518991d7b5c3f5c79677246e1b6096455b97a47e8261e4f5b0544ba5',
  host: 'ec2-54-83-49-44.compute-1.amazonaws.com',
  port: 5432,
  max: 5,
  ssl: true,
  idleTimeoutMillis: 10000
};

const pool = new pg.Pool(config);

function queryDB(sql, arrayData) {
    return new Promise((resolve, reject) => {
        pool.connect((err, client, done) => {
            if (err) return reject(err);
            client.query(sql, arrayData, (queryErr, result) => {
                done(queryErr);
                if (queryErr) return reject(queryErr);
                resolve(result);
            });
        });
    });
}
const getHotGirlByID = id => (
    queryDB('select * from "HotGirl" where id = $1', [id])
    .then(result => result.rows[0])
);
const hitLike = id => (
    queryDB('update "HotGirl" set likes = likes +1 where id =$1',[id])
);
const disLike = id => (
    queryDB('update "HotGirl" set dislikes = dislikes + 1 where id =$1',[id])
);
module.exports = { getHotGirlByID, hitLike, disLike };
// getHotGirlByID(1)
// .then(result => console.log(result));

