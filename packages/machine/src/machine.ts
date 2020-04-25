type Filter<T, F> = T extends F ? T : never;

export type Context = any;
export interface Event<T = string> {
  type: T;
}

export type GuardFunction<C extends Context, E extends Event> = (
  context: C,
  event: E
) => boolean;

export type ReduceFunction<C extends Context, E extends Event> = (
  context: C,
  event: E
) => C;

export type ActionFunction<C extends Context, E extends Event> = (
  context: C,
  event: E
) => any;

export interface Transition<C extends Context, E extends Event> {
  to: string;
  guards?: GuardFunction<C, E>[];
  reducers?: ReduceFunction<C, E>[];
  actions?: ActionFunction<C, E>[];
}

export type Transitions<C extends Context, E extends Event> = {
  [P in E["type"]]: Transition<C, Filter<E, { type: P }>>
};

export interface State<
  N = string,
  C extends Context = Context,
  E extends Event = Event
> {
  name: N;
  transitions?: Transitions<C, E>;
}

export type States<S extends { name: string }> = {
  [P in S["name"]]: Filter<S, { name: P }>
};

// helpers
export function state<
  N = string,
  C extends Context = Context,
  E extends Event = Event
>(name: N, transitions?: Transitions<C, E>): State<N, C, E> {
  return {
    name,
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
