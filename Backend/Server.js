import express from 'express';
import compiler from 'compilex';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import Participant from './Mongo.js';
import crypto from "crypto";



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

mongoose.connect('mongodb://localhost:27017/tech_event')
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log("MongoDB Connection Error:", err));



const printParticipants = async () => {
    try {
        // Use findOne and correct case for email
        const participant = await Participant.findOne({ email: "Charansala@gmail.com" });
        if (participant) {
            console.log("Participant Data:", participant.password);
        } else {
            console.log("No participant found with this email.");
        }
    } catch (err) {
        console.error("Error Fetching Participant:", err);
    }
};

printParticipants();


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

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const participant = await Participant.findOne({ email });

        if (!participant) {
            return res.status(404).json({ message: "Participant not found" });
        }

        // 🔹 Hash the entered password to compare
        const hashedparticipantPassword = crypto.createHash("sha256").update(participant.password).digest("hex");
        const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");

        if (hashedPassword !== hashedparticipantPassword) {
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

            // Check if withInput is true and execute accordingly

            if (input) {
                // Execute Python code with input
                compiler.compilePythonWithInput(envData, code, input, (data) => {
                    res.send(data);
                });
            } else {
                // Execute Python code without input
                compiler.compilePython(envData, code, (data) => {
                    res.send(data);
                });
            }
        }
        else if (language === "cpp" || language==="c" ) {
            let envData = { OS: "windows", cmd: "g++", options: { timeout: 10000 } };

            console.log("chars");
            if (input) {
                compiler.compileCPPWithInput(envData, code, input, (data) => {
                    if (data.error) {
                        console.log("C++ Compilation Error:", data.error);
                        res.send({ error: "Compilation failed. Ensure g++ is installed and added to PATH." });
                    } else {
                        console.log("C++ Output:", data.output);
                        res.send({ output: data.output || "No output" });
                    }
                });
            } else {
                compiler.compileCPP(envData, code, (data) => {
                    if (data.error) {
                        console.log("C++ Compilation Error:", data.error);
                        res.send({ error: "Compilation failed. Ensure g++ is installed and added to PATH." });
                    } else {
                        console.log("C++ Output:", data.output);
                        res.send({ output: data.output || "No output" });
                    }
                });
            }
        }
        
          // Handle other languages here (C++, Java, etc.)
        
    }

    else {

        let failedCases = []; // To store unsatisfied test cases
        let promises = [];

         if (language === "python") {
            let envData = { OS: "windows" };
            promises = testcases.map((testcase) => {
                return new Promise((resolve) => {
                    compiler.compilePythonWithInput(envData, code, testcase.input, function (data) {
                        if (data.output.trim() !== testcase.expectedOutput.trim()) {
                            failedCases.push({ input: testcase.input, expected: testcase.expectedOutput, got: data.output.trim() });
                        }
                        resolve();
                    });
                });
            });
        }

        else if (language === "cpp" || language === "c") {
            let envData = { OS: "windows", cmd: "g++", options: { timeout: 10000 } };
            promises = testcases.map((testcase) => {
                return new Promise((resolve) => {
                    compiler.compileCPPWithInput(envData, code, testcase.input, function (data) {
                        if (data.output.trim() !== testcase.expectedOutput.trim()) {
                            failedCases.push({ input: testcase.input, expected: testcase.expectedOutput, got: data.output.trim() });
                        }
                        resolve();
                    });
                });
            });
        }
            // Wait for all test cases to complete
            await Promise.all(promises);

        if (failedCases.length === 0) {
            const now = new Date();
            const formattedTime = now.toLocaleString("en-US", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
                hour12: true
            }) + `.${now.getMilliseconds()} ms`; // Append milliseconds

            res.send({
                status: "success",
                message: "All test cases passed!",
                submissionTime: formattedTime
            });
        }
        else {
            res.send({ status: "failed", unsatisfiedTestCases: failedCases });
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
