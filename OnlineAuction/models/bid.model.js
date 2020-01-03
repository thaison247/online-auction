const db = require('../utils/db');

module.exports = {
    allByUser: (id_user) => db.load(`select * from 
    (select s.id_sp, s.id_dm, bidder, ten_sp, max(so_tien) as bidder_ragia
    from lichsu_ragia l join sanpham s on l.id_dm = s.id_dm and l.id_sp = s.id_sp where bidder = ${id_user}
    group by s.id_sp, s.id_dm, bidder, ten_sp) as T1
    join (select id_sp, id_dm, max(so_tien) as gia_cao_nhat from lichsu_ragia group by id_sp, id_dm) as T2
    on T1.id_dm = T2.id_dm and T1.id_sp = T2.id_sp
     `),
    countByUser: (id_user) => db.load(`select count(*) as so_sp from (select distinct id_dm, id_sp from lichsu_ragia where bidder = ${id_user}) as T`),
    // totalPrice: (id_user) => db.load(`select sum(s.gia_mua_ngay) as tong_tien from gio_hang g join sanpham s on g.danh_muc = s.id_dm and g.san_pham = s.id_sp where nguoi_mua = ${id_user}
    // `),
    // numberOfProducts: async id_user => {
    //     const row = await db.load(`select count(*) as so_don_hang from gio_hang where nguoi_mua = '${id_user}'`);
    //     if (row.length === 0)
    //         return 0;
    //     return row[0].so_don_hang;
    // },
    add: entity => db.add('lichsu_ragia', entity),
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