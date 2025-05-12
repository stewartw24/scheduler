/**
 * Interface for genetic algorithm API request parameters
 */
export interface GeneticAlgorithmApiRequest {
  populationSize: number;
  mutationRate: number;
  crossoverRate: number;
  elitismCount: number;
  tournamentSize: number;
  maxGenerations?: number;
  problemDomain: {
    type: string;
    [key: string]: unknown;
  };
}

/**
 * Interface for genetic algorithm API response
 */
export interface GeneticAlgorithmApiResponse<R = unknown> {
  solution: R;
  success: boolean;
  error?: string;
}
