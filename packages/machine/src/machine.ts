export type Context = any;
export interface Event<T extends keyof any = keyof any> {
  type: T;
}

export type DoneEvent<D> = Event<"done"> & { data: D };
export type ErrorEvent<E extends Error> = Event<"error"> & { error: E };
export type PromiseEvent<D, E extends Error> = DoneEvent<D> | ErrorEvent<E>;

export type Queue = Array<Event>;
export type Queues = Record<number, Queue>;
export interface Meta {
  id: number;
  queues: Queues;
}

export type GuardFunction<
  C extends Context,
  E extends Event,
  M extends Meta
> = (context: C, event: E, meta: M) => boolean;

export type ReduceFunction<
  C extends Context,
  E extends Event,
  M extends Meta
> = (context: C, event: E, meta: M) => C;

export type ActionFunction<
  C extends Context,
  E extends Event,
  M extends Meta
> = (context: C, event: E, meta: M) => unknown;

export type EnterFunction<C extends Context, M extends Meta> = (
  context: C,
  meta: M
) => unknown;

export type ExitFunction<C extends Context, M extends Meta> = (
  context: C,
  meta: M
) => unknown;

export type InvokeFunction<D, C extends Context, M extends Meta> = (
  context: C,
  meta: M
) => Promise<D>;

export interface Transition<
  IDs extends keyof any,
  C extends Context,
  E extends Event,
  M extends Meta
> {
  to: IDs;
  guard?: GuardFunction<C, E, M>;
  reducer?: ReduceFunction<C, E, M>;
  action?: ActionFunction<C, E, M>;
}

export type Transitions<
  IDs extends keyof any,
  C extends Context,
  E extends Event,
  M extends Meta
> = {
  [P in E["type"]]:
    | Transition<IDs, C, Extract<E, { type: P }>, M>
    | Transition<IDs, C, Extract<E, { type: P }>, M>[]
};

export interface State<
  IDs extends keyof any,
  ID extends IDs,
  C extends Context = Context,
  E extends Event = Event,
  M extends Meta = Meta
> {
  id: ID;
  on?: Transitions<IDs, C, E, M>;
  enter?: EnterFunction<C, M>;
  exit?: ExitFunction<C, M>;
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

export type ActionParamKey = "context" | "event" | "meta";
export type ExtractActionParam<F, P extends ActionParamKey> = F extends (
  context: infer C,
  event: infer E,
  meta: infer M
) => unknown
  ? P extends "context"
    ? C
    : P extends "event"
    ? E
    : P extends "meta"
    ? M
    : never
  : never;

export type ExtractFnParams<F> = F extends (...args: infer P) => unknown
  ? P
  : never;
export type ExtractInvokeParam<S, P extends "context" | "meta"> = S extends {
  enter?: infer F;
}
  ? P extends "context"
    ? ExtractFnParams<F>[0]
    : P extends "meta"
    ? ExtractFnParams<F>[1]
    : never
  : never;

export type ExtractInvokeData<S> = ExtractStateParam<
  S,
  "Event"
> extends PromiseEvent<infer D, infer _>
  ? D
  : never;

export type StateParam = "IDs" | "ID" | "Context" | "Event" | "Meta";
export type ExtractStateParam<S, P extends StateParam> = S extends State<
  infer IDs,
  infer ID,
  infer C,
  infer E,
  infer M
>
  ? P extends "IDs"
    ? IDs
    : P extends "ID"
    ? ID
    : P extends "Context"
    ? C
    : P extends "Event"
    ? E
    : P extends "Meta"
    ? M
    : never
  : never;
