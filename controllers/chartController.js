const { dbConnection } = require('../db_connection.js');

exports.chartController = {
	async fetchMostViewModel(req, res) {
		const connection = await dbConnection.createConnection();
		try {

			const mostViewed = await connection.query('select model_name,cm.views from tbl_103_Models m inner join tbl_103_CatalogModels cm on cm.modelID = m.model_id order by cm.views desc');
			res.status(200).send(mostViewed);
			await connection.end();
		} catch (err) {
			res.status(500).send(err);
			await connection.end();
		}
	},

	async fetchAvgAttempts(req, res) {
		const connection = await dbConnection.createConnection();

		try {
			const avg_attempts = await connection.query('select t.test_name,avg(attempts) as avg_attempts from (select test_id,user_id,count(*) as attempts from tbl_103_UserTest group by test_id, user_id) as user_attempts join tbl_103_Tests t on user_attempts.test_id = t.test_id group by t.test_id,t.test_name');
			res.status(200).send(avg_attempts);
			await connection.end();
		} catch (err) {
			res.status(500).send(err);
			await connection.end();
		}
	},

	async fetchTopicCount(req, res) {
		const connection = await dbConnection.createConnection();

		try {
			const count = await connection.query('select t.topic_name,count(*) as num_students from tbl_103_Topics t left join tbl_103_UserTopic ut on t.topic_id = ut.topic_id group by t.topic_id, t.topic_name order by num_students desc');
			res.status(200).send(count);
			await connection.end();

		} catch (err) {
			res.status(500).send(err);
			await connection.end();
		}
	}
}





