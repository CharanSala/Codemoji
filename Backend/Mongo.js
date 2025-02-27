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
    hint1: { type: Boolean, default: true },  // ✅ Add hint states
    hint2: { type: Boolean, default: false },
    hint3: { type: Boolean, default: false },
    round1submissiontime: { type: String, default: null },  
    round2submissiontime: { type: String, default: null },
    round3submissiontime: { type: String, default: null },
    submittedCode: { type: String, default: null, trim: true },  
    randomnumber: { type: Number, default: 0 },
    value1: { type: Number, default: 0 },
    value2: { type: Number, default: 0 },
    value3: { type: Number, default: 0 },
    language: { type: String, default: null, trim: true },
    output: { type: String, default: "", trim: true },
    points: { type: Number, default: 100 }
});
connectDB();

// Create Model
const Participant = mongoose.model('Participant', participantSchema);
const insertParticipant = async () => {
    try {
      const newParticipant = new Participant({
        name: "unkonown", 
        email: "unknown@gmail.com",
        password: "unknown"
      });
  
      const savedParticipant = await newParticipant.save();
      console.log("Inserted Successfully:", savedParticipant);
    } catch (error) {
      console.error("Error inserting participant:", error);
    } finally {
      mongoose.connection.close();
    }
  };



export default Participant;

