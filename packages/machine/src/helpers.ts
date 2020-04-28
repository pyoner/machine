import {
  Context,
  Event,
  GuardFunction,
  ReduceFunction,
  ActionFunction
} from "./machine";

export function state<S>(
  id: S extends { id: infer ID } ? ID : never,
  on?: S extends { on?: infer O } ? O : never
) {
  return {
    id,
    on
  };
}

export function transition<IDs, C extends Context, E extends Event>(
  to: IDs,
  guards?: GuardFunction<C, E>[],
  reducers?: ReduceFunction<C, E>[],
  actions?: ActionFunction<C, E>[]
) {
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
