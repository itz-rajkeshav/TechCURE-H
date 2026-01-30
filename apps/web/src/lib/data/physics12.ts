import type { Subject } from '../types';

export const physics12CBSE: Subject = {
    id: 'physics-12-cbse',
    name: 'Physics',
    course: 'CBSE',
    class: '12',
    topics: [
        {
            id: 'electrostatics',
            title: 'Electrostatics',
            description: 'Electric charges, fields, potential, and capacitance',
            examWeight: 50,
            requiredDepth: 'Master',
            commonMistakes: [
                'Sign errors in potential calculations',
                'Confusing field vs potential',
                'Incorrect Gauss law applications'
            ],
            estimatedTime: '15-18 hours',
            dependencies: [],
            priority: 'high',
            position: { x: 250, y: 0 }
        },
        {
            id: 'current-electricity',
            title: 'Current Electricity',
            description: 'Ohm\'s law, circuits, and electrical measurements',
            examWeight: 35,
            requiredDepth: 'Master',
            commonMistakes: [
                'Incorrect Kirchhoff\'s law setup',
                'Wheatstone bridge errors',
                'Meter bridge calculation mistakes'
            ],
            estimatedTime: '12-14 hours',
            dependencies: ['electrostatics'],
            priority: 'high',
            position: { x: 250, y: 150 }
        },
        {
            id: 'magnetic-effects',
            title: 'Magnetic Effects of Current',
            description: 'Biot-Savart law, Ampere\'s law, and moving charges',
            examWeight: 40,
            requiredDepth: 'Master',
            commonMistakes: [
                'Direction confusion with right-hand rules',
                'Integration errors in Biot-Savart',
                'Torque on dipole formula mistakes'
            ],
            estimatedTime: '14-16 hours',
            dependencies: ['current-electricity'],
            priority: 'high',
            position: { x: 100, y: 300 }
        },
        {
            id: 'emi',
            title: 'Electromagnetic Induction',
            description: 'Faraday\'s law, Lenz\'s law, and induced currents',
            examWeight: 45,
            requiredDepth: 'Master',
            commonMistakes: [
                'Forgetting Lenz\'s law direction',
                'Incorrect flux calculations',
                'Motional EMF sign errors'
            ],
            estimatedTime: '12-14 hours',
            dependencies: ['magnetic-effects'],
            priority: 'high',
            position: { x: 100, y: 450 }
        },
        {
            id: 'ac-circuits',
            title: 'Alternating Current',
            description: 'AC circuits, resonance, and power',
            examWeight: 30,
            requiredDepth: 'Understand',
            commonMistakes: [
                'Phase angle confusion',
                'Impedance calculation errors',
                'Power factor misconceptions'
            ],
            estimatedTime: '10-12 hours',
            dependencies: ['emi'],
            priority: 'medium',
            position: { x: 100, y: 600 }
        },
        {
            id: 'optics-ray',
            title: 'Ray Optics',
            description: 'Reflection, refraction, and optical instruments',
            examWeight: 35,
            requiredDepth: 'Master',
            commonMistakes: [
                'Sign convention errors',
                'Lens/mirror formula confusion',
                'Magnification calculation errors'
            ],
            estimatedTime: '12-14 hours',
            dependencies: [],
            priority: 'high',
            position: { x: 400, y: 300 }
        },
        {
            id: 'optics-wave',
            title: 'Wave Optics',
            description: 'Interference, diffraction, and polarization',
            examWeight: 25,
            requiredDepth: 'Understand',
            commonMistakes: [
                'Path difference confusion',
                'Fringe width formula errors',
                'Polarization angle mistakes'
            ],
            estimatedTime: '8-10 hours',
            dependencies: ['optics-ray'],
            priority: 'medium',
            position: { x: 400, y: 450 }
        },
        {
            id: 'dual-nature',
            title: 'Dual Nature of Radiation',
            description: 'Photoelectric effect and matter waves',
            examWeight: 20,
            requiredDepth: 'Understand',
            commonMistakes: [
                'Work function confusion',
                'De Broglie wavelength errors',
                'Einstein\'s equation misapplication'
            ],
            estimatedTime: '6-8 hours',
            dependencies: ['optics-wave'],
            priority: 'medium',
            position: { x: 400, y: 600 }
        },
        {
            id: 'atoms',
            title: 'Atoms',
            description: 'Rutherford and Bohr models',
            examWeight: 15,
            requiredDepth: 'Familiar',
            commonMistakes: [
                'Energy level calculations',
                'Spectral series confusion',
                'Bohr model limitations'
            ],
            estimatedTime: '5-6 hours',
            dependencies: ['dual-nature'],
            priority: 'low',
            position: { x: 550, y: 600 }
        },
        {
            id: 'nuclei',
            title: 'Nuclei',
            description: 'Nuclear structure and radioactivity',
            examWeight: 15,
            requiredDepth: 'Familiar',
            commonMistakes: [
                'Half-life calculation errors',
                'Q-value formula confusion',
                'Nuclear reaction balancing'
            ],
            estimatedTime: '5-6 hours',
            dependencies: ['atoms'],
            priority: 'low',
            position: { x: 550, y: 750 }
        },
        {
            id: 'semiconductors',
            title: 'Semiconductor Electronics',
            description: 'Diodes, transistors, and logic gates',
            examWeight: 30,
            requiredDepth: 'Understand',
            commonMistakes: [
                'PN junction biasing confusion',
                'Transistor configuration errors',
                'Logic gate truth tables'
            ],
            estimatedTime: '10-12 hours',
            dependencies: [],
            priority: 'medium',
            position: { x: 700, y: 300 }
        },
        {
            id: 'communication',
            title: 'Communication Systems',
            description: 'Signal propagation and modulation',
            examWeight: 10,
            requiredDepth: 'Familiar',
            commonMistakes: [
                'Modulation index confusion',
                'Bandwidth calculation errors',
                'Demodulation process unclear'
            ],
            estimatedTime: '4-5 hours',
            dependencies: ['semiconductors'],
            priority: 'low',
            position: { x: 700, y: 450 }
        }
    ]
};
