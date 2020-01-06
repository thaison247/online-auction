const db = require('../utils/db');

module.exports = {
    all: () => db.load(`SELECT * FROM yeucau_nangcap y join user u on y.nguoi_gui = u.id_user where da_chap_nhan = 0`),
    // countByUser: (id_user) => db.load(`select count(*) as so_sp from (select distinct id_dm, id_sp from lichsu_ragia where bidder = ${id_user}) as T`),
    countGoodReviews: (id_user) => db.load(`select count(*) as diem_tot from danhgia where danh_gia = 1 and nguoi_duoc_danh_gia = ${id_user}`),
    countBadReviews: (id_user) => db.load(`select count(*) as diem_xau from danhgia where danh_gia = 0 and nguoi_duoc_danh_gia = ${id_user}`),
    add: entity => db.add('danhgia', entity),
    del: (id_req) => db.del('yeucau_nangcap', {
        id_req: id_req
    }),
    patch: entity => {
        const condition = {
            id_req: entity.id_req
        };
        // delete entity.nguoi_gui;
        return db.patch('yeucau_nangcap', entity, condition);
    },
};