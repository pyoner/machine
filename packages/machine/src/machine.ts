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

export interface Transition<
  IDs extends keyof any,
  C extends Context,
  E extends Event
> {
  to: IDs;
  guard?: GuardFunction<C, E>;
  reducer?: ReduceFunction<C, E>;
  action?: ActionFunction<C, E>;
}

export type Transitions<
  IDs extends keyof any,
  C extends Context,
  E extends Event
> = { [P in E["type"]]: Transition<IDs, C, Extract<E, { type: P }>> };

export interface State<
  IDs extends keyof any,
  ID extends IDs,
  C extends Context = Context,
  E extends Event = Event
> {
  id: ID;
  on?: Transitions<IDs, C, E>;
}

export type Machine<S extends { id: keyof any }> = {
  initial: S["id"];
  states: { [P in S["id"]]: Extract<S, { id: P }> };
};
