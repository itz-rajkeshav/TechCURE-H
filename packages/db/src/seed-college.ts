/**
 * College Courses Database Seeding Script
 * 
 * Seeds the database with college-level courses and subjects:
 * - Engineering courses (B.Tech CSE, ECE, Mechanical, etc.)
 * - Computer Applications (BCA, MCA)
 * - Science courses (B.Sc Physics, Chemistry, Math, CS)
 * - Commerce courses (B.Com, BBA, MBA)
 * - Arts & Humanities (BA English, History, Psychology)
 * - Medical courses (MBBS, BDS, B.Pharma)
 * - Law courses (LLB)
 * - Diploma courses
 * 
 * Run with: pnpm seed:college
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
        subject: { type: String, ref: "Subject", required: true },
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        examWeight: { type: Number, required: true, min: 0, max: 100, default: 0 },
        requiredDepth: { type: String, required: true, enum: ["Master", "Understand", "Familiar"], default: "Understand" },
        commonMistakes: [{ type: String, trim: true }],
        estimatedTime: { type: String, required: true, trim: true },
        dependencies: [{ type: String, trim: true }],
        priority: { type: String, required: true, enum: ["high", "medium", "low"], default: "medium" },
        position: { type: positionSchema, required: true }
    },
    { collection: "topics", timestamps: true }
);

// ============================================================================
// College Course Data
// ============================================================================

const collegeCourses = [
    // Engineering Courses
    {
        _id: "btech-cse",
        code: "btech-cse",
        name: "B.Tech Computer Science Engineering",
        description: "Bachelor of Technology in Computer Science and Engineering covering algorithms, programming, software engineering, and computer systems.",
        classes: ["1", "2", "3", "4"]
    },
    {
        _id: "btech-ece",
        code: "btech-ece", 
        name: "B.Tech Electronics and Communication",
        description: "Bachelor of Technology in Electronics and Communication Engineering focusing on electronic circuits, communication systems, and signal processing.",
        classes: ["1", "2", "3", "4"]
    },
    {
        _id: "btech-mech",
        code: "btech-mech",
        name: "B.Tech Mechanical Engineering", 
        description: "Bachelor of Technology in Mechanical Engineering covering thermodynamics, fluid mechanics, manufacturing, and machine design.",
        classes: ["1", "2", "3", "4"]
    },
    {
        _id: "btech-civil",
        code: "btech-civil",
        name: "B.Tech Civil Engineering",
        description: "Bachelor of Technology in Civil Engineering focusing on structural engineering, construction, transportation, and environmental engineering.",
        classes: ["1", "2", "3", "4"]
    },
    {
        _id: "btech-eee",
        code: "btech-eee",
        name: "B.Tech Electrical and Electronics",
        description: "Bachelor of Technology in Electrical and Electronics Engineering covering power systems, control systems, and electrical machines.",
        classes: ["1", "2", "3", "4"]
    },
    
    // Computer Applications
    {
        _id: "bca",
        code: "bca",
        name: "Bachelor of Computer Applications",
        description: "Three-year undergraduate degree focusing on computer applications, programming, and software development.",
        classes: ["1", "2", "3"]
    },
    {
        _id: "mca",
        code: "mca",
        name: "Master of Computer Applications",
        description: "Two-year postgraduate degree in computer applications with advanced programming and software engineering concepts.",
        classes: ["1", "2"]
    },
    
    // Science Courses
    {
        _id: "bsc-cs",
        code: "bsc-cs",
        name: "B.Sc Computer Science",
        description: "Bachelor of Science in Computer Science covering theoretical computer science, programming, and mathematics.",
        classes: ["1", "2", "3"]
    },
    {
        _id: "bsc-physics",
        code: "bsc-physics",
        name: "B.Sc Physics",
        description: "Bachelor of Science in Physics covering classical mechanics, quantum physics, thermodynamics, and optics.",
        classes: ["1", "2", "3"]
    },
    {
        _id: "bsc-chemistry",
        code: "bsc-chemistry",
        name: "B.Sc Chemistry",
        description: "Bachelor of Science in Chemistry covering organic, inorganic, and physical chemistry.",
        classes: ["1", "2", "3"]
    },
    {
        _id: "bsc-math",
        code: "bsc-math",
        name: "B.Sc Mathematics",
        description: "Bachelor of Science in Mathematics covering calculus, algebra, statistics, and applied mathematics.",
        classes: ["1", "2", "3"]
    },
    
    // Commerce Courses
    {
        _id: "bcom",
        code: "bcom",
        name: "Bachelor of Commerce",
        description: "Three-year undergraduate degree in commerce covering accounting, finance, taxation, and business studies.",
        classes: ["1", "2", "3"]
    },
    {
        _id: "bba",
        code: "bba",
        name: "Bachelor of Business Administration",
        description: "Three-year undergraduate degree focusing on business management, marketing, and organizational behavior.",
        classes: ["1", "2", "3"]
    },
    {
        _id: "mba",
        code: "mba",
        name: "Master of Business Administration",
        description: "Two-year postgraduate degree in business administration covering strategic management and leadership.",
        classes: ["1", "2"]
    },
    
    // Arts & Humanities
    {
        _id: "ba-english",
        code: "ba-english",
        name: "Bachelor of Arts - English",
        description: "Three-year undergraduate degree in English literature, language studies, and communication.",
        classes: ["1", "2", "3"]
    },
    {
        _id: "ba-history",
        code: "ba-history", 
        name: "Bachelor of Arts - History",
        description: "Three-year undergraduate degree covering world history, Indian history, and historical research methods.",
        classes: ["1", "2", "3"]
    },
    {
        _id: "ba-psychology",
        code: "ba-psychology",
        name: "Bachelor of Arts - Psychology", 
        description: "Three-year undergraduate degree in psychology covering cognitive, social, and developmental psychology.",
        classes: ["1", "2", "3"]
    },
    
    // Medical Courses
    {
        _id: "mbbs",
        code: "mbbs",
        name: "Bachelor of Medicine and Bachelor of Surgery",
        description: "Five-year undergraduate medical degree covering anatomy, physiology, pathology, and clinical medicine.",
        classes: ["1", "2", "3", "4", "5"]
    },
    {
        _id: "bds",
        code: "bds",
        name: "Bachelor of Dental Surgery",
        description: "Four-year undergraduate dental degree covering oral anatomy, dental procedures, and oral health.",
        classes: ["1", "2", "3", "4"]
    },
    {
        _id: "bpharma",
        code: "bpharma",
        name: "Bachelor of Pharmacy",
        description: "Four-year undergraduate degree in pharmaceutical sciences covering drug development and pharmacy practice.",
        classes: ["1", "2", "3", "4"]
    },
    
    // Law Courses
    {
        _id: "llb",
        code: "llb",
        name: "Bachelor of Laws",
        description: "Three-year undergraduate law degree covering constitutional law, criminal law, and civil procedures.",
        classes: ["1", "2", "3"]
    },
    
    // Diploma Courses
    {
        _id: "diploma-cse",
        code: "diploma-cse",
        name: "Diploma in Computer Science Engineering",
        description: "Three-year diploma focusing on practical computer science skills and programming.",
        classes: ["1", "2", "3"]
    },
    {
        _id: "diploma-ece",
        code: "diploma-ece",
        name: "Diploma in Electronics and Communication",
        description: "Three-year diploma covering electronics fundamentals and communication systems.",
        classes: ["1", "2", "3"]
    },
    {
        _id: "diploma-mech",
        code: "diploma-mech",
        name: "Diploma in Mechanical Engineering",
        description: "Three-year diploma covering mechanical engineering fundamentals and manufacturing processes.",
        classes: ["1", "2", "3"]
    }
];

// ============================================================================
// Sample College Subjects
// ============================================================================

const collegeSubjects = [
    // B.Tech CSE Year 1 subjects
    {
        _id: "btech-cse-1-programming",
        code: "programming",
        name: "Programming Fundamentals",
        description: "Introduction to programming concepts using C and Python",
        course: "btech-cse",
        class: "1",
        examType: "board"
    },
    {
        _id: "btech-cse-1-math",
        code: "engineering-math-1",
        name: "Engineering Mathematics I",
        description: "Calculus, linear algebra, and differential equations for engineers", 
        course: "btech-cse",
        class: "1",
        examType: "board"
    },
    {
        _id: "btech-cse-1-physics",
        code: "engineering-physics",
        name: "Engineering Physics",
        description: "Physics concepts applied to engineering problems",
        course: "btech-cse",
        class: "1",
        examType: "board"
    },
    
    // B.Tech CSE Year 2 subjects
    {
        _id: "btech-cse-2-dsa",
        code: "data-structures",
        name: "Data Structures and Algorithms",
        description: "Fundamental data structures and algorithm design techniques",
        course: "btech-cse",
        class: "2", 
        examType: "board"
    },
    {
        _id: "btech-cse-2-oop",
        code: "object-oriented-programming",
        name: "Object Oriented Programming",
        description: "OOP concepts using Java and C++",
        course: "btech-cse",
        class: "2",
        examType: "board"
    },
    {
        _id: "btech-cse-2-dbms",
        code: "database-systems",
        name: "Database Management Systems", 
        description: "Relational databases, SQL, and database design",
        course: "btech-cse",
        class: "2",
        examType: "board"
    },
    
    // BCA Year 1 subjects
    {
        _id: "bca-1-computer-fundamentals",
        code: "computer-fundamentals",
        name: "Computer Fundamentals",
        description: "Basic computer concepts, hardware, and software",
        course: "bca",
        class: "1",
        examType: "board"
    },
    {
        _id: "bca-1-c-programming", 
        code: "c-programming",
        name: "C Programming",
        description: "Programming fundamentals using C language",
        course: "bca",
        class: "1",
        examType: "board"
    },
    {
        _id: "bca-1-math",
        code: "mathematics-bca",
        name: "Mathematics for BCA",
        description: "Discrete mathematics and statistics for computer applications",
        course: "bca",
        class: "1",
        examType: "board"
    },
    
    // MBA subjects
    {
        _id: "mba-1-management",
        code: "management-principles",
        name: "Principles of Management",
        description: "Fundamental management concepts and organizational behavior",
        course: "mba", 
        class: "1",
        examType: "board"
    },
    {
        _id: "mba-1-accounting",
        code: "managerial-accounting",
        name: "Managerial Accounting",
        description: "Financial and cost accounting for decision making",
        course: "mba",
        class: "1", 
        examType: "board"
    },
    {
        _id: "mba-1-marketing",
        code: "marketing-management",
        name: "Marketing Management",
        description: "Marketing strategies, consumer behavior, and market research",
        course: "mba",
        class: "1",
        examType: "board"
    }
];

// ============================================================================
// Sample Topics for College Subjects
// ============================================================================

const collegeTopics = [
    // Programming Fundamentals topics
    {
        code: "variables-datatypes",
        subject: "btech-cse-1-programming",
        title: "Variables and Data Types",
        description: "Understanding different data types, variable declaration, and memory allocation in programming languages.",
        examWeight: 15,
        requiredDepth: "Master",
        commonMistakes: [
            "Incorrect variable initialization", 
            "Type conversion errors",
            "Scope confusion with global and local variables"
        ],
        estimatedTime: "8-10 hours",
        dependencies: [],
        priority: "high",
        position: { x: 100, y: 0 }
    },
    {
        code: "control-structures",
        subject: "btech-cse-1-programming", 
        title: "Control Structures",
        description: "Conditional statements, loops, and program flow control mechanisms.",
        examWeight: 20,
        requiredDepth: "Master",
        commonMistakes: [
            "Infinite loop creation",
            "Incorrect logical conditions",
            "Off-by-one errors in loops"
        ],
        estimatedTime: "12-15 hours",
        dependencies: ["variables-datatypes"],
        priority: "high",
        position: { x: 100, y: 150 }
    },
    {
        code: "functions",
        subject: "btech-cse-1-programming",
        title: "Functions and Procedures", 
        description: "Function definition, parameter passing, recursion, and modular programming concepts.",
        examWeight: 18,
        requiredDepth: "Master",
        commonMistakes: [
            "Parameter vs argument confusion",
            "Recursion base case errors", 
            "Return value handling mistakes"
        ],
        estimatedTime: "10-12 hours",
        dependencies: ["control-structures"],
        priority: "high",
        position: { x: 100, y: 300 }
    },
    
    // Data Structures topics
    {
        code: "arrays-strings",
        subject: "btech-cse-2-dsa",
        title: "Arrays and Strings",
        description: "Array operations, string manipulation, and memory management for sequential data structures.",
        examWeight: 16,
        requiredDepth: "Master", 
        commonMistakes: [
            "Array index out of bounds",
            "String null termination issues",
            "Memory allocation errors"
        ],
        estimatedTime: "10-12 hours", 
        dependencies: [],
        priority: "high",
        position: { x: 250, y: 0 }
    },
    {
        code: "linked-lists",
        subject: "btech-cse-2-dsa",
        title: "Linked Lists",
        description: "Single, double, and circular linked lists with insertion, deletion, and traversal operations.",
        examWeight: 18,
        requiredDepth: "Master",
        commonMistakes: [
            "Null pointer dereferencing",
            "Memory leaks in deletion",
            "Incorrect pointer manipulation"
        ],
        estimatedTime: "12-15 hours",
        dependencies: ["arrays-strings"], 
        priority: "high",
        position: { x: 250, y: 150 }
    },
    {
        code: "stacks-queues",
        subject: "btech-cse-2-dsa",
        title: "Stacks and Queues",
        description: "LIFO and FIFO data structures with applications in expression evaluation and BFS/DFS.",
        examWeight: 15,
        requiredDepth: "Understand",
        commonMistakes: [
            "Stack overflow/underflow",
            "Queue implementation errors",
            "Incorrect application selection"
        ],
        estimatedTime: "8-10 hours",
        dependencies: ["linked-lists"],
        priority: "medium",
        position: { x: 250, y: 300 }
    },
    
    // Database Systems topics
    {
        code: "relational-model",
        subject: "btech-cse-2-dbms", 
        title: "Relational Database Model",
        description: "Tables, relationships, keys, and relational algebra operations in database systems.",
        examWeight: 20,
        requiredDepth: "Master",
        commonMistakes: [
            "Primary vs foreign key confusion",
            "Normalization errors",
            "Relationship cardinality mistakes"
        ],
        estimatedTime: "12-14 hours",
        dependencies: [],
        priority: "high",
        position: { x: 400, y: 0 }
    },
    {
        code: "sql-queries",
        subject: "btech-cse-2-dbms",
        title: "SQL Queries and Operations", 
        description: "SELECT, INSERT, UPDATE, DELETE operations with joins, subqueries, and aggregate functions.",
        examWeight: 25,
        requiredDepth: "Master",
        commonMistakes: [
            "JOIN syntax errors",
            "GROUP BY clause misuse",
            "Subquery correlation issues"
        ],
        estimatedTime: "15-18 hours",
        dependencies: ["relational-model"],
        priority: "high", 
        position: { x: 400, y: 150 }
    },
    
    // BCA C Programming topics
    {
        code: "c-basics",
        subject: "bca-1-c-programming",
        title: "C Programming Basics",
        description: "C syntax, variables, operators, and basic input/output operations.",
        examWeight: 18,
        requiredDepth: "Master",
        commonMistakes: [
            "Semicolon placement errors",
            "printf/scanf format specifier mistakes", 
            "Variable declaration issues"
        ],
        estimatedTime: "10-12 hours",
        dependencies: [],
        priority: "high",
        position: { x: 100, y: 450 }
    },
    {
        code: "c-pointers",
        subject: "bca-1-c-programming",
        title: "Pointers in C",
        description: "Pointer concepts, pointer arithmetic, and dynamic memory allocation.",
        examWeight: 22,
        requiredDepth: "Master",
        commonMistakes: [
            "Null pointer dereferencing",
            "Memory leaks",
            "Pointer arithmetic errors"
        ], 
        estimatedTime: "15-18 hours",
        dependencies: ["c-basics"],
        priority: "high",
        position: { x: 100, y: 600 }
    },
    
    // MBA Management topics
    {
        code: "management-functions",
        subject: "mba-1-management",
        title: "Functions of Management",
        description: "Planning, organizing, leading, and controlling functions in management process.",
        examWeight: 20,
        requiredDepth: "Understand",
        commonMistakes: [
            "Function overlap confusion",
            "Theoretical vs practical application gaps",
            "Context-specific function selection errors"
        ],
        estimatedTime: "8-10 hours", 
        dependencies: [],
        priority: "high",
        position: { x: 550, y: 0 }
    },
    {
        code: "organizational-behavior",
        subject: "mba-1-management", 
        title: "Organizational Behavior",
        description: "Individual and group behavior in organizations, motivation theories, and leadership styles.",
        examWeight: 18,
        requiredDepth: "Understand",
        commonMistakes: [
            "Theory application errors",
            "Cultural context ignorance", 
            "Leadership style mismatching"
        ],
        estimatedTime: "10-12 hours",
        dependencies: ["management-functions"],
        priority: "medium",
        position: { x: 550, y: 150 }
    }
];

// ============================================================================
// Seeding Functions  
// ============================================================================

async function connectDB() {
    try {
        console.log("🔌 Connecting to MongoDB...");
        await mongoose.connect(env.DATABASE_URL);
        console.log("✅ Connected to MongoDB");
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error);
        process.exit(1);
    }
}

async function clearExistingData() {
    try {
        console.log("🗑️  Clearing existing college data...");
        
        // Get models
        const Course = mongoose.model("Course", courseSchema);
        const Subject = mongoose.model("Subject", subjectSchema);  
        const Topic = mongoose.model("Topic", topicSchema);
        
        // Delete only college-related data
        await Topic.deleteMany({ subject: { $in: collegeSubjects.map(s => s._id) } });
        await Subject.deleteMany({ _id: { $in: collegeSubjects.map(s => s._id) } });
        await Course.deleteMany({ _id: { $in: collegeCourses.map(c => c._id) } });
        
        console.log("✅ College data cleared");
    } catch (error) {
        console.error("❌ Failed to clear data:", error);
        throw error;
    }
}

async function seedCourses() {
    try {
        console.log("📚 Seeding college courses...");
        const Course = mongoose.model("Course", courseSchema);
        
        await Course.insertMany(collegeCourses);
        console.log(`✅ Seeded ${collegeCourses.length} college courses`);
    } catch (error) {
        console.error("❌ Failed to seed courses:", error);
        throw error;
    }
}

async function seedSubjects() {
    try {
        console.log("📖 Seeding college subjects...");
        const Subject = mongoose.model("Subject", subjectSchema);
        
        await Subject.insertMany(collegeSubjects);
        console.log(`✅ Seeded ${collegeSubjects.length} college subjects`);
    } catch (error) {
        console.error("❌ Failed to seed subjects:", error);
        throw error;
    }
}

async function seedTopics() {
    try {
        console.log("📝 Seeding college topics...");
        const Topic = mongoose.model("Topic", topicSchema);
        
        await Topic.insertMany(collegeTopics);
        console.log(`✅ Seeded ${collegeTopics.length} college topics`);
    } catch (error) {
        console.error("❌ Failed to seed topics:", error);
        throw error;
    }
}

async function createIndexes() {
    try {
        console.log("🔧 Creating indexes...");
        
        const Course = mongoose.model("Course", courseSchema);
        const Subject = mongoose.model("Subject", subjectSchema);
        const Topic = mongoose.model("Topic", topicSchema);
        
        // Create indexes for better query performance
        await Course.createIndexes();
        await Subject.createIndexes();
        await Topic.createIndexes();
        
        console.log("✅ Indexes created");
    } catch (error) {
        console.error("❌ Failed to create indexes:", error);
        throw error;
    }
}

async function disconnectDB() {
    try {
        await mongoose.disconnect();
        console.log("🔌 Disconnected from MongoDB");
    } catch (error) {
        console.error("❌ Failed to disconnect:", error);
    }
}

// ============================================================================
// Main Seeding Process
// ============================================================================

async function seedCollegeData() {
    try {
        console.log("🌱 Starting college data seeding...\n");
        
        await connectDB();
        await clearExistingData();
        await seedCourses();
        await seedSubjects();
        await seedTopics();
        await createIndexes();
        
        console.log("\n🎉 College data seeding completed successfully!");
        console.log("\n📊 Summary:");
        console.log(`   Courses: ${collegeCourses.length}`);
        console.log(`   Subjects: ${collegeSubjects.length}`);
        console.log(`   Topics: ${collegeTopics.length}`);
        
    } catch (error) {
        console.error("\n❌ College data seeding failed:", error);
        process.exit(1);
    } finally {
        await disconnectDB();
    }
}

// Run the seeding process
seedCollegeData();