const express = require('express');
const app = express();
const countryRoutes = require('./routes/countryRoutes');

app.use(express.json());

app.use('/', countryRoutes);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});