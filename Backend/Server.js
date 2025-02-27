import express from 'express';
import compiler from 'compilex';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import Participant from './Mongo.js';
import crypto, { randomBytes } from "crypto";
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

const timeToSeconds = (timeStr) => {
    if (!timeStr) return Infinity; // Handle missing values
    const [hours, minutes, seconds] = timeStr.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

app.get("/leaderboard", async (req, res) => {
  try {
    const participants = await Participant.find({}, "email round1submissiontime round2submissiontime round3submissiontime");

    // Sort participants by total submission time
    const sortedLeaderboard = participants
      .map(participant => ({
        email: participant.email,
        totalTime: timeToSeconds(participant.round1submissiontime) +
                   timeToSeconds(participant.round2submissiontime) +
                   timeToSeconds(participant.round3submissiontime)
      }))
      .sort((a, b) => a.totalTime - b.totalTime);
      
    res.json(sortedLeaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
  

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

app.get('/getround2submissiontime', async (req, res) => {
    try {
        // Find the participant by email
        const participant = await Participant.findOne({ email: currentUserEmail });

        if (!participant) {
            return res.status(404).send({ message: 'Participant not found' });
        }
       

        if (!participant) {
            return res.status(404).json({ message: 'Participant not found' });
        }

        // Send back the Round 2 submission time
        res.status(200).json({ success: true, subtime2: participant.round2submissiontime });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving submission time', error: error.message });
    }
});

app.get('/getround3submissiontime', async (req, res) => {
    try {
        // Find the participant by email
        const participant = await Participant.findOne({ email: currentUserEmail });

        if (!participant) {
            return res.status(404).send({ message: 'Participant not found' });
        }
       

        if (!participant) {
            return res.status(404).json({ message: 'Participant not found' });
        }

        // Send back the Round 2 submission time
        res.status(200).json({ success: true, subtime3: participant.round3submissiontime });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving submission time', error: error.message });
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

        if (participant.randomnumber===0) {
            participant.randomnumber = Math.floor(Math.random() * 5) + 1;
            await participant.save();
        }
       


        console.log("✅ Participant Verified:", participant.email);
        currentUserEmail = email;

        res.json({ message: "Participant verified successfully!", participant });

    } catch (error) {
        console.error("❌ Error verifying participant:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
});


app.post('/store-submission-time', async (req, res) => {
    const {submissionTime } = req.body;

    try{
       const participant = await Participant.findOne({ email: currentUserEmail });

        if (!participant) {
            return res.status(404).send({ message: 'Participant not found' });
        }

        // Save the code in the 'submittedCode' field of the participant
        participant.round2submissiontime = submissionTime;
        await participant.save();


        res.status(200).json({ message: 'Submission time stored successfully', updatedParticipant });

    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Failed to store submission time' });
    }
});


// POST endpoint for verifying inputs
app.post('/verify1', (req, res) => {
    const { inputValues, result } = req.body;

    if (!Array.isArray(inputValues) || !Array.isArray(result)) {
        return res.status(400).json({ message: 'Invalid input format' });
    }

    // Ensure correctValues is an array of numbers
    const correctValues = result.map(Number);

    // Ensure inputValues is an array of numbers
    const userValues = inputValues.map(Number);

    // Check if the number of inputs is correct
    if (userValues.length !== correctValues.length) {
        return res.status(400).json({ message: 'Invalid number of inputs' });
    }

    // Verify if the input values match the correct values
    const isCorrect = userValues.every((value, index) => value === correctValues[index]);

    if (isCorrect) {

        const sub = new Date().toLocaleString('en-GB', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        }); 
       
        return res.json({
            message: '✅ Success! Your output is correct!',
            submissionTime: sub,
            status: true,
        }); 
       

    } else {
        return res.json({ message: '❌ Some values are incorrect. Please try again!', status: false });
    }
});

app.post('/verify', async (req, res) => {
    const { inputValues, result } = req.body;

    if (!Array.isArray(inputValues) || !Array.isArray(result)) {
        return res.status(400).json({ message: 'Invalid input format' });
    }

    // Ensure correctValues is an array of numbers
    const correctValues = result.map(Number);

    // Ensure inputValues is an array of numbers
    const userValues = inputValues.map(Number);

    // Check if the number of inputs is correct
    if (userValues.length !== correctValues.length) {
        return res.status(400).json({ message: 'Invalid number of inputs' });
    }

    // Verify if the input values match the correct values
    const isCorrect = userValues.every((value, index) => value === correctValues[index]);

    if (isCorrect) {
        const sub = new Date().toLocaleString('en-GB', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        }); 

    try {
        // Find participant by ID and update their record with the submitted code
        const participant = await Participant.findOne({ email: currentUserEmail });

        if (!participant) {
            return res.status(404).send({ message: 'Participant not found' });
        }

        // Save the code in the 'submittedCode' field of the participant
        participant.round2submissiontime = sub;
        await participant.save();

        res.status(200).send({ 

            message: '✅ Success! Your output is correct!',
            submissionTime: sub,
            status: true,});

    } catch (error) {
        res.status(500).send({ message: 'Error saving code to the database', error: error.message });

    }

       

    } else {
        return res.json({ message: '❌ Some values are incorrect. Please try again!', status: false });
    }

});

app.post("/updatepoints", async (req, res) => {
   
    const { points } = req.body; // Reduce 10 points for hint
    
    try {
        // Find participant by email
        const participant = await Participant.findOne({ email: currentUserEmail }); 

        if (!participant) {
            return res.status(404).json({ message: "Participant not found" });
        }

        // Ensure points don't go negative
        const updatedPoints = Math.max(0, participant.points - points);

        // Update points in the database
        participant.points = updatedPoints;
        await participant.save();
        
        participant.hint1=false;
        await participant.save();

        participant.hint2=true;
        await participant.save();

        return res.status(200).json({ points: participant.points });

    } catch (error) {
        console.error("Error updating points:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.post("/updatepoints1", async (req, res) => {
   
    const { points } = req.body; // Reduce 10 points for hint
    
    try {
        // Find participant by email
        const participant = await Participant.findOne({ email: currentUserEmail }); 

        if (!participant) {
            return res.status(404).json({ message: "Participant not found" });
        }

        // Ensure points don't go negative
        const updatedPoints = Math.max(0, participant.points - points);

        // Update points in the database
        participant.points = updatedPoints;
        await participant.save();
        
        participant.hint2=false;
        await participant.save();

        participant.hint3=true;
        await participant.save();

        return res.status(200).json({ points: participant.points });

    } catch (error) {
        console.error("Error updating points:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
app.post("/updatepoints2", async (req, res) => {
   
    const { points } = req.body; // Reduce 10 points for hint
    
    try {
        // Find participant by email
        const participant = await Participant.findOne({ email: currentUserEmail }); 

        if (!participant) {
            return res.status(404).json({ message: "Participant not found" });
        }

        // Ensure points don't go negative
        const updatedPoints = Math.max(0, participant.points - points);

        // Update points in the database
        participant.points = updatedPoints;
        await participant.save();
        
        participant.hint3=false;
        await participant.save();

        return res.status(200).json({ points: participant.points });

    } catch (error) {
        console.error("Error updating points:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
app.post("/gethints", async (req, res) => {

    try {
        const participant = await Participant.findOne({ email: currentUserEmail }); 
        
        if (!participant) {
            return res.status(404).json({ message: "Participant not found" });
        }

        return res.status(200).json({
            hint1: participant.hint1,
            hint2: participant.hint2,
            hint3: participant.hint3,
            points: participant.points
        });

    } catch (error) {
        console.error("Error fetching hint status:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// POST endpoint for verifying output
app.post('/outputverify', async (req, res) => {
    try {
        const { userOutput, output } = req.body; // Get email from request

        // Find the participant based on email
        const participant = await Participant.findOne({ email: currentUserEmail });

        if (!participant) {
            return res.status(404).json({ success: false, message: "Participant not found" });
        }

        if (userOutput.trim() === output.toString()) {
            const sub = new Date().toLocaleString('en-GB', { 
                hour12: false, 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit' 
            });

            // Store submission time in DB
            participant.round3submissiontime = sub;
            await participant.save();

            return res.json({ success: true, submissionTime: sub });
        } else {
            return res.json({ success: false, message: "Incorrect output" });
        }
    } catch (error) {
        console.error("Error verifying output:", error);
        res.status(500).json({ success: false, message: "Server error" });
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



            const time = new Date().toLocaleString('en-GB', { 
                hour12: false, 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit' 
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
