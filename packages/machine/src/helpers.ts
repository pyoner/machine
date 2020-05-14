import {
  Context,
  Event,
  Meta,
  GuardFunction,
  ReduceFunction,
  ActionFunction,
  InvokeFunction,
  EnterFunction,
  ExtractInvokeData,
  ExtractFromState
} from "./machine";

import { send } from "./interpret";

export function state<S>(
  id: ExtractFromState<S, "ID">,
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

export function transition<
  IDs,
  C extends Context,
  E extends Event,
  M extends Meta
>(
  to: IDs,
  guard?: GuardFunction<C, E, M>,
  reducer?: ReduceFunction<C, E, M>,
  action?: ActionFunction<C, E, M>
) {
  return { to, guard, reducer, action };
}

export function guards<C extends Context, E extends Event, M extends Meta>(
  ...args: GuardFunction<C, E, M>[]
): GuardFunction<C, E, M> {
  return (context: C, event: E, meta: M) =>
    args.every(func => func(context, event, meta));
}

export function reducers<C extends Context, E extends Event, M extends Meta>(
  ...args: ReduceFunction<C, E, M>[]
): ReduceFunction<C, E, M> {
  return (context: C, event: E, meta: M) =>
    args.reduce((c, func) => func(c, event, meta), context);
}

export function actions<C extends Context, E extends Event, M extends Meta>(
  ...args: ActionFunction<C, E, M>[]
): ActionFunction<C, E, M> {
  return (context: C, event: E, meta: M) =>
    args.forEach(func => func(context, event, meta));
}

function wrapInvokeFn<D, C extends Context, M extends Meta>(
  f: InvokeFunction<D, C, M>
): EnterFunction<C, M> {
  return async (context, meta) => {
    const queue = meta.queues[meta.id];
    try {
      const data = await f(context, meta);
      send(queue, { type: "done", data });
    } catch (error) {
      send(queue, { type: "error", error });
    }
  };
}

export function invoke<S>(
  id: ExtractFromState<S, "ID">,
  fn: InvokeFunction<
    ExtractInvokeData<S>,
    ExtractFromState<S, "Context">,
    ExtractFromState<S, "Meta">
  >,
  done: ExtractFromState<S, "IDs">,
  error: ExtractFromState<S, "IDs">
) {
  return {
    id,
    on: {
      done: transition(done),
      error: transition(error)
    },
    enter: wrapInvokeFn(fn)
  };
}
