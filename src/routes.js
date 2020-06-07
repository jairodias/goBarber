import { Router } from 'express';
import User from './app/models/User';

const routes = new Router();

routes.get('/', async (req, res) => {
  const user = await User.create({
    name: 'Jairo Dias',
    email: 'jairopereira_dias@hotmail.com',
    password_hash: '514684849',
  });

  return res.json(user);
});

export default routes;
