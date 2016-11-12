import promise from 'es6-promise';
// ').polyfill();
import fetch from 'isomorphic-fetch';
import express from 'express'
import cors from 'cors';

let pc = {};
const app = express();
app.use(cors());
app.get('/volumes', async (req, res) => {
  let hdds = {};
  if (!'hdd' in pc) {
    return res.status(404).send('Not found');
  }
	for (let i = 0; i < pc.hdd.length; i++) {
    const hdd = pc.hdd[i];
    console.log(hdd);
		if (hdd.volume in hdds) {
      hdds[hdd.volume] += hdd.size;
    } else {
      hdds[hdd.volume] = hdd.size;
    }
	}

	return res.send(JSON.stringify(hdds));
});
app.get('/', async (req, res) => {
	res.send(pc);
});
app.get(/\/.*/, async (req, res) => {
	const parts = req.url.replace(/^\/|\/$/g, '').split('/');
	let answer = pc;
	for (let i = 0; i < parts.length; i++) {
		const part = parts[i];
		if (part in answer) {
			answer = answer[part];
		} else {
			return res.status(404).send('Not found');
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
      return res.status(404).send('Not found');
		});

	console.log('Example app listening on port 3000!');
});
