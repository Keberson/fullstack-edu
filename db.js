const mysql = require('mysql2');
const config = require("config");

class DB {
    constructor(config) {
        this.connection = mysql.createPool(config).promise();
    }

    async find(outputFields, compareField, data, table) {
        const sql = `SELECT ${outputFields} FROM ${table} WHERE ${compareField} = '${data}'`;

        const candidates = await this.connection.query(sql)
            .then(result => result[0])
            .catch(err => console.log(err));

        if (candidates) {
            return candidates;
        } else {
            return new Error('Возникли проблемы при работе с БД');
        }
    }

    async insertData(data, table) {
        const sql = `INSERT INTO ${table} VALUES(${data.join()})`;

        return await this.connection.query(sql);
    }

    async editData(keys, data, table, compareCondition) {
        let sql = `UPDATE ${table} SET `;
        for (let i = 0; i < keys.length; i++) {
            sql += `${keys[i]}=${data[i]}` + ((i !== keys.length - 1) ? ', ' : ' ');
        }

        sql += `WHERE ${compareCondition}`;

        return await this.connection.query(sql)
    }
}

const workWithDB = new DB(config.get('db'));

module.exports.workWithDB = workWithDB;