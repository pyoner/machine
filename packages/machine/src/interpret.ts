import { Event, Queue, Queues } from "./machine";

export const queues: Queues = {};

export function send(queue: Queue, event: Event) {
  queue.push(event);
}

export function getQueueById(id: number) {
  return queues[id];
}
