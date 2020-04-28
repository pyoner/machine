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

export interface Transition<IDs, C extends Context, E extends Event> {
  to: IDs;
  guards?: GuardFunction<C, E>[];
  reducers?: ReduceFunction<C, E>[];
  actions?: ActionFunction<C, E>[];
}

export type Transitions<IDs, C extends Context, E extends Event> = {
  [P in E["type"]]: Transition<IDs, C, Extract<E, { type: P }>>
};

export interface State<
  IDs extends string,
  ID extends IDs,
  C extends Context = Context,
  E extends Event = Event
> {
  id: ID;
  on?: Transitions<IDs, C, E>;
}

export type Machine<S extends { id: string }> = {
  initial: S["id"];
  states: { [P in S["id"]]: Extract<S, { id: P }> };
};
