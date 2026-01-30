import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

/**
 * Subject Interface
 * Represents a subject within a course (e.g., Physics in Class 12 CBSE)
 */
export interface ISubject {
    _id?: string;
    code: string;
    name: string;
    description?: string;
    course: string;
    class: string;
    examType: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const subjectSchema = new Schema<ISubject>(
    {
        _id: { type: String },
        code: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            trim: true
        },
        course: {
            type: String,
            ref: "Course",
            required: true,
            lowercase: true
        },
        class: {
            type: String,
            required: true,
            trim: true
        },
        examType: {
            type: String,
            required: true,
            enum: ["board", "jee", "neet", "gate", "upsc", "other"],
            default: "board"
        },
    },
    {
        collection: "subjects",
        timestamps: true,
        _id: false
    }
);

// Compound unique index
subjectSchema.index({ course: 1, class: 1, code: 1 }, { unique: true });
subjectSchema.index({ course: 1, class: 1 });
subjectSchema.index({ name: "text", description: "text" });

// Virtual for full identifier
subjectSchema.virtual("fullId").get(function () {
    return `${this.code}-${this.class}-${this.course}`;
});

// Pre-save hook to generate _id
subjectSchema.pre("save", function (next) {
    if (!this._id) {
        this._id = `${this.code}-${this.class}-${this.course}`;
    }
    next();
});

export const Subject = (models.Subject || model<ISubject>("Subject", subjectSchema)) as mongoose.Model<ISubject>;
