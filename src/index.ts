import express from 'express';
import bodyParser from 'body-parser';
import { sequelize } from './database';
import contactRouter from './routes/contact';
import { postContact, getContact } from './routes/contact';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use('/identify', postContact);
app.use('/identify', getContact)

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
