const db = require('../utils/db');

module.exports = {
    acceptedReq: () => db.load(`select * from yeucau_nangcap where da_nang_cap = 1`),
    unacceptedReq: () => db.load(`select * from yeucau_nangcap where da_nang_cap = 0`),

    add: entity => db.add('yeucau_nangcap', entity),
};