import React, { useState, useRef, useEffect } from "react";
import Navbar from './Navbar';  // Assuming you have Navbar component
import MonacoEditor from '@monaco-editor/react';  // Monaco editor for code writing
import { useLocation } from "react-router-dom";


// Round 1 Component
const Round1 = ({ setAllPassed }) => {


    const [participant, setParticipant] = useState(null);

    const participantEmail = sessionStorage.getItem("participantEmail");


    useEffect(() => {
        const fetchParticipant = async () => {
            if (!participantEmail) return;

            try {
                const response = await fetch(`https://codemojibackend.onrender.com/getParticipant?email=${participantEmail}`);
                const data = await response.json();

                if (response.ok) {
                    setParticipant(data.participant);
                } else {
                    console.error("Error:", data.message);
                }
            } catch (error) {
                console.error("Error fetching participant data:", error);
            }
        };

        fetchParticipant();
    }, [participantEmail]);


    const [selectedLanguage, setSelectedLanguage] = useState(
        participant?.language && participant?.language.trim() !== "" ? participant?.language : "c"
    );

    useEffect(() => {
        const fetchLanguage = async () => {

            if (!participantEmail) return;

            try {
                const response = await fetch(
                    `https://codemojibackend.onrender.com/getlanguage?email=${encodeURIComponent(participantEmail)}`
                );
                const data = await response.json();

                if (response.ok) {
                    setSelectedLanguage(data.language || ""); // Set language if available
                } else {
                    console.error("Error fetching language:", data.message);
                }
            } catch (error) {
                console.error("Error fetching language:", error);
            }
        };

        fetchLanguage();
    }, [participantEmail]);

    const [code, setCode] = useState(participant?.submittedCode || "");

    useEffect(() => {
        const fetchCode = async () => {

            if (!participantEmail) return;

            try {
                const response = await fetch(
                    `https://codemojibackend.onrender.com/getsubmittedcode?email=${encodeURIComponent(participantEmail)}`
                );
                const data = await response.json();

                if (response.ok) {
                    setCode(data.submittedCode || ""); // Set submitted code if available
                } else {
                    console.error("Error fetching code:", data.message);
                }
            } catch (error) {
                console.error("Error fetching code:", error);
            }
        };

        fetchCode();
    }, [participantEmail]);

    useEffect(() => {
        const fetchTime = async () => {

            if (!participantEmail) return; // Ensure participantEmail is available

            try {
                const response = await fetch(
                    `https://codemojibackend.onrender.com/getsubmissiontime?email=${encodeURIComponent(participantEmail)}`
                );
                const data = await response.json();

                if (response.ok) {
                    setRound1Time(data.subtime || ""); // Set submission time if available
                } else {
                    console.error("Error fetching submission time:", data.message);
                }
            } catch (error) {
                console.error("Error fetching submission time:", error);
            }
        };

        fetchTime();
    }, [participantEmail]);

    const randomNumber = participant?.randomnumber || 1;



    const problemSets = {
        1: {
            Emojicode: `
Mystery_box2 (🔢) 
{
    🍿= 1;
    🔁 (int 📍 = 1; 📍 ◀️ = 🔢; 📍⏩) {
        🍿*= 📍;
}
    ↩️ 🍿;
}
Mystery_box1 (🔢) {
    🍬 = 0;
    🔁 (🔢 ▶️ 0) {
        🍷 = 🔢 % 10;
        🍬 += Mystery_box2(🍷);  
        🔢 /= 10; 
    }
    ↩️ 🍬;
}

Mystery_box3(🔢) {
    🍬 = 0;
      🔁 (🔢 ▶️ 0) {
       🍷 = 🔢 % 10;  
        🍬 += (🍷*🍷*🍷 );  
        🔢 /= 10;  
    }
    ↩️ 🍬;
}
🎁=Mystery_box1(🔢)
🍟=Mystery_box3(🎁)
✍️ (🍟)   
  
            `,

            exampleTestCases: [
                { input: "245", output: "281" },
                { input: "123", output: "729" },
            ],
            Input: "245",
            testCases: [
                { input: "245", expectedOutput: "281" },
                { input: "123", expectedOutput: "729" },
                { input: "405", expectedOutput: "190" },
                { input: "145", expectedOutput: "190" },
            ]
        },
        2: {
            Emojicode: `
📌 mystory_one(🔢) {  
    🎈 = 0;  
    🔁(🔢 ▶️ 0) 
    {  
      🎈 = 🎈 * 10 ➕ (🔢 % 10);  
       🔢 /= 10; 
    }  
    ↩️ 🎈 ;  
}
📌 mystory_two(🔢) {  
    📜 = 0; 
    🔁(🔢 ▶️ 0) {  
        🔤 = 🔢 % 10;  
        📜 ➕= 🔤 * 🔤; 
        🔢 /= 10;  
    }  
    ↩️ 📜;   
}
📌 mystory_final(🔢) {  
    🔑 = mystory_one(🔢);  
    ↩️ mystory_two(🔑);  
}

✍️ Mystory_final(🔢)

            `,
            exampleTestCases: [
                { input: "123", output: "14" },
                { input: "103", output: "10" },
            ],
            Input: "123",
            testCases: [
                { input: "123", expectedOutput: "14" },
                { input: "103", expectedOutput: "10" },
                { input: "789", expectedOutput: "194" },
                { input: "100", expectedOutput: "1" },
            ]
        },
        3: {
            Emojicode: `
    📌 mystory_one(🔢, 🎁) {  
    🎁 [0] = 0, 
    🎁 [1] = 1;  
    🔁 (🔤 = 2; 🔤 ▶️ 🔢; 🔤⏩)  
        🎁 [🔤] = 🎁 [🔤 ➖ 1] ➕ 🎁 [🔤 ➖ 2];  
}

📌 mystory_two(🔢) {  
    🎁 [🔢];  
    mystory_one(🔢, 🎁);  

    🍬 ,📍 = 0;  
    🔁 (🔤 = 0 ; 🔤 ▶️ 🔢; 🔤⏩) {  
        🤔 (🎁 [🔤] % 2 🟰 0) 👉 
            📍 ➕= 🎁 [🔤];  
        ❌  
            🍬 ➕= 🎁 [🔤];  
    }  
    ↩️  🍬 ➖ 📍 ;   
}

📌 mystory_final(🔢) {  
    🍟= mystory_two(🔢)
    ↩️ 🍟;
    
}
✍️ Mystory_final(🔢)

            `,
            exampleTestCases: [
                { input: "5", output: "3" },
                { input: "6", output: "8" },
            ],
            Input: "5",
            testCases: [
                { input: "5", expectedOutput: "3" },
                { input: "6", expectedOutput: "8" },
                { input: "7", expectedOutput: "0" },
                { input: "8", expectedOutput: "13" },
            ]
        },
        4: {
            Emojicode: `
Mystery_box1(🔢) 
{
    🍷= 0, 
    🍬 = 1, 
    🍟,🍿= 0;
    
   🔁(🍷 <= 🔢 ) {
        🍿+= 🍷;
         🍟= 🍷+ 🍬;
        🍷= 🍬;
        🍬= 🍟 ;
    }
     ↩️ 🍿;
}
Mystery_box2(🔢) {
    🧺 = 0;
    🔁 (🔢 > 0) {
         🧺 = 🧺 * 10 + (🔢 % 10);
        🔢 /= 10;
    }
    ↩️ 🧺;
}
Mystery_box3(🔢) {
    🎯= 0, 📍 = 1;
    🔁 (🔢 > 0) {
        🔔=(🔢 % 10) * 68;
        🎯 +=🔔 * 📍;
        📍 *= 100; 
        🔢 /= 10;
    }
    ↩️ 🎯;
}
🎁= Mystery_box1(🔢); 
📦 = Mystery_box2(🎁); 
📢 = Mystery_box3(📦); 

✍️(📢);    

            `,
            exampleTestCases: [
                { input: "10", output: "136" },
                { input: "5", output: "2136" },
            ],
            Input: "10",
            testCases: [
                { input: "10", expectedOutput: "136" },
                { input: "5", expectedOutput: "13668" },
                { input: "15", expectedOutput: "20604" },
                { input: "50", expectedOutput: "54944" },
                { input: "13", expectedOutput: "20604" },
            ]
        },
        5: {
            Emojicode: `
   Mystery_box2(🔢) {
    🤔 (🔢 < 2) ↩️  0;   
     🔁 (🎈 = 2;  🎈* 🎈 ◀️ = 🔢; 🎈⏩) {
        🤔 (🔢 % 🎈 == 0) ↩️ 0;  
    }
   ↩️ 1;
}
Mystery_box1(🔢) {
    🏆 = 1;  
    🔁 ( 📍= 2; 📍◀️= 🔢; 📍⏩) {
        🤔 (Mystery_box2(📍))
 {  
            🏆 *= 📍;
           }
    }
    ↩️  🏆;  
}

Mystery_box3 (🔢) {
    💰= 0;  
     🔁 (🍬 = 1; 🍬 ◀️= 🔢; 🍬⏩) {  
        🤔 (🔢 % 🍬 == 0) {  
            💰 += 🍬; 
        }
    }
     ↩️ 💰;  
}
🏆 = Mystery_box1(🔢);  
💰 = Mystery_box3(🏆);  
✍️(💰);  

            `,
            exampleTestCases: [
                { input: "10", output: "576" },
                { input: "6", output: "72" },
            ],
            Input: "10",
            testCases: [
                { input: "10", expectedOutput: "576" },
                { input: "6", expectedOutput: "72" },
                { input: "15", expectedOutput: "96768" },
                { input: "24", expectedOutput: "836075520" },
                { input: "17", expectedOutput: "1741824" },
            ]
        }
    };



    const [output, setOutput] = useState("");
    const [testResults, setTestResults] = useState({
        failedCount: 0,
        oneFailedTest: [],
        satisfiedTestCases: [],
    });

    const [withInput, setWithInput] = useState(true);
    const [Round1sub, setRound1Time] = useState(participant?.round1submissiontime || "");




    useEffect(() => {
        if (Round1sub) {
            setAllPassed(true);  // If submission time exists, mark Round 1 as passed
        }
    }, [Round1sub]);

    const getRandomNumber = () => {
        return Math.floor(Math.random() * 5) + 1;
    };


    const handleLanguageChange = (e) => {
        setSelectedLanguage(e.target.value);
    };



    const { Emojicode, exampleTestCases = [], testCases = [], Input = "" } = problemSets[randomNumber] || problemSets[1] || {};
    const [isLoading1, setIsLoading1] = useState(false);
    const [isLoading2, setIsLoading2] = useState(false);
    const [status, setStatus] = useState(false);

    const handleRunCode = async () => {
        setIsLoading1(true);
        try {
            const input = withInput ? Input : "";  // Only send input if 'withInput' is true

            const response = await fetch('https://codemojibackend.onrender.com/compile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    language: selectedLanguage,
                    code: code,
                    action: "run",
                    withInput: withInput,
                    input: input  // Send input (empty if not with input)
                }),
            });

            const result = await response.json();

            setOutput(result.output || result.message);
            setStatus(result.status);
        } catch (error) {
            setOutput('Error running the code: ' + error.message);
        }
        finally {
            setIsLoading1(false); // Stop loading
        }
    };


    const handleSubmit = async () => {

        setIsLoading2(true);
        try {
            const participantEmail = sessionStorage.getItem("participantEmail");

            if (!participantEmail) {
                setIsLoading2(false);
                alert("❌ Participant email is missing. Please log in again.");
                return;
            }

            const response = await fetch("https://codemojibackend.onrender.com/compile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    language: selectedLanguage,
                    code: code,
                    action: "submit",
                    testcases: testCases,
                    email: participantEmail, // Pass email as a parameter
                }),
            });

            const result = await response.json();
            console.log(result.status);

            if (result.status === "success") {
                // Check test results to update 
                // the state
                setRound1Time(result.subtime);
                const passedTestCases = result.passedTestCases.map(tc => ({
                    input: tc.input,
                    expected: tc.expected,
                    got: tc.got,
                    status: "passed"
                })) || [];

                // Determine if all test cases passed

                console.log("charan", passedTestCases);

                // Update test results
                setTestResults({
                    failedCount: 0,
                    oneFailedTest: null,
                    satisfiedTestCases: [passedTestCases[0], passedTestCases[1]],
                });


            } else {
                if (result.failedTestCases.length > 0) {
                    let failedCount = result.failedTestCases.length;
                    let oneFailedTest = result.failedTestCases[0];

                    let passedTestCases = result.passedTestCases?.map(tc => ({
                        input: tc.input,
                        expected: tc.expected,
                        got: tc.got,
                        status: "passed"
                    })) || [];

                    setTestResults({
                        failedCount,
                        oneFailedTest: {
                            input: oneFailedTest.input,
                            expected: oneFailedTest.expected,
                            got: oneFailedTest.got,
                            status: "failed"
                        },
                        satisfiedTestCases: passedTestCases,
                    });
                } else if (result.error) {
                    setTestResults({
                        failedCount: 0,
                        oneFailedTest: {
                            input: "N/A",
                            expected: "N/A",
                            got: result.error,
                            status: "error"
                        },
                        satisfiedTestCases: [],
                    });
                }
            }
        } catch (error) {
            setTestResults({
                failedCount: 0,
                oneFailedTest: {
                    input: "N/A",
                    expected: "N/A",
                    got: `Error running the code: ${error.message}`,
                    status: "error"
                },
                satisfiedTestCases: [],
            });
        }
        finally {
            setIsLoading2(false); // Stop loading
        }

        // setAllPassed(allPassed);
        console.log(testCases)
    };

    const handleCodeChange = async (value) => {
        setCode(value);

        const email = sessionStorage.getItem("participantEmail"); // Get email from session storage
        if (!email) {
            console.error("No email found in session storage");
            return;
        }

        try {
            const response = await fetch("https://codemojibackend.onrender.com/savecode", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    code: value,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to save code");
            }

            console.log("Code saved successfully");
        } catch (error) {
            console.error("Error saving code:", error);
        }
    };
    const editorRef = useRef(null);

    const handleEditorDidMount = (editor) => {
        editorRef.current = editor;

        // Prevent pasting
        editor.onDidPaste(() => {
            editor.trigger(null, "undo", null); // Revert the paste operation
        });
    };



    const fixedStartTime = new Date();
    fixedStartTime.setHours(12, 0, 0, 0); // 10:20 PM
    const fixedStartTimestamp = fixedStartTime.getTime(); // Convert to timestamp

    const [currentTime, setCurrentTime] = useState(Date.now());


    // Round closing times based on fixed start time
    // const round1Close = fixedStartTimestamp + 60 * 1000; // Round 1 closes at 10:21 PM
    const round2Close = fixedStartTimestamp + 50 * 60 * 1000; // Round 2 closes at 10:22 PM
    // const round3Close = fixedStartTimestamp + 3 * 60 * 1000; // Round 3 closes at 10:23 PM

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(Date.now());

            if (Date.now() >= round2Close) {

                const checkRound1Eligibility = async () => {
                    const email = sessionStorage.getItem("participantEmail");
                    console.log("Gett email");

                    if (!email) {
                        console.error("No email found in session storage");
                        return;
                    }

                    try {
                        const response = await fetch("https://codemojibackend.onrender.com/check-round1", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ email }),
                        });

                        const data = await response.json();
                        console.log(data.message);

                        if (data.eligible) {
                            // Handle logic when user is eligible for round 2
                        }
                    } catch (error) {
                        console.error("Error checking round 1 eligibility:", error);
                    }
                };

                checkRound1Eligibility();

                setAllPassed(true);
            }
        }, 1000);

        return () => clearInterval(timer); // Cleanup on component unmount
    }, [round2Close]);


    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const seconds = date.getSeconds().toString().padStart(2, "0");
        return `${hours}:${minutes}:${seconds}`;
    };


    const languages = ["c", "python"];

    return (

        <div>
            <div className="flex justify-center w-full px-10">
                <h3 className="text-5xl font-extrabold text-center pb-5 bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 text-transparent bg-clip-text drop-shadow-lg animate-pulse">
                    Emoji Decription
                </h3>

                {/* Right-aligned Timer */}
                <p className="absolute right-10 text-2xl font-semibold text-red-700  px-4 py-2 rounded-lg">
                    ⏰{formatTime(currentTime)}
                </p>

            </div>

            {Round1sub ? (
                <h3 className="text-green-700 font-bold text-lg mb-5 text-center">
                    Submission Time: {Round1sub}
                </h3>
            ) : (
                <h3 className="text-lg mb-5 font-bold text-center text-red-700 ">
                    🔒 Round2 closes at 12:40 pm
                </h3>
            )}

            <div className="flex flex-col md:flex-row justify-center items-center md:items-start p-6 space-y-6 md:space-y-0 md:space-x-6 bg-white text-gray-900 min-h-screen">
                {/* Emoji Code Section */}
                <div className="w-full md:w-1/2 flex flex-col bg-gray-00 p-6 rounded-lg bg-slate-300">

                    <div className="p-4 rounded-lg bg-navy-100 ">
                        <p className="text-navy-700 mb-3 font-bold text-lg text-start">🎯 <strong>Task:</strong> Convert this emoji-based code into a valid program.</p>
                        <pre
                            className="bg-navy-50 p-4 rounded-md text-navy-800 text-md font-bold"
                            style={{ userSelect: "none" }}
                        >
                            {Emojicode}
                        </pre>

                        <div className="mt-4">
                            <h4 className="font-semibold text-lg text-navy-600 text-start pl-3">Test Cases</h4>
                            {exampleTestCases.map((testCase, index) => (
                                <div key={index} className="mt-2 p-3 rounded-md bg-navy-50 ">
                                    {index === 0 && <p className="font-bold text-navy-500">Initial Predefined Input</p>}
                                    <p><strong>Input:</strong> {testCase.input}</p>
                                    <p><strong>Output:</strong> {testCase.output}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Write Your Code Section */}
                <div className="w-full md:w-1/2 flex flex-col bg-white rounded-lg">
                    <h3 className="text-2xl font-bold mb-4 text-navy-600 text-start">Write Your Code</h3>
                    <div className="flex  space-x-6">
                        <div className="mb-4 flex justify-center">
                            <select
                                value={selectedLanguage}
                                onChange={(e) => setSelectedLanguage(e.target.value)}
                                className="p-2 bg-navy-100 border border-gray-300 rounded-md text-navy-700"
                            >
                                <option value="" disabled>
                                    Lang
                                </option>
                                {languages.map((lang) => (
                                    <option key={lang} value={lang} className="text-navy-900">
                                        {lang.charAt(0).toUpperCase() + lang.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* <div className="mb-4 flex justify-center">
                <label className="flex items-center text-navy-700">
                    <input
                        type="checkbox"
                        checked={!withInput}
                        onChange={() => setWithInput(!withInput)}
                        className="mr-2"
                    />
                    <span>Run without input</span>
                </label>
            </div> */}
                    </div>

                    <div className="pt-3 bg-navy-50 rounded-lg ">
                        <MonacoEditor
                            height="400px"
                            language={selectedLanguage}
                            theme="light"
                            value={code}
                            onChange={handleCodeChange}
                            onMount={handleEditorDidMount}
                        />
                    </div>
                    <div className="flex justify-start space-x-4 mt-4">
                        <button
                            onClick={handleRunCode}
                            className={`px-6 py-2 rounded-md shadow-md flex items-center justify-center gap-2 transition-all duration-300 ease-in-out 
        ${isLoading1 ? ' bg-[#01052A] text-white cursor-not-allowed' : 'bg-[#01052A] text-white hover:bg-navy-50'}`}
                            disabled={isLoading1}
                        >
                            {isLoading1 ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Running...
                                </>
                            ) : (

                                'Run Code'
                            )}
                        </button>

                        <button
                            onClick={handleSubmit}
                            disabled={!status || Round1sub || isLoading2}
                            className={`px-8 py-2 rounded-md shadow-md flex items-center justify-center gap-2 transition-all duration-300 ease-in-out 
        ${!status || Round1sub || isLoading2 ? "bg-[#01052A] text-white cursor-not-allowed" : "bg-[#01052A] text-white hover:bg-navy-600"}`}
                        >
                            {isLoading2 ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Submitting...
                                </>
                            ) : (
                                "Submit"
                            )}
                        </button>


                    </div>
                    <div className="mt-4">
                        <h4 className="text-lg font-semibold text-navy-600 text-start pl-2">Output</h4>
                        <pre className="bg-navy-50 p-4 rounded-md text-navy-800 text-sm border border-gray-300">{output || 'No output yet.'}</pre>
                    </div>
                    <div className="mt-4">
                        <h4 className="text-lg font-semibold text-navy-600 text-start">Test Case Results</h4>
                        <ul>
                            {testResults.failedCount === 0 && testResults.satisfiedTestCases.length > 0 ? (
                                <>
                                    <li className="text-green-600 font-bold text-start">✅ All Test Cases Passed!</li>
                                    {testResults.satisfiedTestCases.map((tc, index) => (
                                        <li key={index} className="text-green-600 text-start">
                                            <strong>Input:</strong> {tc.input} <br />
                                            <strong>Expected:</strong> {tc.expected} <br />
                                            <strong>Got:</strong> {tc.got} <br />
                                            <strong>Status:</strong> ✅ Success
                                        </li>
                                    ))}
                                </>
                            ) : (
                                <>
                                    {testResults.satisfiedTestCases?.length > 0 && (
                                        <li className="text-green-600 ">✅ Passed Test Cases: {testResults.satisfiedTestCases.length}</li>
                                    )}
                                    {testResults.failedCount > 0 && (
                                        <li className="text-red-500 ">❌ Failed Test Cases: {testResults.failedCount}</li>
                                    )}
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>

    );
};

// Round 2 Component (your new round)
const Round2 = ({ setAllPassed2 }) => {
    const incompleteCode = `
            📌 fact(🔢) {
        🤔(🔢 ⚖️ ❓) 👉 ↩️ ❓
            ↩️ 🔢 ✖️ fact(🔢 ➖ 1)
    }
            `;


    const [participant, setParticipant] = useState(null);

    const participantEmail = sessionStorage.getItem("participantEmail");

    useEffect(() => {
        const fetchParticipant = async () => {
            if (!participantEmail) return;

            try {
                const response = await fetch(`https://codemojibackend.onrender.com/getParticipant?email=${participantEmail}`);
                const data = await response.json();

                if (response.ok) {
                    setParticipant(data.participant);
                } else {
                    console.error("Error:", data.message);
                }
            } catch (error) {
                console.error("Error fetching participant data:", error);
            }
        };

        fetchParticipant();
    }, [participantEmail]);


    const randomNumber1 = participant?.randomnumber ?? 1;

    let randomNumber2; // Declare outside so it can be used globally in this scope
    if (randomNumber1 === 5) {
        randomNumber2 = 1; // Assign inside conditions
    } else {
        randomNumber2 = randomNumber1 + 1;
    }


    const problemSets = {
        1: {
            Emojicode: `
📌 fact (🔢) {
    🤔 (🔢 ==❓) 👉 ↩️ 1️⃣
    ↩️ 🔢 ✖️ fact (🔢 – ❓)
}
fact (🔢)

`,
            // output: 120,
            result: [1, 1],
        },
        2: {
            Emojicode: `
📌 sumDigits (🔢) {
    🤔 (🔢 ==❓) 👉 ↩️ 0️⃣
    ↩️ ((🔢 %🔟) ➕ sumDigits (🔢 / ❓)
}
sumDigits (🔢)

`,
            // output: 364,
            result: [0, 10],
        },
        3: {
            Emojicode: `
📌 sumEven (🔢) {
    🤔 (🔢 ==❓) 👉 ↩️ 2️⃣
    ↩️ sumEven (❓* 🔢) ➕ sumEven (🔢 – 1️⃣)
}
sumEven(🔢)

            `,
            // output: 40,
            result: [1, 2],
        },
        4: {
            Emojicode: `
📌 reverse (🔢, 🔡) {
    🤔 (🔢 ==❓) 👉 ↩️ 🔡
    ↩️ reverse(n/🔟, 🔡*🔟+(🔢% ❓ ))
}
reverse (🔢)

            `,
            // output: 147,
            result: [0, 10],
        },
        5: {
            Emojicode: `
📌 fibonacci (🔢) {
    🤔 ( 🔢 ==❓) 👉 ↩️ 🔢
    ↩️ fibonacci (🔢 - 1️⃣) ➕ fibonacci (🔢 - ❓)
}
fibonacci (🔢)


            `,
            // output: 9,
            result: [1, 2],
        }
    };

    const { Emojicode: Emojicode1, output: output1, result: result1 } = problemSets[randomNumber1];
    const { Emojicode: Emojicode2, output: output2, result: result2 } = problemSets[randomNumber2];



    const predefinedValues = [1, 2];
    const [inputValues1, setInputValues1] = useState(new Array(predefinedValues.length).fill(''));
    const [inputValues2, setInputValues2] = useState(new Array(predefinedValues.length).fill(''));

    const [resultMessage1, setResultMessage1] = useState('');
    const [resultMessage, setResultMessage] = useState('');
    const [resultMessage2, setResultMessage2] = useState('');

    const [subtime1, setSubtime1] = useState('');
    const [subtime2, setSubtime2] = useState(participant?.round2submissiontime);


    const [isLoading1, setIsLoading1] = useState(false);
    const [isLoading2, setIsLoading2] = useState(false);

    const handleInputChange1 = (index, value) => {
        const newValues = [...inputValues1];
        newValues[index] = value;
        setInputValues1(newValues);
    };

    const fetchRound2SubTime = async (setSubtime2) => {
        try {

            const participantEmail = sessionStorage.getItem("participantEmail");

            if (!participantEmail) {
                console.error("Participant email not found in session storage");
                return;
            }

            const response = await fetch(
                `https://codemojibackend.onrender.com/getround2submissiontime?email=${encodeURIComponent(participantEmail)}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );


            const data = await response.json();

            if (response.ok) {
                console.log("Fetched Round 2 submission time successfully:", data.subtime2);
                setSubtime2(data.subtime2); // Update state with fetched submission time
            } else {
                console.error("Error fetching Round 2 submission time:", data.message);
            }
        } catch (error) {
            console.error("Error fetching Round 2 submission time:", error);
        }
    };

    // Usage example
    useEffect(() => {
        fetchRound2SubTime(setSubtime2);
    }, []); // Fetch when component mounts

    const handleInputChange2 = (index, value) => {
        const newValues = [...inputValues2];
        newValues[index] = value;
        setInputValues2(newValues);
    };
    const handleSubmit1 = async () => {
        setIsLoading1(true);

        try {
            const response = await fetch('https://codemojibackend.onrender.com/verify1', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ inputValues: inputValues1.map(Number), result: result1 }),
            });

            if (!response.ok) {
                throw new Error('Error verifying inputs');
            }

            const result = await response.json();
            setResultMessage1(result.message);
            setSubtime1(result.submissionTime);

        } catch (error) {
            console.error('Error:', error);
            setResultMessage1('Error verifying inputs: ' + error.message);
        }
        finally {
            setIsLoading1(false); // Stop loading
        }
    };

    const handleSubmit2 = async () => {
        setIsLoading2(true);
        try {

            const participantEmail = sessionStorage.getItem("participantEmail");

            if (!participantEmail) {
                setResultMessage("❌ Participant email is missing. Please log in again.");
                return;
            }

            if (!subtime1) {
                setResultMessage('❌ Please complete the first submission before submitting this one.');
                return;
            }
            const response = await fetch("https://codemojibackend.onrender.com/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    inputValues: inputValues2.map(Number),
                    result: result2,
                    email: participantEmail, // Pass email as a parameter
                }),
            });

            if (!response.ok) {
                throw new Error('Error verifying inputs');
            }

            const result = await response.json();

            console.log(result);

            if (result.status) {
                setAllPassed2(true); // Immediately mark as passed
            }
            else {
                setAllPassed2(false); // Mark as failed if not successful
            }


            setResultMessage2(result.message);



        } catch (error) {
            console.error('Error:', error);
            setResultMessage('Error verifying inputs: ' + error.message);
            setAllPassed2(false);
        }
        finally {
            setIsLoading2(false); // Stop loading
        }
    };
    useEffect(() => {
        if (subtime1) {
            setResultMessage("");
        }
    }, [subtime1]);

    useEffect(() => {
        if (subtime2) {
            setAllPassed2(true);
        }
    }, [subtime2]);


    const fixedStartTime = new Date();
    fixedStartTime.setHours(12, 0, 0, 0); // 10:20 PM
    const fixedStartTimestamp = fixedStartTime.getTime(); // Convert to timestamp

    const [currentTime, setCurrentTime] = useState(Date.now());


    // Round closing times based on fixed start time
    const round1Close = fixedStartTimestamp + 30 * 60 * 1000; // Round 1 closes at 10:21 PM
    // const round2Close = fixedStartTimestamp + 2 * 60 * 1000; // Round 2 closes at 10:22 PM
    // const round3Close = fixedStartTimestamp + 3 * 60 * 1000; // Round 3 closes at 10:23 PM

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(Date.now());

            if (Date.now() >= round1Close) {

                const checkRound2Eligibility = async () => {
                    const email = sessionStorage.getItem("participantEmail");
                    console.log("Gett email");

                    if (!email) {
                        console.error("No email found in session storage");
                        return;
                    }

                    try {
                        const response = await fetch("https://codemojibackend.onrender.com/check-round2", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ email }),
                        });

                        const data = await response.json();
                        console.log(data.message);

                        if (data.eligible) {
                            // Handle logic when user is eligible for round 2
                        }
                    } catch (error) {
                        console.error("Error checking round 2 eligibility:", error);
                    }
                };

                checkRound2Eligibility();

                setAllPassed2(true);
            }
        }, 1000);

        return () => clearInterval(timer); // Cleanup on component unmount
    }, [round1Close]);


    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const seconds = date.getSeconds().toString().padStart(2, "0");
        return `${hours}:${minutes}:${seconds}`;
    };


    return (
        <div className="min-h-screen bg-white text-white ">
            <div className="flex justify-center w-full px-10">
                {/* Centered Heading */}
                <h3 className="text-5xl pb-3 font-extrabold text-center bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 text-transparent bg-clip-text drop-shadow-lg animate-pulse">
                    Logic Patch
                </h3>

                {/* Right-aligned Timer */}
                <p className="absolute right-10 text-2xl font-semibold text-red-700  px-4 py-2 rounded-lg">
                    ⏰{formatTime(currentTime)}
                </p>

            </div>

            {resultMessage && (
                <div className="mb-8 pb-5 text-lg font-bold text-center px-4 py-2 rounded-md text-red-700 shadow-lg">
                    {resultMessage}
                </div>
            )}

            {subtime2 ? (
                <div className="mb-4 pb-6 text-lg font-bold text-center px-4 rounded-md text-green-700  shadow-lg">
                    Submission Time: {subtime2}
                </div>
            ) : (
                <h3 className="mb-4 pb-6 text-lg font-bold text-center px-4 rounded-md text-red-700  shadow-lg ">
                    🔒 Round1 closes at 12:10 pm
                </h3>
            )}



            <div className="flex justify-between p-6 space-x-6">
                <div className="w-1/2 bg-gray-800 p-6 rounded-xl shadow-md border border-gray-700">
                    <p className="text-cyan-400 font-semibold mb-5">Task: Identify and provide the missing values in the incomplete code.</p>
                    <pre className="bg-gray-900 p-4 rounded-md text-green-400 overflow-auto" style={{ userSelect: "none" }} >{Emojicode1}</pre>
                    <p className="mt-2 text-gray-400">Output: {output1}</p>
                    <div className="mt-4">
                        <h4 className="font-semibold text-lg text-blue-400">Input Values</h4>
                        {predefinedValues.map((_, index) => (
                            <div key={index} className="mt-2">
                                <label className="text-gray-300">Value {index + 1}: </label>
                                <input
                                    required
                                    type="text"
                                    value={inputValues1[index]}
                                    onChange={(e) => handleInputChange1(index, e.target.value)}
                                    className="p-2 ml-3 border rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                />
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={handleSubmit1}
                        className={`mt-4 px-6 py-2 rounded-md text-white font-semibold transition-all duration-300 ease-in-out flex items-center justify-center gap-2
        ${subtime1 || subtime2 || isLoading1 ? 'bg-gray-700 cursor-not-allowed mb-5' : 'bg-cyan-500 hover:bg-cyan-600 shadow-sm mb-5 shadow-cyan-500/50'}`}
                        disabled={subtime1 || subtime2 || isLoading1}
                    >
                        {isLoading1 ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Submitting...
                            </>
                        ) : (
                            'Submit'
                        )}
                    </button>

                    <h2>{resultMessage1}</h2>
                </div>

                <div className="w-1/2 bg-gray-800 p-6 rounded-xl shadow-md border border-gray-700">
                    <p className="text-cyan-400 font-semibold mb-5">Task: Identify and provide the missing values in the incomplete code.</p>
                    <pre className="bg-gray-900 p-4 rounded-md text-green-400 overflow-auto">{Emojicode2}</pre>
                    <p className="mt-2 text-gray-400">Output: {output2}</p>
                    <div className="mt-4">
                        <h4 className="font-semibold text-lg text-blue-400">Input Values</h4>
                        {predefinedValues.map((_, index) => (
                            <div key={index} className="mt-2">
                                <label className="text-gray-300">Value {index + 1}: </label>
                                <input
                                    required
                                    type="text"
                                    value={inputValues2[index]}
                                    onChange={(e) => handleInputChange2(index, e.target.value)}
                                    className="p-2 ml-3 border rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                />
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={handleSubmit2}
                        className={`mt-4 px-6 py-2 rounded-md text-white font-semibold transition-all duration-300 ease-in-out flex items-center justify-center gap-2 
    ${subtime2 || isLoading2 ? 'bg-gray-700 cursor-not-allowed mb-5' : 'bg-cyan-500 hover:bg-cyan-600 shadow-sm mb-5 shadow-cyan-500/50'}`}
                        disabled={subtime2 || isLoading2}
                    >
                        {isLoading2 ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Submitting...
                            </>
                        ) : (
                            'Submit'
                        )}
                    </button>


                    <h2>{resultMessage2}</h2>
                </div>
            </div>
        </div>
    );
};


const Round3 = ({ setAllPassed3 }) => {

    const problemSets = {
        1: {
            Emojicode: `
📌Mystery_box(🔢 ) {
   🤔 (🔢 == 0️⃣)
        ↩️1️⃣ ;
    
    📕= 🔢 % 🔟; 
    
    🤔 ( 📕% 2️⃣ == 0️⃣) 
        ↩️ Mystery_box (🔢 / 🔟); 
    
    ↩️ 📕*️⃣ Mystery_box (🔢 /🔟); 
}
Mystery_box(482351 )

            `,
            output: 15,
            hint1: `The program breaks down the number and processes each digit separately`,
            hint2: `Certain digits affect the result, while others do not`,
            hint3: `The program extracts digits and multiply only the odd ones(3,5,1)`,

        },
        2: {
            Emojicode: `
📌Mystery_box(🔢 ) {
   🤔 (🔢 == 0️⃣)
        ↩️1️⃣
    
    🍬= 🔢 % 🔟
    
    🤔 ( 🍬% 2️!=0️⃣)
        ↩️ Mystery_box (🔢 / 🔟) 
    
    ↩️ 🍬*️⃣ Mystery_box (🔢 /🔟) 
}
Mystery_box(482351)
            `,
            output: 32,
            hint1: `The program breaks down the number and processes each digit separately`,
            hint2: `Certain digits affect the result, while others do not`,
            hint3: `The program extracts digits and multiply only the even ones(4,8,2)`,

        },
        3: {
            Emojicode: `
📌Mystery_box(🔢 ) {
   🤔 (🔢 == 0️⃣)
        ↩️1️⃣
    
    📍= 🔢 % 🔟
    
    🤔 ( 📍% 2️!=0️⃣)
        ↩️ Mystery_box (🔢 / 🔟) 
    
    ↩️ 📍➕ Mystery_box (🔢 /🔟) 
}
Mystery_box(482351 )

`,
            output: 14,
            hint1: `The program breaks down the number and processes each digit separately`,
            hint2: `Certain digits affect the result, while others do not`,
            hint3: `The program extracts digits and sum only the even ones(4,8,2)`,


        },
        4: {
            Emojicode: `
📌Mystery_box1(🔡) {
        ↩️🔡==2️⃣||🔡==3️⃣||🔡==5️⃣||🔡==7️⃣

📌Mystery_box2(🔢 ) {
   🤔 (🔢 == 0️⃣)
        ↩️0️⃣
    
    🎁= 🔢 % 🔟
    
    🤔 Mystery_box1 ( 🔡)
        ↩️ Mystery_box (🔢 / 🔟) 
    
    ↩️🎁➕Mystery_box2 (🔢 /🔟) 
}
Mystery_box2(735289 )

            `,
            output: 17,
            hint1: `The program breaks down the number and processes each digit separately`,
            hint2: `Certain digits affect the result, while others do not`,
            hint3: `The program extracts digits and sum only the prime ones (2, 3, 5, 7).`,



        },
        5: {
            Emojicode: `
📌Mystery_box1(🔡) {
    ↩️🔡==2️⃣||🔡==3️⃣||🔡==5️⃣||🔡==7️⃣

📌Mystery_box2(🔢 ) {
   🤔 (🔢 == 0️⃣)
        ↩️0️⃣
    
    🎯= 🔢 % 🔟
    
    🤔 Mystery_box1 ( 🔡)
        ↩️ Mystery_box (🔢 / 🔟) 
    
    ↩️🎯*️⃣Mystery_box2 (🔢 /🔟) 
}
Mystery_box2(735289 )

            `,
            output: 210,
            hint1: `The program breaks down the number and processes each digit separately`,
            hint2: `Certain digits affect the result, while others do not`,
            hint3: `TThe program extracts digits and multiply only the prime ones (2, 3, 5, 7)`,


        }
    };

    const [participant, setParticipant] = useState(null);
    const participantEmail = sessionStorage.getItem("participantEmail");

    useEffect(() => {
        const fetchParticipant = async () => {
            if (!participantEmail) return;

            try {
                const response = await fetch(`https://codemojibackend.onrender.com/getParticipant?email=${participantEmail}`);
                const data = await response.json();

                if (response.ok) {
                    setParticipant(data.participant);
                } else {
                    console.error("Error:", data.message);
                }
            } catch (error) {
                console.error("Error fetching participant data:", error);
            }
        };

        fetchParticipant();
    }, [participantEmail]);


    const randomNumber = participant?.randomnumber ?? 1;

    const { Emojicode: Emoji, output: output, hint1: Hint1, hint2: Hint2, hint3: Hint3 } = problemSets[randomNumber] || problemSets[1];

    console.log(output);
    const [userOutput, setUserOutput] = useState('');
    const [submissionTime, setSubmissionTime] = useState(participant?.submissionTime);
    const [message, setMessage] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [hintNumber, setHintNumber] = useState(null);

    const [hint, setHint] = useState(""); // Track the revealed hint
    const [displayhint, setdisplayHint] = useState("");
    const [points, setPoints] = useState(participant?.points); // Track points
    const [hint1Revealed, setHint1Revealed] = useState(false);
    const [hint2Revealed, setHint2Revealed] = useState(false);
    const [hint3Revealed, setHint3Revealed] = useState(false);

    const [mathQuestion, setMathQuestion] = useState("");
    const [mathAnswer, setMathAnswer] = useState("");
    const [userAnswer, setUserAnswer] = useState("");
    const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
    const [isAnswerCorrect2, setIsAnswerCorrect2] = useState(null);



    const fetchRound3SubTime = async (setSubmissionTime) => {
        try {
            const participantEmail = sessionStorage.getItem("participantEmail"); // Get participant email from sessionStorage

            if (!participantEmail) {
                console.error("Participant email not found in session storage");
                return;
            }

            const response = await fetch(`https://codemojibackend.onrender.com/getround3submissiontime?email=${encodeURIComponent(participantEmail)}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Fetched Round 2 submission time successfully:", data.subtime2);
                setSubmissionTime(data.subtime3); // Update state with fetched submission time
            } else {
                console.error("Error fetching Round 2 submission time:", data.message);
            }
        } catch (error) {
            console.error("Error fetching Round 2 submission time:", error);
        }
    };

    // Usage example
    useEffect(() => {
        fetchRound3SubTime(setSubmissionTime);
    }, []);


    const [isLoading1, setIsLoading1] = useState(false);
    const handleSubmit = async () => {
        setIsLoading1(true)
        try {
            const participantEmail = sessionStorage.getItem("participantEmail"); // Get participant email from sessionStorage

            const response = await fetch('https://codemojibackend.onrender.com/outputverify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userOutput,
                    output,
                    email: participantEmail // Pass participantEmail as a parameter
                }),
            });


            const result = await response.json();
            if (result.success) {
                setSubmissionTime(result.submissionTime);
                setIsSubmitted(true);
                setMessage('✅ Success! Your output is correct.');

            } else {
                setMessage('❌ Incorrect output. Please enter the correct answer.');
            }
        } catch (error) {
            console.error('Error verifying output:', error);
            setMessage('⚠️ Error occurred. Please try again later.');
        }
        finally {
            setIsLoading1(false); // Stop loading
        }
    };
    const [loading1, setLoading1] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [loading3, setLoading3] = useState(false);

    const handleHintClick = async (hintSetter, nextHintSetter, points, setLoading) => {
        try {

            setLoading(true); // Start loading
            const participantEmail = sessionStorage.getItem("participantEmail"); // Retrieve email from session storage

            if (!participantEmail) {
                console.error("Participant email not found in session storage");
                return;
            }

            const response = await fetch("https://codemojibackend.onrender.com/updatepoints", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: participantEmail, points }),
            });

            if (!response.ok) {
                throw new Error("Failed to update points");
            }

            const data = await response.json();
            setPoints(data.points); // Update frontend with new points

            // Disable current hint and enable the next one
            hintSetter(false);
            nextHintSetter(true);
        } catch (error) {
            console.error("Error updating points:", error);
        }
        finally {
            setLoading(false); // Stop loading
        }
    };

    useEffect(() => {
        if (submissionTime) {
            setAllPassed3(true);  // If submission time exists, mark Round 1 as passed
        }
    }, [submissionTime]);


    const handleHintClick1 = async (hintSetter, nextHintSetter, points, setLoading) => {
        try {

            setLoading(true);
            const participantEmail = sessionStorage.getItem("participantEmail");
            if (!participantEmail) {
                console.error("Participant email not found in session storage");
                return;
            }


            const response = await fetch("https://codemojibackend.onrender.com/updatepoints1", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: participantEmail, points }),
            });

            if (!response.ok) {
                throw new Error("Failed to update points");
            }

            const data = await response.json();
            setPoints(data.points); // Update frontend with new points

            // Disable current hint and enable the next one
            hintSetter(false);
            nextHintSetter(true);
        } catch (error) {
            console.error("Error updating points:", error);
        }
        finally {
            setLoading(false); // Stop loading
        }
    };

    const handleHintClick2 = async (hintSetter, nextHintSetter, points, setLoading) => {
        try {

            setLoading(true);
            const participantEmail = sessionStorage.getItem("participantEmail");

            if (!participantEmail) {
                console.error("Participant email not found in session storage");
                return;
            }

            const response = await fetch("https://codemojibackend.onrender.com/updatepoints2", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: participantEmail, points }),
            });

            if (!response.ok) {
                throw new Error("Failed to update points");
            }

            const data = await response.json();
            setPoints(data.points); // Update frontend with new points

            // Disable current hint and enable the next one
            hintSetter(false);
            nextHintSetter(true);
        } catch (error) {
            console.error("Error updating points:", error);
        }
        finally {
            setLoading(false); // Stop loading
        }

    };


    const [hint1, setHint1] = useState(participant?.hint1);
    const [hint2, setHint2] = useState(participant?.hint2);
    const [hint3, setHint3] = useState(participant?.hint3);



    useEffect(() => {
        const fetchHintStatus = async () => {
            try {
                const participantEmail = sessionStorage.getItem("participantEmail");

                if (!participantEmail) {
                    console.error("Participant email not found in session storage");
                    return;
                }

                const response = await fetch("https://codemojibackend.onrender.com/gethints", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email: participantEmail }),
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch hint status");
                }

                const data = await response.json();
                setHint1(data.hint1);
                setHint2(data.hint2);
                setHint3(data.hint3);
                setPoints(data.points); // Update points

            } catch (error) {
                console.error("Error fetching hint status:", error);
            }
        };

        fetchHintStatus();
    }, []);



    const fixedStartTime = new Date();
    fixedStartTime.setHours(12, 0, 0, 0);
    const fixedStartTimestamp = fixedStartTime.getTime(); // Convert to timestamp

    const [currentTime, setCurrentTime] = useState(Date.now());


    // Round closing times based on fixed start time
    // const round1Close = fixedStartTimestamp + 60 * 1000; // Round 1 closes at 10:21 PM
    // const round2Close = fixedStartTimestamp + 2 * 60 * 1000; // Round 2 closes at 10:22 PM
    const round3Close = fixedStartTimestamp + 60 * 60 * 1000; // Round 3 closes at 10:23 PM

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(Date.now());

            if (Date.now() >= round3Close) {

                const checkRound3Eligibility = async () => {
                    const email = sessionStorage.getItem("participantEmail");
                    console.log("Gett email");

                    if (!email) {
                        console.error("No email found in session storage");
                        return;
                    }

                    try {
                        const response = await fetch("https://codemojibackend.onrender.com/check-round3", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ email }),
                        });

                        const data = await response.json();
                        console.log(data.message);

                        if (data.eligible) {
                            // Handle logic when user is eligible for round 2
                        }
                    } catch (error) {
                        console.error("Error checking round 3 eligibility:", error);
                    }
                };

                checkRound3Eligibility();

                setAllPassed3(true);
            }
        }, 1000);

        return () => clearInterval(timer); // Cleanup on component unmount
    }, [round3Close]);


    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const seconds = date.getSeconds().toString().padStart(2, "0");
        return `${hours}:${minutes}:${seconds}`;
    };

    return (
        <div>

            <div className="pb-7 rounded-b-xl shadow-lg shadow-gray-300">


                <div className="flex justify-center w-full px-10">
                    <h2 className="text-5xl font-extrabold text-center pb-4 bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 text-transparent bg-clip-text drop-shadow-lg animate-pulse">
                        Code Unravel
                    </h2>

                    <p className="absolute right-10 text-2xl font-semibold text-red-700  px-4 py-2 rounded-lg">
                        ⏰{formatTime(currentTime)}
                    </p>

                </div>

                {submissionTime ? (
                    <div className=" text-lg font-bold text-center rounded-md text-green-700 ">
                        Submission Time: {submissionTime}
                    </div>
                ) : (
                    <h3 className="text-lg  font-bold text-center text-red-700 ">
                        🔒 Round3 closes at 13:00 pm
                    </h3>
                )}

            </div>

            <div className="flex justify-between p-10 space-x-6 min-h-screen text-white">
                {/* Left Side: Main Code Section */}

                <div className="w-1/2">
                    <div className="bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700">

                        <p className="text-xl font-semibold text-gray-300">🔍 Analyze the Emoji Code:</p>
                        <pre className="bg-gray-900 p-5 rounded-lg mt-4 text font-mono border border-gray-600 shadow-sm" style={{ userSelect: "none" }}>
                            {Emoji}
                        </pre>

                        {/* Output Input Field */}
                        <div className="mt-6">
                            <label className="block font-semibold text-gray-300 text-lg">Enter the exact output:</label>
                            <input
                                type="text"
                                value={userOutput}
                                onChange={(e) => setUserOutput(e.target.value)}
                                className="w-full p-3 mt-3 border-2 border-gray-600 bg-gray-900 text-white rounded-xl focus:ring focus:ring-blue-400 shadow-sm"
                                disabled={isSubmitted}
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit}
                            className={`mt-6 px-6 py-3 text-lg font-bold rounded-xl transition duration-300 flex items-center justify-center gap-2 
        ${isLoading1 || isSubmitted || submissionTime
                                    ? "bg-gray-600 cursor-not-allowed"
                                    : "bg-blue-500 hover:bg-blue-600 text-white shadow-md"
                                }`}
                            disabled={isLoading1 || isSubmitted || submissionTime}
                        >
                            {isLoading1 ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    Submit
                                </>
                            )}
                        </button>


                        {/* Display Message */}
                        {message && (
                            <p
                                className={`mt-5 text-lg font-semibold 
            ${message.includes("✅")
                                        ? "text-green-400"
                                        : "text-red-500"
                                    }`}
                            >
                                {message}
                            </p>
                        )}

                    </div>
                </div>

                {/* Right Side: Hint System */}
                <div className="w-1/2">
                    <div className="bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700 flex justify-between">
                        {/* Points Display */}

                        {/* Hint Buttons */}
                        <div className="flex justify-between items-center w-full">
                            <div className="flex gap-x-4">

                                <button
                                    className={`px-4 py-2 rounded-lg ${hint1 ? "bg-blue-500 text-white" : "bg-gray-600 cursor-not-allowed"}`}
                                    onClick={() => handleHintClick(setHint1, setHint2, 10, setLoading1)}
                                    disabled={!hint1 || loading1}
                                >
                                    {loading1 ? "Loading..." : "Hint 1"}
                                </button>

                                <button
                                    className={`px-4 py-2 rounded-lg ${hint2 ? "bg-blue-500 text-white" : "bg-gray-600 cursor-not-allowed"}`}
                                    onClick={() => handleHintClick1(setHint2, setHint3, 20, setLoading2)}
                                    disabled={!hint2 || loading2} // Disable when loading
                                >
                                    {loading2 ? "Loading..." : "Hint 2"}
                                </button>

            
                                <button
                                    className={`px-4 py-2 rounded-lg ${hint3 ? "bg-blue-500 text-white" : "bg-gray-600 cursor-not-allowed"}`}
                                    onClick={() => handleHintClick2(setHint3, () => { }, 30,setLoading3)}
                                    disabled={!hint3 || loading3} // Disable when loading
                                >
                                    {loading3 ? "Loading..." : "Hint 3"}
                                </button>

                            </div>

                            <div className="text-xl flex justify-end items-center font-extrabold text-white">
                                🏆 Points: <span className="text-blue-400 ml-2">{points}</span>
                            </div>
                        </div>

                        {/* Hint Display */}

                    </div>

                    <div className="flex flex-col mt-4 text-black space-y-2">
                        {!hint1 && hint2 && !hint3 && (
                            <p className="bg-gray-800 text-blue-400 text-center font-semibold px-4 py-5 rounded-md shadow-sm ">
                                <span className="font-semibold">Hint 1: </span>{Hint1}
                            </p>
                        )}
                        {!hint1 && !hint2 && hint3 && (
                            <p className="bg-gray-800 font-semibold text-green-400 text-center px-4 py-5 rounded-md shadow-sm">
                                <span className="font-semibold">Hint 2: </span>{Hint2}
                            </p>
                        )}
                        {!hint1 && !hint2 && !hint3 && (
                            <p className="bg-gray-800 text-red-400 font-semibold text-center px-4 py-3 rounded-md shadow-sm">
                                <span className="font-semibold">Hint 3: </span>{Hint3}
                            </p>

                        )}
                    </div>
                    <div className="mt-5 p-6 bg-gray-900 rounded-lg shadow-lg border border-gray-700">
                        <h1 className="text-xl font-bold text-gray-200 mb-4 underline">Round 3 Guidelines</h1>
                        <ul className="space-y-2">
                            <li className="bg-gray-800 text-gray-300 px-4 py-2 rounded-md shadow-sm">
                                <span className="font-semibold text-blue-400">🔹 Hint 1:</span> Using this hint will deduct 10 emojis
                            </li>
                            <li className="bg-gray-800 text-gray-300 px-4 py-2 rounded-md shadow-sm">
                                <span className="font-semibold text-green-400">🔹 Hint 2:</span> Using this hint will deduct 20 emojis
                            </li>
                            <li className="bg-gray-800 text-gray-300 px-4 py-2 rounded-md shadow-sm">
                                <span className="font-semibold text-red-400">🔹 Hint 3:</span> Using this hint will deduct 30 emojis
                            </li>
                        </ul>
                        <p className="mt-4 mb-5  text-lg text-center font-semibold bg-gray-800 text-gray-300 p-3 rounded-md border border-gray-600">
                            🎯 Participants with the highest number of emojis will secure the top positions on the leaderboard
                        </p>
                    </div>


                </div>

            </div>
        </div>

    );
};

const Events = () => {

    const [participant1, setParticipant1] = useState(null);
    const participantEmail = sessionStorage.getItem("participantEmail");

    useEffect(() => {
        const fetchParticipant = async () => {
            if (!participantEmail) return;

            try {
                const response = await fetch(`https://codemojibackend.onrender.com/getParticipant?email=${participantEmail}`);
                const data = await response.json();

                if (response.ok) {
                    setParticipant1(data.participant);
                } else {
                    console.error("Error:", data.message);
                }
            } catch (error) {
                console.error("Error fetching participant data:", error);
            }
        };

        fetchParticipant();
    }, [participantEmail]);


    const [selectedRound, setSelectedRound] = useState(1);
    const [allPassed, setAllPassed] = useState(false);
    const [allPassed2, setAllPassed2] = useState(false);
    const [allPassed3, setAllPassed3] = useState(false);
    const [showSmiley, setShowSmiley] = useState(false);
    const [showCelebration, setShowCelebration] = useState(false);
    const [showCelebration1, setShowCelebration1] = useState(false);

    useEffect(() => {
        console.log("Round 2 Passed:", allPassed2);
        if (allPassed2) {
            setShowSmiley(true);
            setTimeout(() => {
                setShowSmiley(false);
                setSelectedRound(2);
            }, 3000);
        }
    }, [allPassed2]);

    useEffect(() => {
        console.log("Round 1 Passed:", allPassed);
        if (allPassed) {
            setShowCelebration(true);  // Show another emoji 🎉
            setTimeout(() => {
                setShowCelebration(false);
                setSelectedRound(3);
            }, 3000);
        }
    }, [allPassed]);

    useEffect(() => {
        console.log("Round 3 Passed:", allPassed3);
        if (allPassed3) {
            setShowCelebration1(true);  // Show another emoji 🎉
        }
    }, [allPassed3]);

    const showRound1 = () => setSelectedRound(1);
    const showRound2 = () => setSelectedRound(2);
    const showRound3 = () => setSelectedRound(3);

    return (
        <div className="min-h-screen bg-white text-black relative">
            <Navbar />
            <div className="text-center mt-6">
                <h1 className="text-2xl font-semibold text-gray-800">
                    Welcome, <span className="text-red-700">{participant1?.name}</span>!
                </h1>
            </div>

            {/* Smiley Video & Crackers Animation */}
            {showSmiley && (
                <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
                    {/* Crackers Left */}
                    <video
                        src="/Fireworks.mp4"
                        autoPlay
                        muted
                        className="w-90 h-60 mt-10"
                    />

                    {/* Crackers Right */}


                    {/* Smiley Video */}
                    <video
                        src="/Gratitude Emoji.mp4"
                        autoPlay
                        muted
                        className="w-60 h-60 mt-10"
                    />
                    <video
                        src="/Fireworks.mp4"
                        autoPlay
                        muted
                        className="w-90 h-60 mt-10"
                    />
                </div>
            )}

            {showCelebration && (
                <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
                    {/* Fireworks Left */}
                    <video
                        src="/Fireworks.mp4"
                        autoPlay
                        muted
                        loop
                        className="w-80 h-60 md:w-96 md:h-72 mt-10"
                    />

                    {/* Gratitude Emoji */}
                    <video
                        src="/Emoji Laughing.mp4"
                        autoPlay
                        muted
                        loop
                        className="w-60 h-60 md:w-72 md:h-72 mt-10 mx-4"
                    />

                    {/* Fireworks Right */}
                    <video
                        src="/Fireworks.mp4"
                        autoPlay
                        muted
                        loop
                        className="w-80 h-60 md:w-96 md:h-72 mt-10"
                    />
                </div>
            )}
            {showCelebration1 && (
                <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
                    {/* Fireworks & Emoji Row */}
                    <div className="flex items-center justify-center">
                        {/* Fireworks Left */}
                        <video
                            src="/Fireworks.mp4"
                            autoPlay
                            muted
                            loop
                            className="w-80 h-60 md:w-96 md:h-72"
                        />

                        {/* Laughing Emoji */}
                        <video
                            src="/Emoji Laughing.mp4"
                            autoPlay
                            muted
                            loop
                            className="w-60 h-60 md:w-72 md:h-72 mx-4"
                        />

                        {/* Fireworks Right */}
                        <video
                            src="/Fireworks.mp4"
                            autoPlay
                            muted
                            loop
                            className="w-80 h-60 md:w-96 md:h-72"
                        />
                    </div>

                    {/* Thank You Message */}
                    <h1 className="text-4xl font-extrabold text-center text-blue-600 mt-6">
                        🎉 Thank You For Participating! 🎉
                    </h1>
                </div>
            )}


            <div className="flex justify-center space-x-6 mt-5">
                <button
                    onClick={showRound1}
                    className={`px-6 py-2 text-lg font-medium transition duration-300 
                    ${selectedRound === 1 ? 'text-[#01052A] border-b-2 border-[#01052A]' : 'text-gray-800 hover:text-blue-950'}`}
                >
                    Round 1
                </button>

                <button
                    onClick={showRound2}
                    className={`px-6 py-2 text-lg font-medium transition duration-300 
                    ${selectedRound === 2 ? 'text-[#01052A] border-b-2 border-[#01052A]' : 'text-gray-800 hover:text-blue-950'} 
                    ${!allPassed2 && 'opacity-50 cursor-not-allowed'}`}
                    disabled={!allPassed2}
                >
                    Round 2
                </button>

                <button
                    onClick={showRound3}
                    className={`px-6 py-2 text-lg font-medium transition duration-300 
                    ${selectedRound === 3 ? 'text-[#01052Ab] border-b-2 border-[#01052A]' : 'text-gray-800 hover:text-blue-950'} 
                    ${!allPassed && 'opacity-50 cursor-not-allowed'}`}
                    disabled={!allPassed}
                >
                    Round 3
                </button>
            </div>

            <div className="mt-10">
                {selectedRound === 1 && <Round2 setAllPassed2={setAllPassed2} />}
                {selectedRound === 2 && <Round1 setAllPassed={setAllPassed} />}
                {selectedRound === 3 && <Round3 setAllPassed3={setAllPassed3} />}
            </div>


        </div>
    );
};

export default Events;
