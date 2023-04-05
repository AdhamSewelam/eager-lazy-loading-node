// import express from 'express';
// import axios from 'axios';

// const app = express();

// const url = "https://jsonplaceholder.typicode.com/posts"

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

// app.listen(8080, () => console.log('listening on port 8080'));

import express from 'express';
import axios from 'axios';

const app = express();

// Configure axios to use JSONPlaceholder API
const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
});

app.get('/lazy', async (req, res) => {
  console.time('lazy');
  // Lazy loading
  const posts = await api.get('/posts');
  const postPromises = posts.data.map((post) =>
    api.get(`/posts/${post.id}/comments`)
  );
  const comments = await Promise.all(postPromises);
  const postsWithComments = posts.data.map((post, index) => ({
    ...post,
    comments: comments[index].data,
  }));
  console.timeEnd('lazy');
  res.json(postsWithComments);
});

app.listen(8080, () => {
  console.log('Server listening on port 8080');
});
