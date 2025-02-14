import express from 'express';
import compiler from 'compilex';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import Participant from './Mongo.js';
import crypto from "crypto";


import * as dotenv from "dotenv";

dotenv.config(); // Load environment variables


const app = express();
const port = 5000;


// Initialize compilex
const options = { stats: true };
compiler.init(options);

// Configure Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
let currentUserEmail = "";

const uri = "mongodb+srv://salacharan6:Charan%40081@cluster0.uxrd6.mongodb.net/tech_event?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("MongoDB Connection Error:", err));



// const printParticipants = async () => {
//     try {
//         // Use findOne and correct case for email
//         const participant = await Participant.findOne({ email: "Charansala@gmail.com" });
//         if (participant) {
//             console.log("Participant Data:", participant.password);
//         } else {
//             console.log("No participant found with this email.");
//         }
//     } catch (err) {
//         console.error("Error Fetching Participant:", err);
//     }
// };

// printParticipants();


app.post('/getSubmittedCode', async (req, res) => {


    try {
        // Find the participant by email
        const participant = await Participant.findOne({ email: currentUserEmail });

        if (!participant) {
            return res.status(404).send({ message: 'Participant not found' });
        }

        // Send back the submittedCode if participant is found
        res.status(200).send({ success: true, submittedCode: participant.submittedCode });
    } catch (error) {
        res.status(500).send({ message: 'Error retrieving submitted code', error: error.message });
    }
});

app.post('/saveCode', async (req, res) => {
    const { submittedCode } = req.body;

    try {
        // Find participant by ID and update their record with the submitted code
        const participant = await Participant.findOne({ email: currentUserEmail });

        if (!participant) {
            return res.status(404).send({ message: 'Participant not found' });
        }

        // Save the code in the 'submittedCode' field of the participant
        participant.submittedCode = submittedCode;
        await participant.save();

        res.status(200).send({ message: 'Code saved successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Error saving code to the database', error: error.message });
    }
});


app.post("/participantverify", async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email);
        console.log(password)

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const participant = await Participant.findOne({ email: email});
        console.log("email:",participant.email);


        if (!participant) {
            return res.status(404).json({ message: "Participant not found" });
        }

        console.log("Entered Password:", password);
        console.log("Stored Password:", participant.password);



        // Compare passwords
        if (String(password) !== String(participant.password)) {
            return res.status(401).json({ message: "Invalid password" });
        }
        currentUserEmail = email;
        res.status(200).json({ message: "Participant verified", participant });

    } catch (error) {
        console.error("Error verifying participant:", error);
        res.status(500).json({ message: "Server error" });
    }
});




// POST endpoint for verifying inputs
app.post('/verify', (req, res) => {
    const { inputValues } = req.body;
    const correctValues = [1, 2];

    // Check if the number of inputs is correct
    if (inputValues.length !== correctValues.length) {
        return res.status(400).json({ message: 'Invalid number of inputs' });
    }

    // Verify if the input values match the correct values
    const isCorrect = inputValues.every((value, index) => parseInt(value) === correctValues[index]);

    if (isCorrect) {
        const submissionTime = new Date().toLocaleString();
        return res.json({
            message: '✅ Success! Your output is correct!',
            submissionTime: submissionTime,
            status: true,
        });
    } else {
        return res.json({ message: '❌ Some values are incorrect. Please try again!', status: false });
    }
});

// POST endpoint for verifying output
app.post('/outputverify', (req, res) => {
    const { userOutput } = req.body;
    const correctOutput = "20"; // Replace with the correct output

    if (userOutput.trim() === correctOutput) {
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

// POST endpoint for compiling and running code
app.post('/compile', async (req, res) => {
    const { language, code, input, action, testcases, withInput } = req.body;

    console.log(language);
    console.log(code);
    console.log(input);

    if (action === "run") {
        if (language === "python") {
            let envData = { OS: "windows" };

            if (input) {
                compiler.compilePythonWithInput(envData, code, input, (data) => {
                    if (data.error) {
                        return res.send({ status: "error", message: data.error });
                    }
                    res.send(data);
                });
            } else {
                compiler.compilePython(envData, code, (data) => {
                    if (data.error) {
                        return res.send({ status: "error", message: data.error });
                    }
                    res.send(data);
                });
            }
        } else if (language === "cpp" || language === "c") {
            let envData = { OS: "windows", cmd: "g++", options: { timeout: 10000 } };

            if (input) {
                compiler.compileCPPWithInput(envData, code, input, (data) => {
                    if (data.error) {
                        return res.send({ status: "error", message: "Compilation failed: " + data.error });
                    }
                    res.send({ output: data.output || "No output" });
                });
            } else {
                compiler.compileCPP(envData, code, (data) => {
                    if (data.error) {
                        return res.send({ status: "error", message: "Compilation failed: " + data.error });
                    }
                    res.send({ output: data.output || "No output" });
                });
            }
        }
    } else {
        let failedCases = [];
        let passedCases = [];
        let failedCount = 0;
        let promises = [];

        if (language === "python") {
            let envData = { OS: "windows" };

            promises = testcases.map((testcase) => {
                return new Promise((resolve) => {
                    compiler.compilePythonWithInput(envData, code, testcase.input, (data) => {
                        if (data.error) {
                            return res.send({ status: "error", message: "Compilation failed: " + data.error });
                        }

                        let actualOutput = data.output.trim();
                        let expectedOutput = testcase.expectedOutput.trim();

                        if (actualOutput === expectedOutput) {
                            passedCases.push({ input: testcase.input, expected: expectedOutput, got: actualOutput });
                        } else {
                            failedCases.push({ input: testcase.input, expected: expectedOutput, got: actualOutput });
                            failedCount++;
                        }
                        resolve();
                    });
                });
            });
        } else if (language === "cpp" || language === "c") {
            let envData = { OS: "windows", cmd: "g++", options: { timeout: 10000 } };

            promises = testcases.map((testcase) => {
                return new Promise((resolve) => {
                    compiler.compileCPPWithInput(envData, code, testcase.input, (data) => {
                        if (data.error) {
                            return res.send({ status: "error", message: "Compilation failed: " + data.error });
                        }

                        let actualOutput = data.output.trim();
                        let expectedOutput = testcase.expectedOutput.trim();

                        if (actualOutput === expectedOutput) {
                            passedCases.push({ input: testcase.input, expected: expectedOutput, got: actualOutput });
                        } else {
                            failedCases.push({ input: testcase.input, expected: expectedOutput, got: actualOutput });
                            failedCount++;
                        }
                        resolve();
                    });
                });
            });
        }


        await Promise.all(promises);

        if (failedCases.length === 0) {
            console.log("all are passed")
            console.log("pass", passedCases);
            res.send({
                status: "success",
                message: "All test cases passed!",
                passedTestCases: passedCases,
            });

        } else {
            console.log("all are transfered");
            res.send({
                status: "failed",
                failedCount: failedCount,
                passedTestCases: passedCases,
                failedTestCases: failedCases,
            });
        }
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// Clean up temporary files on exit
process.on('SIGINT', () => {
    compilex.flush(function () {
        console.log("Temporary files cleaned up.");
        process.exit();
    });
});
