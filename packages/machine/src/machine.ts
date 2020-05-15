export type Context = any;
export interface Event<T extends keyof any = keyof any> {
  type: T;
}

export type DoneEvent<D> = Event<"done"> & { data: D };
export type ErrorEvent<E extends Error> = Event<"error"> & { error: E };
export type InvokeEvent<D, E extends Error> = DoneEvent<D> | ErrorEvent<E>;

export type Pool<M extends { id: keyof any }> = {
  [P in M["id"]]: Record<
    keyof any,
    Array<
      ExtractFromState<
        ExtractFromMachine<Extract<M, { id: P }>, "State">,
        "Event"
      >
    >
  >
};

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

export type Machine<ID extends keyof any, S extends { id: keyof any }> = {
  id: ID;
  initial: S["id"];
  states: { [P in S["id"]]: Extract<S, { id: P }> };
};

export type InvokeParam = "Data" | "Error";
export type ExtractFromInvokeEvent<
  I,
  P extends InvokeParam
> = I extends InvokeEvent<infer D, infer Err>
  ? P extends "Data"
    ? D
    : P extends "Error"
    ? Err
    : never
  : never;

export type StateParam =
  | "IDs"
  | "ID"
  | "Context"
  | "Event"
  | "Meta"
  | "InvokeData"
  | "InvokeError";
export type ExtractFromState<S, P extends StateParam> = S extends State<
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
    : P extends "InvokeData"
    ? ExtractFromInvokeEvent<E, "Data">
    : P extends "InvokeError"
    ? ExtractFromInvokeEvent<E, "Error">
    : never
  : never;

export type MachineParam = "ID" | "State";
export type ExtractFromMachine<M, P extends MachineParam> = M extends Machine<
  infer ID,
  infer S
>
  ? P extends "ID"
    ? ID
    : P extends "State"
    ? S
    : never
  : never;
