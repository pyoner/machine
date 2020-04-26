import {
  Context,
  Event,
  State,
  Transition,
  Transitions,
  GuardFunction,
  ReduceFunction,
  ActionFunction
} from "./machine";

export function state<
  ID = string,
  C extends Context = Context,
  E extends Event = Event
>(id: ID, transitions?: Transitions<C, E>): State<ID, C, E> {
  return {
    id,
    transitions
  };
}

export function transition<C extends Context, E extends Event>(
  to: string,
  guards?: GuardFunction<C, E>[],
  reducers?: ReduceFunction<C, E>[],
  actions?: ActionFunction<C, E>[]
): Transition<C, E> {
  return { to, guards, reducers, actions };
}

export function guards<C extends Context, E extends Event>(
  ...args: GuardFunction<C, E>[]
) {
  return args;
}

export function reducers<C extends Context, E extends Event>(
  ...args: ReduceFunction<C, E>[]
) {
  return args;
}

export function actions<C extends Context, E extends Event>(
  ...args: ActionFunction<C, E>[]
) {
  return args;
}
