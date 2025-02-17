import express from 'express';
import compiler from 'compilex';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import Participant from './Mongo.js';
import crypto from "crypto";
import connectDB from './db.js';

import dotenv from "dotenv";


dotenv.config();

const app = express();
const port = 5000;

app.use(express.urlencoded({ extended: true }));

// Initialize compilex
const options = { stats: true };
compiler.init(options);

// Configure Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
let currentUserEmail = "";



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

app.use(express.json());
import bcrypt from "bcrypt";


app.post("/participantverify", async (req, res) => {
    try {
        console.log("🔍 Request Body:", req.body); // Debugging output

        if (!req.body) {
            return res.status(400).json({ message: "Invalid request! No request body received." });
        }

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required!" });
        }

        console.log("📧 Email:", email, "🔑 Password:", password);

        const participant = await Participant.findOne({ email });

        if (!participant) {
            return res.status(404).json({ message: "Participant not found!" });
        }

        if (participant.password != password) {
            return res.status(401).json({ message: "Incorrect password!" });
        }

        // Check if passwords match


        console.log("✅ Participant Verified:", participant.email);
        currentUserEmail = email;

        res.json({ message: "Participant verified successfully!", participant });

    } catch (error) {
        console.error("❌ Error verifying participant:", error.message);
        res.status(500).json({ message: "Internal server error" });
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


app.get("/getsubmittedcode", async (req, res) => {
    const { email } = req.query; // Get email from query parameters

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        const participant = await Participant.findOne({ email });

        if (!participant) {
            return res.status(404).json({ message: "Participant not found" });
        }

        res.json({ submittedCode: participant.submittedCode });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

app.get("/getlanguage", async (req, res) => {
    const { email } = req.query; // Get email from query parameters

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        const participant = await Participant.findOne({ email });

        if (!participant) {
            return res.status(404).json({ message: "Participant not found" });
        }

        res.json({ language: participant.language });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});
app.get("/getpoints", async (req, res) => {
    const { email, hintnumber } = req.query; // Get email and hintNumber from query parameters

    if (!email || !hintnumber) {
        return res.status(400).json({ message: "Email and hintNumber are required" });
    }

    try {
        const participant = await Participant.findOne({ email });

        if (!participant) {
            return res.status(404).json({ message: "Participant not found" });
        }

        // Convert hintNumber to an integer and determine points deduction
        const hintnum = parseInt(hintnumber);
        if (![1, 2, 3].includes(hintnum)) {
            return res.status(400).json({ message: "Invalid hintNumber. Must be 1, 2, or 3." });
        }

        // Deduct points based on the hint number
        const pointsDeduction = hintnum * 10; // 1 → -10, 2 → -20, 3 → -30
        participant.points -= pointsDeduction;

        // Ensure points don't go below zero
        if (participant.points < 0) participant.points = 0;

        await participant.save();
        console.log("mydata",participant);

        res.json({ message: "Points updated successfully", points: participant.points });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});



app.get("/getsubmissiontime", async (req, res) => {
    const { email } = req.query; // Get email from query parameters

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        const participant = await Participant.findOne({ email });

        if (!participant) {
            return res.status(404).json({ message: "Participant not found" });
        }

        res.json({ subtime: participant.round1submissiontime });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
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
           
            console.log("Myemail", currentUserEmail);
            const participant = await Participant.findOne({ email: currentUserEmail });

           console.log(code);
            participant.submittedCode = code;
            await participant.save();

            participant.language = language; 
            await participant.save();



            const time = new Date().toLocaleString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false, // 24-hour format
            });
            
            
            participant.round1submissiontime = time; // Store time as a string
            await participant.save();




        
            return res.json({
                status: "success",
                message: "✅ All test cases passed!",
                passedTestCases: passedCases,
                subtime:time,
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
