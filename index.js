import express from 'express';
import axios from 'axios';

const app = express();

// Configure axios to use JSONPlaceholder API
const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
});

app.get('/lazy', async (req, res) => {
  console.time('lazy');
  const fromDate = new Date();
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
  const toDate = new Date();
  res.json({
    LoadingTime: `${toDate.getTime() - fromDate.getTime()} ms`,
    postsWithComments,
  });
});

app.get('/eager', async (req, res) => {
  console.time('eager');
  const fromDate = new Date();
  // Eager loading
  const posts = await api.get('/posts?_embed=comments');
  const result = posts.data;
  console.timeEnd('eager');
  const toDate = new Date();
  res.json({
    LoadingTime: `${toDate.getTime() - fromDate.getTime()} ms`,
    result,
  });
});

app.listen(8080, () => {
  console.log('Server listening on port 8080');
});
