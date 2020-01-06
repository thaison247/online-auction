const db = require('../utils/db');

module.exports = {
    all: () => db.load('select * from user'),
    allWithoutAd: () => db.load('select * from user where phan_he <> 3 and da_xoa = 0'),
    single: id => db.load(`select * from user where id_user = ${id}`),
    add: entity => db.add('user', entity),
    del: id => db.del('user', {
        id_user: id
    }),
    getName: async (id) => {
        const row = await db.load(`select ho_ten from user where id_user = ${id}`);
        return row[0].ho_ten;
    },
    singleByEmail: email => db.load(`select * from user where email = '${email}'`),
    patch: entity => {
        const condition = {
            id_user: entity.id_user
        };
        delete entity.id_user;
        return db.patch('user', entity, condition);
    },

    addRejectUser: (entity) => db.add('cam_bidder', entity),

    isRejected: async (id_user, id_dm, id_sp) => {
        const row = await db.load(`select count(*) as exist from cam_bidder where bidder = ${id_user} and danh_muc = ${id_dm} and san_pham = ${id_sp}`);
        return row[0].exist;
    }


};