import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import userRouter from './routes/userRouter';

const app = express();
const prisma = new PrismaClient();

app.use(cors({
  origin: 'https://devdice.onrender.com',
  credentials: true,
}));app.use(express.json());
app.use('/users', userRouter);


app.get('/', (req, res) => {
  res.send('DevDice API is running');
});

app.get('/challenges/random', async (req, res) => {
  const total = await prisma.challenge.count();
  const skip = Math.floor(Math.random() * total);
  const randomChallenge = await prisma.challenge.findFirst({ skip });
  res.json(randomChallenge);
});

app.post('/my-challenges', async (req, res) => {
  const { challengeId } = req.body;
  const saved = await prisma.userChallenge.create({
    data: { challengeId, status: 'pending' },
  });
  res.json(saved);
});

app.get('/my-challenges', async (req, res) => {
  const myChallenges = await prisma.userChallenge.findMany({
    include: { challenge: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(myChallenges);
});

app.patch('/my-challenges/:id', async (req, res) => {
  const { id } = req.params;
  const updated = await prisma.userChallenge.update({
    where: { id: Number(id) },
    data: { status: 'completed' },
  });
  res.json(updated);
});

// Get all challenges
app.get('/challenges', async (req, res) => {
  const challenges = await prisma.challenge.findMany();
  res.json(challenges);
});

// Add challenge (already exists)
app.post('/challenges', async (req, res) => {
  const { title, description } = req.body;
  const newChallenge = await prisma.challenge.create({
    data: { title, description },
  });
  res.json(newChallenge);
});

// Delete challenge
app.delete('/challenges/:id', async (req, res) => {
  await prisma.challenge.delete({ where: { id: Number(req.params.id) } });
  res.json({ success: true });
});

// Edit challenge
app.put('/challenges/:id', async (req, res) => {
  const { title, description } = req.body;
  const updated = await prisma.challenge.update({
    where: { id: Number(req.params.id) },
    data: { title, description },
  });
  res.json(updated);
});

app.post('/challenges/bulk', async (req, res) => {
  const { challenges } = req.body;
  const created = await prisma.challenge.createMany({ data: challenges });
  res.json(created);
});

// Delete my-challenge
app.delete('/my-challenges/:id', async (req, res) => {
  await prisma.userChallenge.delete({ where: { id: Number(req.params.id) } });
  res.json({ success: true });
});



const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

