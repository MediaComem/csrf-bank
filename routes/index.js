import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', { title: 'Carl Sagan Richard Feynman Bank' });
});

export default router;
