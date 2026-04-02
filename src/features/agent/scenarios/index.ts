import type { ScenarioDefinition } from './types';
import scenario1 from './scenario1-documents';
import scenario2 from './scenario2-knowledge';
import scenario3 from './scenario3-schedule';
import scenario4 from './scenario4-estimation';

export const scenarios: ScenarioDefinition[] = [
  scenario1, scenario2, scenario3, scenario4,
];

export function findScenario(input: string): ScenarioDefinition | null {
  for (const scenario of scenarios) {
    if (scenario.keywords.some((kw) => input.includes(kw))) {
      return scenario;
    }
  }
  return null;
}
