import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

// ✅ FIX: Encode '@' in the password in the URI
const uri = "mongodb+srv://salacharan6:Charan%40081@cluster0.uxrd6.mongodb.net/tech_event?retryWrites=true&w=majority&appName=Cluster0";

// ✅ FIX: Use async/await for connection handling
const connectDB = async () => {
    try {
        await mongoose.connect(uri);
        console.log("✅ MongoDB Connected");
    } catch (err) {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1); // Exit if connection fails
    }
};

// ✅ FIX: Improved Schema Design
const participantSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },  // ✅ Name field added
    email: { type: String, required: true, unique: true, trim: true },  // ✅ Email field added
    password: { type: String, required: true, trim: true },  // ✅ Password field added
    
    round1submissiontime: { type: Date, default: null },  
    round2submissiontime: { type: Date, default: null },
    round3submissiontime: { type: Date, default: null },
    submittedCode: { type: String, default: "", trim: true },  
    randomnumber: { type: Number, default: 0 },
    value1: { type: Number, default: 0 },
    value2: { type: Number, default: 0 },
    value3: { type: Number, default: 0 },
    output: { type: String, default: "", trim: true }
});
connectDB();

// Create Model
const Participant = mongoose.model('Participant', participantSchema);

export default Participant;

