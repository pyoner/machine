// export type GuardFunction<C, E> = (context: C, event: E) => boolean;
// export type ReduceFunction<C, E> = (context: C, event: E) => C;
// export type ActionFucntion<C, E> = (context: C, event: E) => any;

// export interface Transition<C, E> {
//   guard?: GuardFunction<C, E>;
//   reduce?: ReduceFunction<C, E>;
//   action?: ActionFucntion<C, E>;
// }

// export type Transitions<C, E> = Record<number, Transition<C, E>>;

// export interface State<C, E> {
//   transitions: Transitions<C, E>;
// }

// export interface States<C, E> extends Record<number, State<C, E>> {}

// export function createMachine() {}

// enum SwitchState {
//   On,
//   Off,
//   Change
// }

// enum Color {
//   Red,
//   Blue
// }

// interface SwitchEventChangeColor extends Event {
//   color: Color;
// }

// type SwitchEvents = SwitchEventChangeColor | Event;

// enum SwitchEventType {
//   Toggle,
//   ChangeColor
// }

// interface SwitchContext {
//   color: Color;
// }

// const states: States<SwitchContext, SwitchEvents> = {
//   [SwitchState.On]: {
//     transitions: {
//       [SwitchEventType.Toggle]: {}
//     }
//   },
//   [SwitchState.Off]: {
//     transitions: {
//       [SwitchEventType.Toggle]: {}
//     }
//   },
//   [SwitchState.Change]: {
//     transitions: {
//       [SwitchEventType.ChangeColor]: {
//         reduce: (c, e: SwitchEventChangeColor) => ({ ...c, color: e.color })
//       }
//     }
//   }
// };

export type Context = any;
export interface Event {
  type: string;
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

export type Transitions<C extends Context, RE extends Record<string, Event>> = {
  [P in keyof RE]: Transition<C, RE[P]>
};

export interface State<C extends Context, RE extends Record<string, Event>> {
  name: string;
  transitions?: Transitions<C, RE>;
}

export type States<RS extends Record<string, State<any, any>>> = {
  [P in keyof RS]: RS[P]
};

// helpers
export function state<C extends Context, RE extends Record<string, Event>>(
  name: string,
  transitions?: Transitions<C, RE>
): State<C, RE> {
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

// example
interface ClickEvent extends Event {
  type: "click";
  x: number;
  y: number;
}

interface PressEvent extends Event {
  type: "press";
  charCode: number;
}

type Events = { click: ClickEvent; press: PressEvent };
export interface S1State extends State<Context, Events> {
  name: "s1";
}

export const s1: State<Context, Events> = {
  name: "s1",
  transitions: {
    click: {
      to: "StateClick",
      guards: [(_, e) => e.y > 100 && e.x > 200]
    },
    press: {
      to: "StatePress",
      guards: [(_, e) => e.charCode > 23]
    }
  }
};
export const s11 = state<Context, Events>("s11", {
  click: transition("StateClick", guards((_, e) => e.y > 100 && e.x > 200)),
  press: transition("StatePress", guards((_, e) => e.charCode > 100))
});

interface EnterEvent extends Event {
  type: "enter";
  value: string;
}

type S2Events = { enter: EnterEvent; click: ClickEvent };
export const s2: State<Context, S2Events> = {
  name: "s2",
  transitions: {
    click: {
      to: "StateClick",
      guards: [(_, e) => e.y > 100 && e.x > 200]
    },
    enter: {
      to: "StateEnter",
      guards: [(_, e) => e.value.length > 100]
    }
  }
};

export const states: States<{
  s1: State<Context, Events>;
  s2: State<Context, S2Events>;
}> = {
  s1,
  s2
};

interface S<Name> {
  name: Name;
  [s: string]: any;
}
const x: S<"A"> = {
  name: "A",
  b: 5
};
