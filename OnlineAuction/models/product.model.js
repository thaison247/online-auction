const db = require('../utils/db');

module.exports = {
    all: () => db.load('select * from sanpham'),
    allByCat: catId => db.load(`select * from sanpham where id_dm = ${catId}`),

    single: id => db.load(`select * from sanpham where id_sp = ${id}`),
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
    }
};