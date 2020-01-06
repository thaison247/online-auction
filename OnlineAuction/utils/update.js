const cron = require('cron');
// const email = require('./email');
const productModel = require('../models/product.model');
// const userModel = require('../models/user.model');


const Update = async () => {
    const update = await Promise.all([
        productModel.update()
    ])
}


const job = new cron.CronJob({
    cronTime: '20 * * * * *',
    onTick: function () {
        console.log('Cron jub runing...');
        Update();
    },
    start: true,
    timeZone: 'Asia/Ho_Chi_Minh'
});

module.exports = job;