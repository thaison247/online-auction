const db = require("../utils/db");
const config = require("../config/default.json");

module.exports = {
    all: () => db.load("select * from sanpham"),
    allByCat: catId => db.load(`select * from sanpham where id_dm = ${catId}`),

    single: (id_sp, id_dm) =>
        db.load(
            `select * from sanpham where id_sp = ${id_sp} and id_dm = ${id_dm}`
        ),
    catName: id_dm =>
        db.load(`select ten_dm from danhmuc where id_dm = ${id_dm}`),
    seller: (id_sp, id_dm) =>
        db.load(
            `select u.ho_ten as ten_nguoi_ban from sanpham sp join user u on sp.nguoi_ban = u.id_user where sp.id_sp = ${id_sp} and sp.id_dm = ${id_dm}`
        ),
    // highestBidderAndPrice: (id_sp, id_dm) =>
    //     db.load(`select u.ho_ten as highestBidder, l.so_tien as currentPrice
    // from lichsu_ragia l join user u on l.bidder = u.id_user
    // where l.id_sp = ${id_sp} and l.id_dm = ${id_dm} and l.so_tien = (select max(l1.so_tien)  
    //                                                     from lichsu_ragia l1
    //                                                     where l1.id_sp = l.id_sp and l1.id_dm = l.id_dm)
    // order by l.thoi_diem asc limit 1`),
    countByCat: async catId => {
        const rows = await db.load(
            `select count(*) as total from sanpham where id_dm = ${catId}`
        );
        return rows[0].total;
    },
    pageByCat: (catId, offset) =>
        db.load(
            `select * from sanpham where id_dm = ${catId} limit ${config.paginate.limit} offset ${offset}`
        ),
    currPrice: (id_sp, id_dm) =>
        db.load(
            `select max(l.so_tien) as currentPrice from lichsu_ragia l where l.id_sp = ${id_sp} and l.id_dm = ${id_dm}`
        ),

    add: entity => db.add("sanpham", entity),
    del: id =>
        db.del("sanpham", {
            id_sp: id
        }),
    patch2: entity => {
        const condition1 = {
            id_dm: entity.id_dm,

        };
        const condition2 = {
            id_sp: entity.id_sp,
        }
        delete entity.id_sp;
        delete entity.id_dm;
        return db.patch("sanpham", entity, condition1, condition2);
    },

    allByCatWithInfo: (catId, offset) =>
        db.load(`select sp.id_sp, sp.id_dm, sp.ten_sp, sp.gia_khoi_diem, sp.gia_mua_ngay, sp.tg_dang, sp.tg_het_han, sp.het_han, T.highest, T.num_of_bids
                                from sanpham sp left join
                                (select sp2.id_sp, sp2.id_dm, sp2.ten_sp, sp2.gia_khoi_diem, sp2.tg_dang, max(ls.so_tien) as highest, count(*) as num_of_bids
                                from (sanpham sp2 join lichsu_ragia ls on sp2.id_sp = ls.id_sp and sp2.id_dm = ls.id_dm)
                                group by sp2.id_sp, sp2.id_dm, sp2.ten_sp, sp2.gia_khoi_diem) as T on T.id_sp = sp.id_sp and T.id_dm = sp.id_dm
                                where sp.id_dm = ${catId}
                                limit ${config.paginate.limit} offset ${offset}`),

    searchFor: (proName, catName, offset) =>
        db.load(`select * from
                                    (select sp.id_sp, sp.ten_sp , sp.id_dm
                                    from sanpham sp join danhmuc dm on sp.id_dm = dm.id_dm
                                    where match(sp.ten_sp) against('${proName}') and dm.ten_dm = "${catName}") as V
                                    join
                                    (select sp.id_sp, sp.id_dm, sp.ten_sp, sp.gia_khoi_diem, sp.gia_mua_ngay, sp.tg_dang, sp.tg_het_han, T.highest, T.num_of_bids
                                        from sanpham sp left join
                                        (select sp2.id_sp, sp2.id_dm, sp2.ten_sp, sp2.gia_khoi_diem, sp2.tg_dang, max(ls.so_tien) as highest, count(*) as num_of_bids
                                        from (sanpham sp2 join lichsu_ragia ls on sp2.id_sp = ls.id_sp and sp2.id_dm = ls.id_dm)
                                        group by sp2.id_sp, sp2.id_dm, sp2.ten_sp, sp2.gia_khoi_diem) as T on T.id_sp = sp.id_sp and T.id_dm = sp.id_dm
                                        ) as L
                                    on V.id_sp = L.id_sp and V.id_dm = L.id_dm
                                    limit ${config.paginate.limit} offset ${offset}`),

    searchWithAllCat: (proName, offset) =>
        db.load(`select * from
                                    (select sp.id_sp, sp.ten_sp , sp.id_dm
                                    from sanpham sp join danhmuc dm on sp.id_dm = dm.id_dm
                                    where match(sp.ten_sp) against('${proName}')) as V
                                    join
                                    (select sp.id_sp, sp.id_dm, sp.ten_sp, sp.gia_khoi_diem, sp.gia_mua_ngay, sp.tg_dang, sp.tg_het_han, T.highest, T.num_of_bids
                                        from sanpham sp left join
                                        (select sp2.id_sp, sp2.id_dm, sp2.ten_sp, sp2.gia_khoi_diem, sp2.tg_dang, max(ls.so_tien) as highest, count(*) as num_of_bids
                                        from (sanpham sp2 join lichsu_ragia ls on sp2.id_sp = ls.id_sp and sp2.id_dm = ls.id_dm)
                                        group by sp2.id_sp, sp2.id_dm, sp2.ten_sp, sp2.gia_khoi_diem) as T on T.id_sp = sp.id_sp and T.id_dm = sp.id_dm
                                        ) as L
                                    on V.id_sp = L.id_sp and V.id_dm = L.id_dm
                                    limit ${config.paginate.limit} offset ${offset}`),

    countSearchFor: async (proName, catName) => {
        const rows = await db.load(`select count(*) as total from
                                    (select sp.id_sp, sp.ten_sp , sp.id_dm
                                    from sanpham sp join danhmuc dm on sp.id_dm = dm.id_dm
                                    where match(sp.ten_sp) against('${proName}') and dm.ten_dm = "${catName}") as V
                                    join
                                    (select sp.id_sp, sp.id_dm, sp.ten_sp, sp.gia_khoi_diem, sp.gia_mua_ngay, sp.tg_dang, sp.tg_het_han, T.highest, T.num_of_bids
                                        from sanpham sp left join
                                        (select sp2.id_sp, sp2.id_dm, sp2.ten_sp, sp2.gia_khoi_diem, sp2.tg_dang, max(ls.so_tien) as highest, count(*) as num_of_bids
                                        from (sanpham sp2 join lichsu_ragia ls on sp2.id_sp = ls.id_sp and sp2.id_dm = ls.id_dm)
                                        group by sp2.id_sp, sp2.id_dm, sp2.ten_sp, sp2.gia_khoi_diem) as T on T.id_sp = sp.id_sp and T.id_dm = sp.id_dm
                                        ) as L
                                    on V.id_sp = L.id_sp and V.id_dm = L.id_dm`);
        return rows[0].total;
    },

    countSearchWithAllCat: async proName => {
        const rows = await db.load(`select count(*) as total from
                                    (select sp.id_sp, sp.ten_sp , sp.id_dm
                                    from sanpham sp join danhmuc dm on sp.id_dm = dm.id_dm
                                    where match(sp.ten_sp) against('${proName}')) as V
                                    join
                                    (select sp.id_sp, sp.id_dm, sp.ten_sp, sp.gia_khoi_diem, sp.gia_mua_ngay, sp.tg_dang, sp.tg_het_han, T.highest, T.num_of_bids
                                        from sanpham sp left join
                                        (select sp2.id_sp, sp2.id_dm, sp2.ten_sp, sp2.gia_khoi_diem, sp2.tg_dang, max(ls.so_tien) as highest, count(*) as num_of_bids
                                        from (sanpham sp2 join lichsu_ragia ls on sp2.id_sp = ls.id_sp and sp2.id_dm = ls.id_dm)
                                        group by sp2.id_sp, sp2.id_dm, sp2.ten_sp, sp2.gia_khoi_diem) as T on T.id_sp = sp.id_sp and T.id_dm = sp.id_dm
                                        ) as L
                                    on V.id_sp = L.id_sp and V.id_dm = L.id_dm`);
        return rows[0].total;
    },

    addedByUser: id_user =>
        db.load(`select * from sanpham where nguoi_ban = ${id_user}`),

    highestProId: async id_dm => {
        const row = await db.load(
            `select max(id_sp) as highestProId from sanpham where id_dm = ${id_dm}`
        );
        return row[0].highestProId;
    },

    checkOwner: async (id_user, id_dm, id_sp) => {
        const result = await db.load(`select count(*) count from sanpham where nguoi_ban = ${id_user} and id_dm = ${id_dm} and id_sp = ${id_sp}`)
        return result[0].count;
    },

    soldProducts: (id_user) => db.load(`SELECT * 
    from (sanpham sp join sp_daban db on sp.id_dm = db.danh_muc and sp.id_sp = db.san_pham) join user u on db.nguoi_mua = u.id_user
    where sp.nguoi_ban = ${id_user}`),

    historyBids: (id_dm, id_sp) => db.load(`select *
                                        from lichsu_ragia ls join user u on ls.bidder = u.id_user
                                        where ls.id_sp = ${id_dm} and ls.id_dm = ${id_sp} and ls.bidder not in (select bidder from cam_bidder where danh_muc = ls.id_dm and san_pham = ls.id_sp)
                                        having ls.so_tien = (select max(so_tien) from lichsu_ragia ls1 where ls1.bidder = ls.bidder and ls1.id_dm = ls.id_dm and ls1.id_sp = ls.id_sp)
                                        order by so_tien desc`),

    highestBidderAndPrice: (id_dm, id_sp) => db.load(`select ls.bidder as highestBidder, ls.so_tien as currentPrice
                                        from lichsu_ragia ls join user u on ls.bidder = u.id_user
                                        where ls.id_sp = ${id_dm} and ls.id_dm = ${id_sp} and ls.bidder not in (select bidder from cam_bidder where danh_muc = ls.id_dm and san_pham = ls.id_sp)
                                        having ls.so_tien = (select max(so_tien) from lichsu_ragia ls1 where ls1.bidder = ls.bidder and ls1.id_dm = ls.id_dm and ls1.id_sp = ls.id_sp)
                                        order by so_tien desc
                                        limit 1`),

    update: () => db.load(`update sanpham set het_han = 1 where tg_het_han < now()`),
};