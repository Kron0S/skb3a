import promise from 'es6-promise';
// ').polyfill();
import fetch from 'isomorphic-fetch';
import express from 'express'
import cors from 'cors';
import _ from 'lodash';

let pc = {};
const app = express();
app.use(cors());
app.get('/volumes', async (req, res) => {
  let hdds = {};
  if (!'hdd' in pc) {
    return res.status(404).send('Not Found');
  }
	for (let i = 0; i < pc.hdd.length; i++) {
    const hdd = pc.hdd[i];
		if (hdd.volume in hdds) {
      hdds[hdd.volume] += hdd.size;
    } else {
      hdds[hdd.volume] = hdd.size;
    }
	}
  hdds = _.mapValues(hdds, function (hdd) {return hdd + 'B'});

	return res.send(JSON.stringify(hdds));
});
app.get('/', async (req, res) => {
	res.send(pc);
});
app.get(/\/.*/, async (req, res) => {
  console.log(req.url);
	const parts = req.url.replace(/^\/|\/$/g, '').split('/');
	let answer = pc;
	for (let i = 0; i < parts.length; i++) {
		const part = parts[i];
    console.log(answer);
    console.log(part);
    console.log(answer.hasOwnProperty(part));
    console.log(answer.constructor());
    console.log(answer.constructor()[part]);
    console.log(typeof answer[part]);
    console.log(111);
		if (answer.constructor()[part] === undefined) {
      console.log('have');
			answer = answer[part];
		} else {
			return res.status(404).send('Not Found');
		}
	}
	return res.send(JSON.stringify(answer));
});

app.listen(3000, () => {
	const pcUrl = 'https://gist.githubusercontent.com/isuvorov/ce6b8d87983611482aac89f6d7bc0037/raw/pc.json';
	fetch(pcUrl)
		.then(async (res) => {
			pc = await res.json();
      console.log('ok');
		})
		.catch(err => {
			console.log('Чтото пошло не так:', err);
      return res.status(404).send('Not Found');
		});

	console.log('Example app listening on port 3000!');
});
