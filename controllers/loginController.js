const { v4: uuid } = require('uuid');
const { dbConnection } = require('../db_connection.js');
exports.loginController = {
	async userLogin(req, res) {
		const connection = await dbConnection.createConnection();

		const username = await req.body.username;
		const password = await req.body.password;

		try {
			const user = await connection.query('select * from tbl_103_Users u where u.username like ? and u.password like ? order by username limit 1',
				[username, password]);
			if (user[0].length === 0) {
				res.status(400).send('Error: User not found.');
				await connection.end();
				return;
			}
			const sessionID = uuid();
			await connection.execute('insert into tbl_103_SessionAuth values(?,?,now())', [user[0][0].id, sessionID]);
			const userInfo = {
				sessionID: sessionID,
				role: user[0][0].role
			}
			res.status(200).send(userInfo);
			await connection.end();
		} catch (err) {
			res.status(500).send(err);
			await connection.end();
			return;
		}
	},

	async checkSessionID(req, res) {
		const connection = await dbConnection.createConnection();
		const sessionID = await req.body.sessionID;
		if (!sessionID) {
			res.status(400).send();
			await connection.end();
			return;
		}

		try {
			const sessions = await connection.query('select * from tbl_103_SessionAuth where sessionCode like ?', [sessionID]);
			if (sessions[0].length === 0) {
				res.status(400).send();
				await connection.end();
				return;
			}
			res.status(200).send(sessions[0][0]);
			await connection.end();
		} catch (err) {
			res.status(500).send(err);
			await connection.end();
		}
	},
	async getUserInfo(req, res) {
		const connection = await dbConnection.createConnection();

		const id = req.body.id;
		if (!id) {
			res.status(400).send('Invalid user ID');
			await connection.end();
			return;
		}
		try {
			const userInfo = await connection.query('select name,image_url,role from tbl_103_Users where id = ?', [id]);
			res.status(200).send(userInfo[0][0]);
			await connection.end();

		} catch (err) {
			res.status(500).send();
			await connection.end();
		}

	}
}
