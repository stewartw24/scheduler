/**
 * This file now re-exports the generic GeneticAlgorithm implementation from the core folder.
 * This allows existing code to continue using this file without changes while leveraging
 * the generic implementation.
 */
export { GeneticAlgorithm } from './core/GeneticAlgorithm';
export { Individual } from './core/Individual';
export { Population } from './core/Population';
export type { IProblemDomain } from './core/IProblemDomain';

// Default export for backward compatibility
import { GeneticAlgorithm as CoreGeneticAlgorithm } from './core/GeneticAlgorithm';
export default CoreGeneticAlgorithm;
