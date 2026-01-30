/**
 * Database Seeding Script
 * 
 * Seeds the database with initial data for LearnPath:
 * - Courses (CBSE, JEE, NEET)
 * - Class 12 Physics subject
 * - All 12 physics topics
 * 
 * Run with: pnpm seed
 */

import "dotenv/config";
import mongoose from "mongoose";
import { env } from "@techcure/env/server";

// ============================================================================
// Define schemas inline to avoid circular import issues
// ============================================================================

const courseSchema = new mongoose.Schema(
    {
        _id: { type: String },
        code: { type: String, required: true, unique: true, lowercase: true, trim: true },
        name: { type: String, required: true, trim: true },
        description: { type: String, trim: true },
        classes: [{ type: String, trim: true }],
    },
    { collection: "courses", timestamps: true }
);

const subjectSchema = new mongoose.Schema(
    {
        _id: { type: String },
        code: { type: String, required: true, lowercase: true, trim: true },
        name: { type: String, required: true, trim: true },
        description: { type: String, trim: true },
        course: { type: String, ref: "Course", required: true, lowercase: true },
        class: { type: String, required: true, trim: true },
        examType: { type: String, required: true, enum: ["board", "jee", "neet", "gate", "upsc", "other"], default: "board" },
    },
    { collection: "subjects", timestamps: true }
);

const positionSchema = new mongoose.Schema(
    { x: { type: Number, required: true, default: 0 }, y: { type: Number, required: true, default: 0 } },
    { _id: false }
);

const topicSchema = new mongoose.Schema(
    {
        code: { type: String, required: true, lowercase: true, trim: true },
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        subject: { type: String, ref: "Subject", required: true },
        examWeight: { type: Number, required: true, min: 0, max: 100 },
        requiredDepth: { type: String, required: true, enum: ["Master", "Understand", "Familiar"] },
        commonMistakes: [{ type: String, trim: true }],
        estimatedTime: { type: String, required: true, trim: true },
        dependencies: [{ type: String, lowercase: true }],
        priority: { type: String, required: true, enum: ["high", "medium", "low"] },
        position: { type: positionSchema, required: true, default: { x: 0, y: 0 } },
    },
    { collection: "topics", timestamps: true }
);

// Create models
const Course = mongoose.models.Course || mongoose.model("Course", courseSchema);
const Subject = mongoose.models.Subject || mongoose.model("Subject", subjectSchema);
const Topic = mongoose.models.Topic || mongoose.model("Topic", topicSchema);

// ============================================================================
// Seed Data
// ============================================================================

const courses = [
    {
        _id: "cbse",
        code: "cbse",
        name: "CBSE Board",
        description: "Central Board of Secondary Education - India's national education board",
        classes: ["9", "10", "11", "12"],
    },
    {
        _id: "jee",
        code: "jee",
        name: "JEE (Joint Entrance Examination)",
        description: "Engineering entrance examination for IITs and NITs",
        classes: ["11", "12"],
    },
    {
        _id: "neet",
        code: "neet",
        name: "NEET (National Eligibility cum Entrance Test)",
        description: "Medical entrance examination for MBBS and BDS courses",
        classes: ["11", "12"],
    },
];

const physics12Subject = {
    _id: "physics-12-cbse",
    code: "physics",
    name: "Physics",
    description: "Class 12 Physics covering electromagnetism, optics, modern physics, and electronics",
    course: "cbse",
    class: "12",
    examType: "board",
};

