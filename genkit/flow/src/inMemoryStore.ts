import {
  FlowState,
  FlowStateQuery,
  FlowStateSchema,
  FlowStateStore,
} from '@google-genkit/common';
import { logger } from 'firebase-functions/v1';

/**
 * Not very useful in pactice in-memory flow state store.
 */
export class InMemoryFlowStateStore implements FlowStateStore {
  private state: Record<string, string> = {};

  load(id: string): Promise<FlowState | undefined> {
    if (!this.state[id]) {
      return Promise.resolve(undefined);
    }
    return Promise.resolve(FlowStateSchema.parse(JSON.parse(this.state[id])));
  }

  save(id: string, state: FlowState): Promise<void> {
    this.state[id] = JSON.stringify(state);
    return Promise.resolve();
  }

  async list(query?: FlowStateQuery | undefined): Promise<FlowState[]> {
    logger.debug(query, 'InMemoryFlowStateStore.list');
    return Object.values(this.state).map((s) => JSON.parse(s) as FlowState);
  }
}

export const inMemoryFlowStateStore = new InMemoryFlowStateStore();
