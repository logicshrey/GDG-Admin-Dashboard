const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const aiSummaryRoute = require('./aiSummary');

const app = express();
const PORT = 8000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/ai-summary', aiSummaryRoute);

app.listen(PORT, () => {
  console.log(`AI Summary server running on http://localhost:${PORT}`);
});
