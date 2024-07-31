
const { dbConnection } = require('../db_connection.js');
exports.modelController = {
	async deleteModel(req, res) {
		const connection = await dbConnection.createConnection();

		const modelID = req.body.modelID;
		const userID = req.body.userID;
		if (!modelID || !userID) {
			res.status(400).send('Invalid modelID or userID.');
			await connection.end();
			return;
		}
		try {
			await connection.execute('delete from tbl_103_UserModels where modelID = ? and userID = ? order by userID limit 1', [modelID, userID]);
			res.status(200).send();
			await connection.end();
		} catch (err) {
			res.status(500).send();
			await connection.end();
		}

	},
	async duplicateModel(req, res) {
		const connection = await dbConnection.createConnection();

		const modelID = req.body.modelID;
		const userID = req.body.userID;

		if (!modelID || !userID) {
			res.status(400).send('Invalid modelID or userID.');
			await connection.end();
			return;
		}
		try {
			await connection.execute('insert into tbl_103_UserModels values(?,?)', [userID, modelID]);
			res.status(200).send()
			await connection.end();

		} catch (err) {
			res.status(500).send(err);
			await connection.end();
		}
	}
}
