import express from 'express';
const router = express.Router();

router.post('/register', (req, res) => {
  const datos = req.body;
  console.log('Registrando usuario:', datos);
  res.send('Usuario registrado correctamente');
});

export default router;  // Cambia esta línea para usar export default NO SIRVEEEEE