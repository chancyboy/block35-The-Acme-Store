const { client,
        createTables,
        createUser,
        createProduct,
        createUserFavorites,
        fetchUsers,
        fetchProducts,
        fetchUserFavorites,
        deleteUserFavorite
    } = require('./db');
const express = require('express');
const app = express();

const init = async()=> {
  await client.connect();
  console.log('connected to database');
  await createTables();
  console.log('tables created');

  const [matt,
        andy,
        hazel,
        tv,
        computer,
        tablet,
        iphone
  ] = await Promise.all([
    createUser({ username: 'matt', password: 's3cr3t'}),
    createUser({ username: 'andy', password: 's3cr3t!!'}),
    createUser({ username: 'hazel', password: 'shrek'}),
    createProduct({name: 'tv'}),
    createProduct({name: 'computer'}),
    createProduct({name: 'tablet'}),
    createProduct({name: 'iphone'}),
  ]);
  const users = await fetchUsers();
  console.log(users);
  const products = await fetchProducts();
  console.log(products)

  const userFavorites = await Promise.all([
    createUserFavorites({user_id: matt.id, product_id: tv.id}),
    createUserFavorites({user_id: andy.id, product_id: computer.id}),
    createUserFavorites({user_id: hazel.id, product_id: tablet.id}),
    createUserFavorites({user_id: matt.id, product_id: iphone.id}),
  ]);
  console.log(await fetchUserFavorites(matt.id));
  await deleteUserFavorite(userFavorites[0].id);
  console.log(await fetchUserFavorites(matt.id));

  const port = process.env.PORT || 3000;
  app.listen(port, ()=>console.log(`listening on port ${port}`));
};

app.get('/api/user', async(req, res, next)=> {
    try {
      res.send(await fetchUsers());
    }
    catch(ex){
      next(ex);
    }
});
  
app.get('/api/product', async(req, res, next)=> {
    try {
      res.send(await fetchProducts());
    }
    catch(ex){
      next(ex);
    }
});

app.get('/api/users/:id/favorite', async(req, res, next)=> {
    try {
      res.send(await fetchUserFavorites(req.params.id));
    }
    catch(ex){
      next(ex);
    }
});

app.post('/api/users/:id/favorite', async(req, res, next)=> {
    try {
      res.status(201).send(await createUserFavorites({ user_id: req.params.id, product_id: req.body.product_id}));
    }
    catch(ex){
      next(ex);
    }
});

app.delete('/api/users/:userId/favorite/:id', async(req, res, next)=> {
    try {
      await deleteUserSkill({ id: req.params.id, user_id: req.params.userId });
      res.sendStatus(204);
    }
    catch(ex){
      next(ex);
    }
  });
  
  

init();