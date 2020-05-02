import {
  Context,
  Event,
  GuardFunction,
  ReduceFunction,
  ActionFunction
} from "./machine";

export function state<S>(
  id: S extends { id: infer ID } ? ID : never,
  on?: S extends { on?: infer O } ? O : never,
  enter?: S extends { enter?: infer T } ? T : never,
  exit?: S extends { exit?: infer T } ? T : never
) {
  return {
    id,
    on,
    enter,
    exit
  };
}

export function transition<IDs, C extends Context, E extends Event>(
  to: IDs,
  guard?: GuardFunction<C, E>,
  reducer?: ReduceFunction<C, E>,
  action?: ActionFunction<C, E>
) {
  return { to, guard, reducer, action };
}

export function guards<C extends Context, E extends Event>(
  ...args: GuardFunction<C, E>[]
): GuardFunction<C, E> {
  return (context: C, event: E) => args.every(func => func(context, event));
}

export function reducers<C extends Context, E extends Event>(
  ...args: ReduceFunction<C, E>[]
): ReduceFunction<C, E> {
  return (context: C, event: E) =>
    args.reduce((c, func) => func(c, event), context);
}

export function actions<C extends Context, E extends Event>(
  ...args: ActionFunction<C, E>[]
): ActionFunction<C, E> {
  return (context: C, event: E) => args.forEach(func => func(context, event));
}

export type ExtractIDs<S> = S extends {
  on?: Record<keyof any, { to: infer TO } | { to: infer TO }[]>;
}
  ? TO
  : never;

export function invoke<S>(
  id: S extends { id: infer ID } ? ID : never,
  fn: <C extends Context, E extends Event>(context: C, event: E) => Promise<C>,
  done: ExtractIDs<S>,
  error: ExtractIDs<S>
) {
  return {
    id,
    on: {
      done: transition(done),
      error: transition(error)
    },
    enter: fn
  };
}
