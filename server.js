import app from "./src/app.js";
import { connect } from "mongoose";
const PORT = process.env.PORT || 5000;
connect(process.env.MONGO_URI)
  .then(() => {
    console.log(`Connection to atlas succeeded`);
    app.listen(PORT, () =>
      console.log(`Bank API server is running on port ${PORT}`)
    );
  })
  .catch(console.log);
