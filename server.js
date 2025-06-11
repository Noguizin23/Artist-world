import express from 'express';
import cors from 'cors';
import { connectDB } from './src/lib/mongodb.js';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

let db;
connectDB()
  .then((client) => {
    db = client.db('artist_world');
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server:', err);
  });

app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  try {
    const existing = await db.collection('users').findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Email already in use' });
    }
    const user = { username, email, password, createdAt: new Date() };
    await db.collection('users').insertOne(user);
    return res.status(201).json({ id: user._id, username, email });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to register user' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await db.collection('users').findOne({ email, password });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    return res.json({ id: user._id, username: user.username, email });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to login' });
  }
});

app.get('/api/posts', async (req, res) => {
  try {
    const posts = await db.collection('posts').find().toArray();
    return res.json(posts);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

app.post('/api/posts', async (req, res) => {
  const post = { ...req.body, createdAt: new Date() };
  try {
    await db.collection('posts').insertOne(post);
    return res.status(201).json(post);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to create post' });
  }
});

app.get('/api/requests', async (req, res) => {
  try {
    const requests = await db.collection('requests').find().toArray();
    return res.json(requests);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

app.post('/api/requests', async (req, res) => {
  const request = { ...req.body, createdAt: new Date() };
  try {
    await db.collection('requests').insertOne(request);
    return res.status(201).json(request);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to create request' });
  }
});
