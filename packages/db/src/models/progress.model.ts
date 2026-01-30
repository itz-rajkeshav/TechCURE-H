import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

/**
 * Progress Status Type
 */
export type ProgressStatus = "not_started" | "in_progress" | "completed";

/**
 * User Progress Interface
 * Tracks a user's progress on a specific topic
 */
export interface IUserProgress {
    _id?: mongoose.Types.ObjectId;
    user: string;
    topic: mongoose.Types.ObjectId;
    subject: string;
    status: ProgressStatus;
    completedAt?: Date;
    notes?: string;
    timeSpent?: number; // in minutes
    createdAt?: Date;
    updatedAt?: Date;
}

const userProgressSchema = new Schema<IUserProgress>(
    {
        user: {
            type: String,
            ref: "User",
            required: true
        },
        topic: {
            type: Schema.Types.ObjectId,
            ref: "Topic",
            required: true
        },
        subject: {
            type: String,
            ref: "Subject",
            required: true
        },
        status: {
            type: String,
            required: true,
            enum: ["not_started", "in_progress", "completed"],
            default: "not_started"
        },
        completedAt: {
            type: Date
        },
        notes: {
            type: String,
            trim: true,
            maxlength: 1000
        },
        timeSpent: {
            type: Number,
            min: 0,
            default: 0
        },
    },
    {
        collection: "user_progress",
        timestamps: true
    }
);

// Compound unique index - one progress record per user per topic
userProgressSchema.index({ user: 1, topic: 1 }, { unique: true });
userProgressSchema.index({ user: 1, subject: 1 });
userProgressSchema.index({ user: 1, status: 1 });

// Pre-save hook to set completedAt when status changes to completed
userProgressSchema.pre("save", function (next) {
    if (this.isModified("status")) {
        if (this.status === "completed" && !this.completedAt) {
            this.completedAt = new Date();
        } else if (this.status !== "completed") {
            this.completedAt = undefined;
        }
    }
    next();
});

export const UserProgress = (models.UserProgress || model<IUserProgress>("UserProgress", userProgressSchema)) as mongoose.Model<IUserProgress>;
