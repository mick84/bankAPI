import app from "./src/app.js";
import { connect } from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 5000;
connect(process.env.MONGO_URI)
  .then((e, client) => {
    console.log(`Connection to atlas succeeded`);
    app.listen(PORT, () =>
      console.log(`Bank API server is running on port ${PORT}`)
    );
  })
  .catch(console.log);
