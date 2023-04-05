// import express from 'express';
// import axios from 'axios';

// const app = express();

// const url = 'https://jsonplaceholder.typicode.com/posts';

// let timeline = null;

// async function loadTimeline() {
//   const fromDate = new Date();
//   if (timeline == null) {
//     const r = await fetch(url);
//     timeline = await r.json();
//   }
//   const toDate = new Date();
//   console.log('Loading time: ' + (toDate.getTime() - fromDate.getTime()));

//   return timeline;
// }

// app.get('/posts/:id', async (req, res) => {
//   const result = await loadTimeline();
//   res.send(result[req.params.id]);
// });

// loadTimeline();
// app.listen(8081, () => console.log('listening on port 8081'));

import express from 'express';
import axios from 'axios';

const app = express();

// Configure axios to use JSONPlaceholder API
const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
});

app.get('/eager', async (req, res) => {
  console.time('eager');
  // Eager loading
  const posts = await api.get('/posts?_embed=comments');
  console.timeEnd('eager');
  res.json(posts.data);
});

app.listen(8081, () => {
  console.log('Server listening on port 8081');
});
