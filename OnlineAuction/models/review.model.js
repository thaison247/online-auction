const db = require('../utils/db');

module.exports = {
    allByUser: (id_user) => db.load(`SELECT u.ho_ten as nguoi_danh_gia, d.nhan_xet, d.danh_gia, d.thoi_diem FROM mydb.danhgia d join user u on d.nguoi_danh_gia = u.id_user
                                    where nguoi_duoc_danh_gia = ${id_user}`),
    // countByUser: (id_user) => db.load(`select count(*) as so_sp from (select distinct id_dm, id_sp from lichsu_ragia where bidder = ${id_user}) as T`),
    countGoodReviews: (id_user) => db.load(`select count(*) as diem_tot from danhgia where danh_gia = 1 and nguoi_duoc_danh_gia = ${id_user}`),
    countBadReviews: (id_user) => db.load(`select count(*) as diem_xau from danhgia where danh_gia = 0 and nguoi_duoc_danh_gia = ${id_user}`),
    add: entity => db.add('danhgia', entity),
    // del: (id_sp, id_dm, nguoi_mua) => db.del('gio_hang', {
    //     nguoi_mua: nguoi_mua,
    //     danh_muc: id_dm,
    //     san_pham: id_sp
    // }),
    // patch: entity => {
    //     const condition = {
    //         nguoi_mua: entity.nguoi_mua,
    //         danh_muc: entity.danh_muc,
    //         san_pham: entity.san_pham
    //     };
    //     delete entity.nguoi_mua;
    //     delete entity.danh_muc;
    //     delete entity.san_pham;
    //     return db.patch('gio_hang', entity, condition);
    // },
};