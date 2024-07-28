const { v4: uuid } = require('uuid');

exports.simController = {
	async userLogin(req, res) {
		const { dbConnection } = require('../db_connection.js');
		const connection = await dbConnection.createConnection();

		const username = await req.body.username;
		const password = await req.body.password;

		try {
			const user = await connection.query('select * from tbl_103_Users u where u.username like ? and u.password like ? order by username limit 1',
				[username, password]);
			console.log(await user[0].length);
			if (user[0].length == 0) {
				res.status(400).send('Error: User not found.');
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

	async fetchSimList(req, res) {
		const { dbConnection } = require('../db_connection.js');
		const connection = await dbConnection.createConnection();

		const sessionID = req.body.sessionID;
		try {
			const simulations =
				await connection.query('select um.userID,m.model_id,m.model_name,m.created_at from tbl_103_Models m inner join tbl_103_UserModels um on um.modelID = m.model_id inner join tbl_103_SessionAuth sa on sa.id = um.userID where sa.sessionCode like ?', [sessionID]);

			if (simulations[0].length == 0) {
				res.status(400).send('Invalid sessionID.');
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
			const catalog = await connection.query('select m.model_name,m.model_created_by,m.created_at,cm.likes,cm.views from tbl_103_Models m inner join tbl_103_CatalogModels cm on cm.modelID = m.model_id');
			res.status(200).send(catalog[0]);
		} catch (err) {
			res.status(500).send(err);
		}
	}

}
