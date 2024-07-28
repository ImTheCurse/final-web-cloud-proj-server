
exports.messageController = {
	async postMessage(req, res) {
		const { dbConnection } = require('../db_connection.js');
		const connection = await dbConnection.createConnection();

		const sender_id = req.body.sender_id;
		const reciever_id = req.body.reciever_id;
		const message = req.body.message;

		if (!sender_id || !reciever_id) {
			res.status(400).send('Invalid reciever or sender id.');
			return;
		}

		try {
			await connection.execute('insert into tbl_103_Messages values(?,?,?)', [reciever_id, sender_id, message]);
			res.status(200).send()
		} catch (err) {
			res.status(500).send(err);
		}
	},
	async getMessage(req, res) {
		const { dbConnection } = require('../db_connection.js');
		const connection = await dbConnection.createConnection();

		const reciever_id = req.body.reciever_id;

		if (!reciever_id) {
			res.status(400).send('Invalid reciever id.');
			return;
		}

		try {
			const messages = await connection.query('select * from tbl_103_Messages where reciever_id = ?', [reciever_id]);
			res.status(200).send(messages[0]);
		} catch (err) {
			res.status(500).send(err);
		}
	}
}