const physics12Topics = [
    // HIGH PRIORITY TOPICS
    {
        code: "electrostatics",
        title: "Electrostatics",
        description: "Electric charges, Coulomb's law, electric fields, electric potential, capacitance, and dielectrics. Foundation for all electricity topics.",
        subject: "physics-12-cbse",
        examWeight: 50,
        requiredDepth: "Master",
        commonMistakes: [
            "Sign errors in electric potential calculations",
            "Confusing electric field with electric potential",
            "Incorrect application of Gauss's law for non-symmetric charge distributions"
        ],
        estimatedTime: "15-18 hours",
        dependencies: [],
        priority: "high",
        position: { x: 250, y: 0 }
    },
    {
        code: "current-electricity",
        title: "Current Electricity",
        description: "Ohm's law, electrical resistance, cells and EMF, Kirchhoff's laws, Wheatstone bridge, and meter bridge.",
        subject: "physics-12-cbse",
        examWeight: 35,
        requiredDepth: "Master",
        commonMistakes: [
            "Incorrect setup of Kirchhoff's loop equations",
            "Wheatstone bridge balance condition errors",
            "Meter bridge calculation mistakes with end corrections"
        ],
        estimatedTime: "12-14 hours",
        dependencies: ["electrostatics"],
        priority: "high",
        position: { x: 250, y: 150 }
    },
    {
        code: "magnetic-effects",
        title: "Magnetic Effects of Current",
        description: "Biot-Savart law, Ampere's circuital law, motion of charges in magnetic fields, force on current-carrying conductors, and magnetic dipoles.",
        subject: "physics-12-cbse",
        examWeight: 40,
        requiredDepth: "Master",
        commonMistakes: [
            "Direction confusion when applying right-hand rule",
            "Integration errors in Biot-Savart law applications",
            "Torque on magnetic dipole formula misapplication"
        ],
        estimatedTime: "14-16 hours",
        dependencies: ["current-electricity"],
        priority: "high",
        position: { x: 100, y: 300 }
    },
    {
        code: "emi",
        title: "Electromagnetic Induction",
        description: "Faraday's law, Lenz's law, motional EMF, eddy currents, self and mutual inductance.",
        subject: "physics-12-cbse",
        examWeight: 45,
        requiredDepth: "Master",
        commonMistakes: [
            "Forgetting to apply Lenz's law for direction",
            "Incorrect magnetic flux calculations",
            "Sign errors in motional EMF problems"
        ],
        estimatedTime: "12-14 hours",
        dependencies: ["magnetic-effects"],
        priority: "high",
        position: { x: 100, y: 450 }
    },
    {
        code: "optics-ray",
        title: "Ray Optics",
        description: "Reflection, refraction, total internal reflection, prisms, lenses, mirrors, and optical instruments like microscopes and telescopes.",
        subject: "physics-12-cbse",
        examWeight: 35,
        requiredDepth: "Master",
        commonMistakes: [
            "Sign convention errors in mirror and lens equations",
            "Confusion between lens maker's formula and thin lens formula",
            "Magnification calculation errors (linear vs angular)"
        ],
        estimatedTime: "12-14 hours",
        dependencies: [],
        priority: "high",
        position: { x: 400, y: 300 }
    },
    // MEDIUM PRIORITY TOPICS
    {
        code: "ac-circuits",
        title: "Alternating Current",
        description: "AC circuits with resistors, inductors, and capacitors. LCR circuits, resonance, power in AC circuits, and transformers.",
        subject: "physics-12-cbse",
        examWeight: 30,
        requiredDepth: "Understand",
        commonMistakes: [
            "Phase angle confusion between voltage and current",
            "Impedance calculation errors in LCR circuits",
            "Power factor misconceptions in reactive circuits"
        ],
        estimatedTime: "10-12 hours",
        dependencies: ["emi"],
        priority: "medium",
        position: { x: 100, y: 600 }
    },
    {
        code: "optics-wave",
        title: "Wave Optics",
        description: "Huygens' principle, interference of light, Young's double slit experiment, diffraction, and polarization.",
        subject: "physics-12-cbse",
        examWeight: 25,
        requiredDepth: "Understand",
        commonMistakes: [
            "Path difference vs phase difference confusion",
            "Fringe width formula errors",
            "Brewster's angle and polarization calculations"
        ],
        estimatedTime: "8-10 hours",
        dependencies: ["optics-ray"],
        priority: "medium",
        position: { x: 400, y: 450 }
    },
    {
        code: "dual-nature",
        title: "Dual Nature of Radiation and Matter",
        description: "Photoelectric effect, Einstein's photoelectric equation, de Broglie hypothesis, and Davisson-Germer experiment.",
        subject: "physics-12-cbse",
        examWeight: 20,
        requiredDepth: "Understand",
        commonMistakes: [
            "Work function and threshold frequency confusion",
            "De Broglie wavelength calculation errors",
            "Misapplication of Einstein's photoelectric equation"
        ],
        estimatedTime: "6-8 hours",
        dependencies: ["optics-wave"],
        priority: "medium",
        position: { x: 400, y: 600 }
    },
    {
        code: "semiconductors",
        title: "Semiconductor Electronics",
        description: "Energy bands, intrinsic and extrinsic semiconductors, p-n junction diodes, transistors, and digital electronics fundamentals.",
        subject: "physics-12-cbse",
        examWeight: 30,
        requiredDepth: "Understand",
        commonMistakes: [
            "Forward and reverse bias confusion in p-n junctions",
            "Transistor CE, CB, CC configuration mixing",
            "Logic gate truth table errors"
        ],
        estimatedTime: "10-12 hours",
        dependencies: [],
        priority: "medium",
        position: { x: 700, y: 300 }
    },
    // LOW PRIORITY TOPICS
    {
        code: "atoms",
        title: "Atoms",
        description: "Rutherford's model, Bohr's model, energy levels, spectral lines, and hydrogen spectrum.",
        subject: "physics-12-cbse",
        examWeight: 15,
        requiredDepth: "Familiar",
        commonMistakes: [
            "Energy level transition calculations",
            "Spectral series (Lyman, Balmer, Paschen) confusion",
            "Limitations of Bohr model not understood"
        ],
        estimatedTime: "5-6 hours",
        dependencies: ["dual-nature"],
        priority: "low",
        position: { x: 550, y: 600 }
    },
    {
        code: "nuclei",
        title: "Nuclei",
        description: "Nuclear structure, binding energy, radioactivity, nuclear reactions, and nuclear fission and fusion.",
        subject: "physics-12-cbse",
        examWeight: 15,
        requiredDepth: "Familiar",
        commonMistakes: [
            "Half-life and decay constant calculation errors",
            "Q-value formula confusion",
            "Nuclear reaction balancing (mass and charge)"
        ],
        estimatedTime: "5-6 hours",
        dependencies: ["atoms"],
        priority: "low",
        position: { x: 550, y: 750 }
    },
    {
        code: "communication",
        title: "Communication Systems",
        description: "Elements of communication systems, bandwidth, signal propagation modes, and modulation techniques (AM and FM).",
        subject: "physics-12-cbse",
        examWeight: 10,
        requiredDepth: "Familiar",
        commonMistakes: [
            "Modulation index calculation errors",
            "Bandwidth requirements confusion",
            "Demodulation process unclear"
        ],
        estimatedTime: "4-5 hours",
        dependencies: ["semiconductors"],
        priority: "low",
        position: { x: 700, y: 450 }
    }
];

