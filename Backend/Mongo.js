import mongoose from 'mongoose';
// Connect to MongoDB (Use your MongoDB URL for production)
mongoose.connect('mongodb://localhost:27017/tech_event', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Define Schema
const participantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    college: { type: String, required: true },
    branch: { type: String, required: true },
    studyingYear: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    round1submissiontime: { type: Date, default: null },
    round2submissiontime: { type: Date, default: null },
    round3submissiontime: { type: Date, default: null },
    randomNumber: { type: Number, required: true },
    submittedCode: { type: String, default: "" },  // Stores submitted code
    value1: { type: Number, default: 0 },  // Custom value 1
    value2: { type: Number, default: 0 },  // Custom value 2
    value3: { type: Number, default: 0 },  // Custom value 3
    output: { type: String, default: "" }  // Expected/actual output
});

// Create Model
const Participant = mongoose.model('Participant', participantSchema);

// Export Model
export default Participant;
