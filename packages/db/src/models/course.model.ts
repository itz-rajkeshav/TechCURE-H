import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

/**
 * Course Interface
 * Represents an educational course like CBSE, JEE, NEET
 */
export interface ICourse {
    _id?: string;
    code: string;
    name: string;
    description?: string;
    classes: string[];
    createdAt?: Date;
    updatedAt?: Date;
}

const courseSchema = new Schema<ICourse>(
    {
        _id: { type: String },
        code: {
            type: String,
            required: true,
            unique: true,
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
        classes: [{
            type: String,
            trim: true
        }],
    },
    {
        collection: "courses",
        timestamps: true,
        _id: false
    }
);

// Indexes
courseSchema.index({ code: 1 });
courseSchema.index({ name: "text", description: "text" });

// Pre-save hook to generate _id from code
courseSchema.pre("save", function (next) {
    if (!this._id) {
        this._id = this.code;
    }
    next();
});

export const Course = (models.Course || model<ICourse>("Course", courseSchema)) as mongoose.Model<ICourse>;