// ============================================================================
// Seeding Functions
// ============================================================================

async function clearDatabase() {
    console.log("🗑️  Clearing existing data...");
    await Course.deleteMany({});
    await Subject.deleteMany({});
    await Topic.deleteMany({});
    console.log("✅ Database cleared");
}

async function seedCourses() {
    console.log("📚 Seeding courses...");
    for (const course of courses) {
        await Course.findOneAndUpdate(
            { code: course.code },
            course,
            { upsert: true, new: true }
        );
    }
    console.log(`✅ Seeded ${courses.length} courses`);
}

async function seedSubjects() {
    console.log("📖 Seeding subjects...");
    await Subject.findOneAndUpdate(
        { _id: physics12Subject._id },
        physics12Subject,
        { upsert: true, new: true }
    );
    console.log("✅ Seeded Class 12 Physics (CBSE)");
}

async function seedTopics() {
    console.log("📝 Seeding topics...");
    for (const topic of physics12Topics) {
        await Topic.findOneAndUpdate(
            { subject: topic.subject, code: topic.code },
            topic,
            { upsert: true, new: true }
        );
    }
    console.log(`✅ Seeded ${physics12Topics.length} topics`);
}

async function createIndexes() {
    console.log("🔧 Creating indexes...");
    await Course.createIndexes();
    await Subject.createIndexes();
    await Topic.createIndexes();
    console.log("✅ Indexes created");
}

async function main() {
    console.log("🌱 Starting database seed...\n");

    try {
        // Connect to MongoDB
        console.log("🔌 Connecting to MongoDB...");
        await mongoose.connect(env.DATABASE_URL);
        console.log("✅ Connected to MongoDB\n");

        // Clear and seed
        await clearDatabase();
        await seedCourses();
        await seedSubjects();
        await seedTopics();
        await createIndexes();

        console.log("\n🎉 Database seeding completed successfully!");

        // Display summary
        const courseCount = await Course.countDocuments();
        const subjectCount = await Subject.countDocuments();
        const topicCount = await Topic.countDocuments();

        console.log("\n📊 Summary:");
        console.log(`   Courses: ${courseCount}`);
        console.log(`   Subjects: ${subjectCount}`);
        console.log(`   Topics: ${topicCount}`);

    } catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log("\n🔌 Disconnected from MongoDB");
    }
}

// Run the seed
main();
