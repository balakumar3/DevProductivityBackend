const express = require('express');
const cors = require('cors');
const RequirementRouter = require('./src/routes/RequirementRouter');
const KnowledgeRouter = require('./src/routes/KnowledgeRouter');
const connectDatabase = require('./src/config/databaseConnect');
const authRouter = require("./src/routes/auth");
const featureRouter = require('./src/routes/FeatureRouter');
require('dotenv/config');
const app = express();
const cookieParser = require("cookie-parser");

app.use(cookieParser());


app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);
app.use(express.json());

app.use("/api", RequirementRouter);
app.use("/", KnowledgeRouter);
app.use("/", authRouter);
app.use("/", featureRouter);

const port = process.env.PORT || 4000;

connectDatabase()
    .then(() => {
        console.log(`Database connected `);
        app.listen(port, () => {
            console.log(`Server is running at the port ${port}`)
        })
    })
    .catch((err) => {
        console.log(`Unable to connect to database ${err}`)
    })