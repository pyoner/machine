export type Context = any;
export interface Event<T extends keyof any = keyof any> {
  type: T;
}

export interface Payload<T> {
  payload: T;
}

export type DoneEvent<D> = Event<"done"> & Payload<D>;
export type ErrorEvent<E extends Error> = Event<"error"> & Payload<E>;
export type PromiseEvent<D, E extends Error> = DoneEvent<D> | ErrorEvent<E>;

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

export type InvokeFunction<C extends Context, E extends Event> = (
  context: C,
  event: E
) => Promise<C>;

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
> = {
  [P in E["type"]]:
    | Transition<IDs, C, Extract<E, { type: P }>>
    | Transition<IDs, C, Extract<E, { type: P }>>[]
};

export interface State<
  IDs extends keyof any,
  ID extends IDs,
  C extends Context = Context,
  E extends Event = Event
> {
  id: ID;
  on?: Transitions<IDs, C, E>;
  enter?: ActionFunction<C, E>;
  exit?: ActionFunction<C, E>;
}

export type Machine<S extends { id: keyof any }> = {
  initial: S["id"];
  states: { [P in S["id"]]: Extract<S, { id: P }> };
};

export type ExtractID<S> = S extends { id: infer ID } ? ID : never;

export type ExtractIDs<S> = S extends {
  on?: Record<keyof any, { to: infer TO } | { to: infer TO }[]>;
}
  ? TO
  : never;
