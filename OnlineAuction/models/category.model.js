const db = require('../utils/db');

module.exports = {
    all: () => db.load('select * from danhmuc'),
    single: id => db.load(`select * from danhmuc where id_dm = ${id}`),
    add: entity => db.add('danhmuc', entity),
    del: id => db.del('danhmuc', {
        id_dm: id
    }),
    patch: entity => {
        const condition = {
            id_dm: entity.id_dm
        };
        delete entity.id_dm;
        return db.patch('danhmuc', entity, condition);
    },

    allWithDetails: _ => {
        const sql = `
      select dm.id_dm, dm.ten_dm, count(sp.id_sp) as num_of_products
      from danhmuc dm left join sanpham sp on dm.id_dm = sp.id_dm
      group by dm.id_dm, dm.ten_dm`;
        return db.load(sql);
    },

};