const db = require('../utils/db');

module.exports = {
    all: () => db.load('select * from user'),
    single: id => db.load(`select * from user where id_user = ${id}`),
    add: entity => db.add('user', entity),
    del: id => db.del('user', {
        id_sp: id
    }),
    patch: entity => {
        const condition = {
            id_user: entity.id_user
        };
        delete entity.id_user;
        return db.patch('user', entity, condition);
    },

    // highest_bidder: (id_sp, id_dm) => db.load(`select `)
};