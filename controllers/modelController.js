
exports.modelController = {
	async deleteModel(req, res) {
		const { dbConnection } = require('../db_connection.js');
		const connection = await dbConnection.createConnection();

		const modelID = req.body.modelID;
		const userID = req.body.userID;
		if (!modelID || !userID) {
			res.status(400).send('Invalid modelID or userID.');
			return;
		}
		try {
			await connection.execute('delete from tbl_103_UserModels where modelID = ? and userID = ? order by userID limit 1', [modelID, userID]);
			res.status(200).send();
		} catch (err) {
			res.status(500).send();
		}

	},
	async duplicateModel(req, res) {
		const { dbConnection } = require('../db_connection.js');
		const connection = await dbConnection.createConnection();

		const modelID = req.body.modelID;
		const userID = req.body.userID;

		if (!modelID || !userID) {
			res.status(400).send('Invalid modelID or userID.');
			return;
		}
		try {
			await connection.execute('insert into tbl_103_UserModels values(?,?)', [userID, modelID]);
			res.status(200).send()

		} catch (err) {
			res.status(500).send(err);
		}
	}
}
