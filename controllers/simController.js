
exports.simController = {
	async fetchSimList(req, res) {
		const { dbConnection } = require('../db_connection.js');
		const connection = await dbConnection.createConnection();

		const sessionID = req.body.sessionID;
		if (sessionID == null) {
			res.status(400).send();
			return;
		}
		try {
			const simulations =
				await connection.query('select um.userID,m.model_id,m.model_name,m.created_at,m.difficulty,m.model_image_url from tbl_103_Models m inner join tbl_103_UserModels um on um.modelID = m.model_id inner join tbl_103_SessionAuth sa on sa.id = um.userID where sa.sessionCode like ?', [sessionID]);

			if (simulations[0].length == 0) {
				res.status(400).send('Invalid sessionID.');
				return;
			}


			res.status(200).send(simulations[0]);
		} catch (err) {
			res.status(500).send(err);
		}
	},
	async fetchCatalog(req, res) {
		const { dbConnection } = require('../db_connection.js');
		const connection = await dbConnection.createConnection();

		try {
			const catalog = await connection.query('select m.model_name,m.model_created_by,m.created_at,cm.likes,cm.views,m.model_image_url,m.model_id,m.user_id from tbl_103_Models m inner join tbl_103_CatalogModels cm on cm.modelID = m.model_id');
			res.status(200).send(catalog[0]);
		} catch (err) {
			res.status(500).send(err);
		}
	},

}







