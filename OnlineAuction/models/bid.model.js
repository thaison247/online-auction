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

    getPriceByUser: async (id_user, id_dm, id_sp) => {
        const row = await db.load(`select max(so_tien) as price from lichsu_ragia
            where bidder = ${id_user} and id_dm = ${id_dm} and id_sp = ${id_sp}`);
        return row[0].price;
    },

    wonList: (id_user) => db.load(`select s.id_sp, s.id_dm, s.gia_khoi_diem, ten_sp, so_tien as bidder_ragia
                                    from sanpham s join lichsu_ragia ls on s.id_dm = ls.id_dm and s.id_sp = ls.id_sp
                                    where s.het_han = 1 and ls.bidder = ${id_user} and ls.so_tien = (select max(ls2.so_tien) from lichsu_ragia ls2 where ls2.id_dm = ls.id_dm and ls2.id_sp = ls.id_sp)`),

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