const db = require('../utils/db');

module.exports = {
    allByUser: (id_user) => db.load(`select T1.id_dm,T1.id_sp,ten_sp,gia_cao_nhat,bidder, bidder_ragia, gia_khoi_diem from
    (select d.id_dm, d.id_sp, s.ten_sp, max(ls.so_tien) as gia_cao_nhat, s.gia_khoi_diem
    from (ds_yeuthich d join sanpham s on d.id_dm = s.id_dm and d.id_sp = s.id_sp) left join lichsu_ragia ls on d.id_dm = ls.id_dm and d.id_sp = ls.id_sp
    where d.id_user = ${id_user}
    group by d.id_dm, d.id_sp, s.ten_sp) as T1 left join (select d1.id_dm, d1.id_sp, ls1.bidder, max(ls1.so_tien) as bidder_ragia
                                                     from ds_yeuthich d1 join lichsu_ragia ls1 on d1.id_dm = ls1.id_dm and d1.id_sp = ls1.id_sp and ls1.bidder = ${id_user}
                                                     group by d1.id_dm, d1.id_sp, ls1.bidder) as T2
                                              on T1.id_dm = T2.id_dm and T1.id_sp = T2.id_sp
    
    
     `),

    single: (id_user, id_dm, id_sp) => db.load(`select * from ds_yeuthich where id_user = ${id_user} and id_dm = ${id_dm} and id_sp = ${id_sp}`),
    count: async (id_user, id_dm, id_sp) => {
        const row = await db.load(`select count(*) as result from ds_yeuthich where id_user = ${id_user} and id_dm = ${id_dm} and id_sp = ${id_sp}`);
        return row[0].result;
    },
    countByUser: (id_user) => db.load(`select count(*) as so_sp from (select distinct id_dm, id_sp from ds_yeuthich where id_user = ${id_user}) as T`),
    add: entity => db.add('ds_yeuthich', entity),

};