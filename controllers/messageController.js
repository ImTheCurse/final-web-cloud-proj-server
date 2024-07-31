const { dbConnection } = require('../db_connection.js');
exports.messageController = {
	async postMessage(req, res) {
		const connection = await dbConnection.createConnection();

		const sender_id = req.body.sender_id;
		const reciever_id = req.body.reciever_id;
		const message = req.body.message;

		if (!sender_id || !reciever_id) {
			res.status(400).send('Invalid reciever or sender id.');
			await connection.end();
			return;
		}

		try {
			await connection.execute('insert into tbl_103_Messages values(?,?,?)', [reciever_id, sender_id, message]);
			res.status(200).send()
			await connection.end();
		} catch (err) {
			res.status(500).send(err);
			await connection.end();
		}
	},
	async getMessage(req, res) {
		const connection = await dbConnection.createConnection();

		const reciever_id = req.body.reciever_id;

		if (!reciever_id) {
			res.status(400).send('Invalid reciever id.');
			await connection.end();
			return;
		}

		try {
			const messages = await connection.query('select m.reciever_id,m.sender_id,u.name,message from tbl_103_Messages m inner join tbl_103_Users u on m.sender_id = u.id where reciever_id = ?', [reciever_id]);
			res.status(200).send(messages[0]);
			await connection.end();
		} catch (err) {
			res.status(500).send(err);
			await connection.end();
		}
	}
}
