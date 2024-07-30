exports.envController = {
	async getWeatherData(req, res) {
		try {
			const weather = await fetch("https://api.open-meteo.com/v1/forecast?latitude=32.16&longitude=34.84&current=temperature_2m,relative_humidity_2m,surface_pressure&timezone=Africa%2FCairo").then((resp) => resp.json())
			const params = {
				pressure: weather.current.surface_pressure,
				temp: weather.current.temperature_2m,
				humidity: weather.current.relative_humidity_2m
			};
			res.status(200).send(params);
		} catch (err) {
			res.status(400).send(err);
		}
	},
	async fetchEnviormentInputs(req, res) {
		const { dbConnection } = require('../db_connection.js');
		const connection = await dbConnection.createConnection();

		const weather = await fetch("https://api.open-meteo.com/v1/forecast?latitude=32.16&longitude=34.84&current=temperature_2m,relative_humidity_2m,surface_pressure&timezone=Africa%2FCairo").then((resp) => resp.json())

		const params = {
			pressure: weather.current.surface_pressure,
			temp: weather.current.temperature_2m,
			humidity: weather.current.relative_humidity_2m
		};

		const modelID = req.body.modelID;
		const envInpt = await connection.query('select * from tbl_103_EnviormentInput where modelID = ? order by modelID limit 1', [modelID]);

		if (envInpt[0].length == 0) {
			try {
				await connection.execute('insert into tbl_103_EnviormentInput values(?,?,?,?)', [modelID, params.pressure, params.humidity, params.temp]);
				res.status(200).send(params);
				return;
			} catch (err) {
				res.status(500).send(err);
				return;
			}
		}
		try {
			await connection.execute('update tbl_103_EnviormentInput set airDensity = ?,humidity = ?,temperture = ? where modelID = ?',
				[params.pressure, params.humidity, params.temp, modelID]);
			res.status(200).send(params);
		} catch (err) {
			res.status(500).send(err);
		}

	},
	async updateEnvInputs(req, res) {
		const { dbConnection } = require('../db_connection.js');
		const connection = await dbConnection.createConnection();
		const modelID = req.body.modelID;
		const density = req.body.airDensity;
		const temp = req.body.temp;
		const humidity = req.body.humidity;
		if (!modelID || !density || !temp || !humidity) {
			res.status(400).send('Invalid user data');
			return;
		}
		try {
			connection.execute('update tbl_103_EnviormentInput set airDensity = ?,humidity = ?, temperture = ? where modelID = ?',
				[density, humidity, temp, modelID]);
			res.status(200).send();
		} catch (err) {
			res.status(500).send(err);
		}
	}
}
