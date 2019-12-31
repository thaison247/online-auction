const db = require('../utils/db');

module.exports = {
    all: () => db.load('select * from sanpham'),
    allByCat: catId => db.load(`select * from sanpham where id_dm = ${catId}`),

    single: (id_sp, id_dm) => db.load(`select * from sanpham where id_sp = ${id_sp} and id_dm = ${id_dm}`),
    catName: (id_dm) => db.load(`select ten_dm from danhmuc where id_dm = ${id_dm}`),
    seller: (id_sp, id_dm) => db.load(`select u.ho_ten as ten_nguoi_ban from sanpham sp join user u on sp.nguoi_ban = u.id_user where sp.id_sp = ${id_sp} and sp.id_dm = ${id_dm}`),
    highestBidderAndPrice: (id_sp, id_dm) => db.load(`select u.ho_ten as highestBidder, l.so_tien as currentPrice
    from lichsu_ragia l join user u on l.bidder = u.id_user
    where l.id_sp = ${id_sp} and l.id_dm = ${id_dm} and l.so_tien = (select max(l1.so_tien)  
                                                        from lichsu_ragia l1
                                                        where l1.id_sp = l.id_sp and l1.id_dm = l.id_dm)
    order by l.thoi_diem asc limit 1`),

    currPrice: (id_sp, id_dm) => db.load(`select max(l.so_tien) as currentPrice from lichsu_ragia l where l.id_sp = ${id_sp} and l.id_dm = ${id_dm}`),

    add: entity => db.add('sanpham', entity),
    del: id => db.del('sanpham', {
        id_sp: id
    }),
    patch: entity => {
        const condition = {
            id_sp: entity.id_sp
        };
        delete entity.id_sp;
        return db.patch('sanpham', entity, condition);
    },

    allByCatWithInfo: id => db.load(`select sp.id_sp, sp.id_dm, sp.ten_sp, sp.gia_khoi_diem, sp.gia_mua_ngay, sp.tg_dang, sp.tg_het_han, T.highest, T.num_of_bids
    from sanpham sp left join
    (select sp2.id_sp, sp2.id_dm, sp2.ten_sp, sp2.gia_khoi_diem, sp2.tg_dang, max(ls.so_tien) as highest, count(*) as num_of_bids
    from (sanpham sp2 join lichsu_ragia ls on sp2.id_sp = ls.id_sp and sp2.id_dm = ls.id_dm)
    group by sp2.id_sp, sp2.id_dm, sp2.ten_sp, sp2.gia_khoi_diem) as T on T.id_sp = sp.id_sp and T.id_dm = sp.id_dm
    where sp.id_dm = ${id}`)
};