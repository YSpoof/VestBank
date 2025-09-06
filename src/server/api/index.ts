import express from 'express';
export const router = express.Router();

router.use(express.json());

// Example API endpoint
router.get('/', (req, res) => {
  const date = new Date();
  res.json({ message: 'API works', date });
});
