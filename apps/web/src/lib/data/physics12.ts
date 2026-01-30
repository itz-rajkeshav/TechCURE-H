/**
 * Class 12 Physics (CBSE) - Static Data
 * 
 * This file contains the complete topic data for CBSE Class 12 Physics.
 * Data is structured for use with the LearnPath visualization system.
 * 
 * Topic Priority Breakdown:
 * - High (5 topics): Core exam topics that require mastery
 * - Medium (4 topics): Important topics for understanding
 * - Low (3 topics): Topics that require familiarity
 */

import type { Subject, Topic } from '../types';

/**
 * All topics for Class 12 Physics (CBSE)
 */
const topics: Topic[] = [
    // =========================================================================
    // HIGH PRIORITY TOPICS (Electromagnetism & Optics Core)
    // =========================================================================
    {
        id: 'electrostatics',
        title: 'Electrostatics',
        description: 'Electric charges, Coulomb\'s law, electric fields, electric potential, capacitance, and dielectrics. Foundation for all electricity topics.',
        examWeight: 50,
        requiredDepth: 'Master',
        commonMistakes: [
            'Sign errors in electric potential calculations',
            'Confusing electric field with electric potential',
            'Incorrect application of Gauss\'s law for non-symmetric charge distributions'
        ],
        estimatedTime: '15-18 hours',
        dependencies: [],
        priority: 'high',
        position: { x: 250, y: 0 }
    },
    {
        id: 'current-electricity',
        title: 'Current Electricity',
        description: 'Ohm\'s law, electrical resistance, cells and EMF, Kirchhoff\'s laws, Wheatstone bridge, and meter bridge.',
        examWeight: 35,
        requiredDepth: 'Master',
        commonMistakes: [
            'Incorrect setup of Kirchhoff\'s loop equations',
            'Wheatstone bridge balance condition errors',
            'Meter bridge calculation mistakes with end corrections'
        ],
        estimatedTime: '12-14 hours',
        dependencies: ['electrostatics'],
        priority: 'high',
        position: { x: 250, y: 150 }
    },
    {
        id: 'magnetic-effects',
        title: 'Magnetic Effects of Current',
        description: 'Biot-Savart law, Ampere\'s circuital law, motion of charges in magnetic fields, force on current-carrying conductors, and magnetic dipoles.',
        examWeight: 40,
        requiredDepth: 'Master',
        commonMistakes: [
            'Direction confusion when applying right-hand rule',
            'Integration errors in Biot-Savart law applications',
            'Torque on magnetic dipole formula misapplication'
        ],
        estimatedTime: '14-16 hours',
        dependencies: ['current-electricity'],
        priority: 'high',
        position: { x: 100, y: 300 }
    },
    {
        id: 'emi',
        title: 'Electromagnetic Induction',
        description: 'Faraday\'s law, Lenz\'s law, motional EMF, eddy currents, self and mutual inductance.',
        examWeight: 45,
        requiredDepth: 'Master',
        commonMistakes: [
            'Forgetting to apply Lenz\'s law for direction',
            'Incorrect magnetic flux calculations',
            'Sign errors in motional EMF problems'
        ],
        estimatedTime: '12-14 hours',
        dependencies: ['magnetic-effects'],
        priority: 'high',
        position: { x: 100, y: 450 }
    },
    {
        id: 'optics-ray',
        title: 'Ray Optics',
        description: 'Reflection, refraction, total internal reflection, prisms, lenses, mirrors, and optical instruments like microscopes and telescopes.',
        examWeight: 35,
        requiredDepth: 'Master',
        commonMistakes: [
            'Sign convention errors in mirror and lens equations',
            'Confusion between lens maker\'s formula and thin lens formula',
            'Magnification calculation errors (linear vs angular)'
        ],
        estimatedTime: '12-14 hours',
        dependencies: [],
        priority: 'high',
        position: { x: 400, y: 300 }
    },

    // =========================================================================
    // MEDIUM PRIORITY TOPICS (Important for Understanding)
    // =========================================================================
    {
        id: 'ac-circuits',
        title: 'Alternating Current',
        description: 'AC circuits with resistors, inductors, and capacitors. LCR circuits, resonance, power in AC circuits, and transformers.',
        examWeight: 30,
        requiredDepth: 'Understand',
        commonMistakes: [
            'Phase angle confusion between voltage and current',
            'Impedance calculation errors in LCR circuits',
            'Power factor misconceptions in reactive circuits'
        ],
        estimatedTime: '10-12 hours',
        dependencies: ['emi'],
        priority: 'medium',
        position: { x: 100, y: 600 }
    },
    {
        id: 'optics-wave',
        title: 'Wave Optics',
        description: 'Huygens\' principle, interference of light, Young\'s double slit experiment, diffraction, and polarization.',
        examWeight: 25,
        requiredDepth: 'Understand',
        commonMistakes: [
            'Path difference vs phase difference confusion',
            'Fringe width formula errors',
            'Brewster\'s angle and polarization calculations'
        ],
        estimatedTime: '8-10 hours',
        dependencies: ['optics-ray'],
        priority: 'medium',
        position: { x: 400, y: 450 }
    },
    {
        id: 'dual-nature',
        title: 'Dual Nature of Radiation and Matter',
        description: 'Photoelectric effect, Einstein\'s photoelectric equation, de Broglie hypothesis, and Davisson-Germer experiment.',
        examWeight: 20,
        requiredDepth: 'Understand',
        commonMistakes: [
            'Work function and threshold frequency confusion',
            'De Broglie wavelength calculation errors',
            'Misapplication of Einstein\'s photoelectric equation'
        ],
        estimatedTime: '6-8 hours',
        dependencies: ['optics-wave'],
        priority: 'medium',
        position: { x: 400, y: 600 }
    },
    {
        id: 'semiconductors',
        title: 'Semiconductor Electronics',
        description: 'Energy bands, intrinsic and extrinsic semiconductors, p-n junction diodes, transistors, and digital electronics fundamentals.',
        examWeight: 30,
        requiredDepth: 'Understand',
        commonMistakes: [
            'Forward and reverse bias confusion in p-n junctions',
            'Transistor CE, CB, CC configuration mixing',
            'Logic gate truth table errors'
        ],
        estimatedTime: '10-12 hours',
        dependencies: [],
        priority: 'medium',
        position: { x: 700, y: 300 }
    },

    // =========================================================================
    // LOW PRIORITY TOPICS (Awareness Level)
    // =========================================================================
    {
        id: 'atoms',
        title: 'Atoms',
        description: 'Rutherford\'s model, Bohr\'s model, energy levels, spectral lines, and hydrogen spectrum.',
        examWeight: 15,
        requiredDepth: 'Familiar',
        commonMistakes: [
            'Energy level transition calculations',
            'Spectral series (Lyman, Balmer, Paschen) confusion',
            'Limitations of Bohr model not understood'
        ],
        estimatedTime: '5-6 hours',
        dependencies: ['dual-nature'],
        priority: 'low',
        position: { x: 550, y: 600 }
    },
    {
        id: 'nuclei',
        title: 'Nuclei',
        description: 'Nuclear structure, binding energy, radioactivity, nuclear reactions, and nuclear fission and fusion.',
        examWeight: 15,
        requiredDepth: 'Familiar',
        commonMistakes: [
            'Half-life and decay constant calculation errors',
            'Q-value formula confusion',
            'Nuclear reaction balancing (mass and charge)'
        ],
        estimatedTime: '5-6 hours',
        dependencies: ['atoms'],
        priority: 'low',
        position: { x: 550, y: 750 }
    },
    {
        id: 'communication',
        title: 'Communication Systems',
        description: 'Elements of communication systems, bandwidth, signal propagation modes, and modulation techniques (AM and FM).',
        examWeight: 10,
        requiredDepth: 'Familiar',
        commonMistakes: [
            'Modulation index calculation errors',
            'Bandwidth requirements confusion',
            'Demodulation process unclear'
        ],
        estimatedTime: '4-5 hours',
        dependencies: ['semiconductors'],
        priority: 'low',
        position: { x: 700, y: 450 }
    }
];

/**
 * Complete Class 12 Physics (CBSE) subject data
 */
export const physics12CBSE: Subject = {
    id: 'physics-12-cbse',
    name: 'Physics',
    course: 'CBSE',
    class: '12',
    topics
};

/**
 * Export individual topics for direct access if needed
 */
export const physics12Topics = topics;

/**
 * Quick lookup map for topics by ID
 */
export const physics12TopicsMap = new Map<string, Topic>(
    topics.map(topic => [topic.id, topic])
);

/**
 * Get all high priority topics
 */
export const getHighPriorityTopics = (): Topic[] =>
    topics.filter(t => t.priority === 'high');

/**
 * Get all medium priority topics
 */
export const getMediumPriorityTopics = (): Topic[] =>
    topics.filter(t => t.priority === 'medium');

/**
 * Get all low priority topics
 */
export const getLowPriorityTopics = (): Topic[] =>
    topics.filter(t => t.priority === 'low');
