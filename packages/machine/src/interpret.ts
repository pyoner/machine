import { Event, Queue, Queues } from "./machine";

export const queues: Queues = {};

export function send<E extends Event>(queue: Queue, event: E) {
  queue.push(event);
}

export function getQueueById(id: number) {
  return queues[id];
}
