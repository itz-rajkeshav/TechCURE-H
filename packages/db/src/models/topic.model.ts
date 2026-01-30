import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

/**
 * Position Interface for flow diagram placement
 */
export interface IPosition {
    x: number;
    y: number;
}

/**
 * Topic Interface
 * Represents a learning topic within a subject
 */
export interface ITopic {
    _id?: mongoose.Types.ObjectId;
    code: string;
    title: string;
    description: string;
    subject: string;
    examWeight: number;
    requiredDepth: "Master" | "Understand" | "Familiar";
    commonMistakes: string[];
    estimatedTime: string;
    dependencies: string[];
    priority: "high" | "medium" | "low";
    position: IPosition;
    createdAt?: Date;
    updatedAt?: Date;
}

const positionSchema = new Schema<IPosition>(
    {
        x: { type: Number, required: true, default: 0 },
        y: { type: Number, required: true, default: 0 },
    },
    { _id: false }
);

const topicSchema = new Schema<ITopic>(
    {
        code: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        subject: {
            type: String,
            ref: "Subject",
            required: true
        },
        examWeight: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        },
        requiredDepth: {
            type: String,
            required: true,
            enum: ["Master", "Understand", "Familiar"]
        },
        commonMistakes: [{
            type: String,
            trim: true
        }],
        estimatedTime: {
            type: String,
            required: true,
            trim: true
        },
        dependencies: [{
            type: String,
            lowercase: true
        }],
        priority: {
            type: String,
            required: true,
            enum: ["high", "medium", "low"]
        },
        position: {
            type: positionSchema,
            required: true,
            default: { x: 0, y: 0 }
        },
    },
    {
        collection: "topics",
        timestamps: true
    }
);

// Indexes
topicSchema.index({ subject: 1, code: 1 }, { unique: true });
topicSchema.index({ subject: 1, priority: 1 });
topicSchema.index({ priority: 1 });
topicSchema.index({ title: "text", description: "text" });

// Enable virtuals in JSON
topicSchema.set("toJSON", { virtuals: true });
topicSchema.set("toObject", { virtuals: true });

export const Topic = (models.Topic || model<ITopic>("Topic", topicSchema)) as mongoose.Model<ITopic>;
