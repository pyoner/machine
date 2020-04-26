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
  ID = string,
  C extends Context = Context,
  E extends Event = Event
> {
  id: ID;
  transitions?: Transitions<C, E>;
}

export type States<S extends { id: string }> = {
  [P in S["id"]]: Filter<S, { id: P }>
};
