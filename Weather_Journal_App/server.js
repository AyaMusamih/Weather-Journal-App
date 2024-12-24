import express from 'express';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());

const dataStore = (() => {
  let projectData = {};

  return {
    get: () => projectData,
    update: (newData) => {
      projectData = { ...newData };
    },
  };
})();

const getAllData = (req, res) => {
  res.status(200).json(dataStore.get());
};

const addData = (req, res) => {
  const { temperature, date, userResponse } = req.body;

  if (!temperature || !date || !userResponse) {
    return res.status(400).json({ message: 'Invalid input data' });
  }

  dataStore.update({ temperature, date, userResponse });
  res.status(201).json({
    message: 'Data successfully added!',
    data: dataStore.get(),
  });
};

app.route('/all').get(getAllData);
app.route('/add').post(addData);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is live at http://localhost:${PORT}`));
