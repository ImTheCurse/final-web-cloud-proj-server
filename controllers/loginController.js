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
			const userInfo = {
				sessionID: sessionID,
				role: user[0][0].role
			}
			res.status(200).send(userInfo);
		} catch (err) {
			res.status(500).send(err);
			connection.end();
			return;
		}
	},

	async checkSessionID(req, res) {
		const { dbConnection } = require('../db_connection.js');
		const connection = await dbConnection.createConnection();

		const sessionID = await req.body.sessionID;

		if (!sessionID) {
			res.status(400).send();
			return;
		}

		try {
			const sessions = await connection.query('select * from tbl_103_SessionAuth where sessionCode like ?', [sessionID]);
			if (sessions[0].length === 0) {
				res.status(400).send();
				return;
			}
			res.status(200).send();

		} catch (err) {
			res.status(500).send(err);
		}
	}
}
