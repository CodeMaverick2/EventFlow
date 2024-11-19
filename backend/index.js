const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv"); 
const FlowLog = require("./models/FlowLog");

dotenv.config({ path: "../.env" }); 

const app = express();
app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Database Connected Successfully");
  }).catch((e) => {
    console.log(`Error connecting database ${e}`);
  });


// SSE endpoint
app.get("/stream-flow", (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders(); // Flushing headers to keep the connection open

  // Sending flow logs as they are created
  const addLog = async (message) => {
    const logEntry = `${new Date().toLocaleTimeString()}: ${message}`;
    await FlowLog.create({ message: logEntry });
    res.write(`data: ${logEntry}\n\n`);
  };

  const simulateFlow = async () => {
    try {
      await addLog("First Mail Sent.");
      await new Promise(resolve => setTimeout(resolve, 5000)); // Simulating 3 days
      await addLog("3 Days Wait Ended.");

      if (Math.random() > 0.5) {
        await addLog("Subscription renewed. Thank You Mail Sent.");
        res.write('data: Flow completed successfully!\n\n');
        return;
      }

      await addLog("Second Mail Sent.");
      await new Promise(resolve => setTimeout(resolve, 8000)); // Simulating 2 days
      await addLog("2 Days Wait Ended.");

      if (Math.random() > 0.5) {
        await addLog("Subscription renewed. Thank You Mail Sent.");
      } else {
        await addLog("No Renewal. Flow Ended.");
      }

      res.write('data: Flow completed with no renewal.\n\n');
    } catch (error) {
      res.write(`data: Error in flow simulation: ${error.message}\n\n`);
    }
  };

  simulateFlow();
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
