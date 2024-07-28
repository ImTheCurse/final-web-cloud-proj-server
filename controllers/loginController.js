const { v4: uuid } = require('uuid');
exports.loginController = {
	async userLogin(req, res) {
		const { dbConnection } = require('../db_connection.js');
		const connection = await dbConnection.createConnection();

		const username = await req.body.username;
		const password = await req.body.password;

		try {
			const user = await connection.query('select * from tbl_103_Users u where u.username like ? and u.password like ? order by username limit 1',
				[username, password]);
			if (user[0].length === 0) {
				res.status(400).send('Error: User not found.');
				return;
			}
			const sessionID = uuid();
			await connection.execute('insert into tbl_103_SessionAuth values(?,?,now())', [user[0][0].id, sessionID]);
			res.status(200).send(sessionID);
		} catch (err) {
			res.status(500).send(err);
			connection.end();
			return;
		}
	},
}
