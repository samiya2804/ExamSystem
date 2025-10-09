import mongoose from 'mongoose';

const SubmissionSchema = new mongoose.Schema({
    examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
    studentId: { type: String, required: true }, 
    answers: { type: Object, required: true }, 
    total_score: { type: Number, default: 0 },
    max_score: { type: Number, default: 0 },
    status: { type: String, enum: ['pending_evaluation', 'evaluated'], default: 'pending_evaluation' },
    evaluation_report: { type: Object, default: null }, // Stores the full JSON from FastAPI
}, { timestamps: true });

export default mongoose.models.Submission || mongoose.model('Submission', SubmissionSchema);