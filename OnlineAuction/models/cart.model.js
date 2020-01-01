const db = require('../utils/db');

module.exports = {
    allByUser: (id_user) => db.load(`select * from gio_hang g join sanpham s on g.danh_muc = s.id_dm and g.san_pham = s.id_sp where nguoi_mua = ${id_user}`),
    totalPrice: (id_user) => db.load(`select sum(s.gia_mua_ngay) as tong_tien from gio_hang g join sanpham s on g.danh_muc = s.id_dm and g.san_pham = s.id_sp where nguoi_mua = ${id_user}
    `),
    numberOfProducts: (id_user) => db.load(`select count(*) as so_don_hang from gio_hang where nguoi_mua = ${id_user}`),
    add: entity => db.add('gio_hang', entity),
    del: (id_sp, id_dm, nguoi_mua) => db.del('gio_hang', {
        nguoi_mua: nguoi_mua,
        danh_muc: id_dm,
        san_pham: id_sp
    }),
    patch: entity => {
        const condition = {
            nguoi_mua: entity.nguoi_mua,
            danh_muc: entity.danh_muc,
            san_pham: entity.san_pham
        };
        delete entity.nguoi_mua;
        delete entity.danh_muc;
        delete entity.san_pham;
        return db.patch('gio_hang', entity, condition);
    },
};