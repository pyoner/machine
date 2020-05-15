import {
  Event,
  State,
  Machine,
  Context,
  InvokeEvent,
  Pool
} from "../src/machine";
import { state, transition, guards, invoke } from "../src/helpers";

// type MyEvent = Event<"my"> & {isMe: true}

interface ClickEvent extends Event<"click"> {
  x: number;
  y: number;
}

interface PressEvent extends Event<"press"> {
  charCode: number;
}

interface MyContext extends Context {
  flag: boolean;
}

// use Union or Enum as possible states
// use string-based enums see:
// https://2ality.com/2020/01/typescript-enums.html#downside%3A-loose-type-checking
// https://2ality.com/2020/01/typescript-enums.html#recommendation%3A-prefer-string-based-enums

enum MyStates {
  s1 = "s1",
  s2 = "s2"
}

type Events = ClickEvent | PressEvent;

type S1State = State<MyStates, MyStates.s1, MyContext, Events>;

export const s1: S1State = {
  id: MyStates.s1,
  on: {
    click: {
      to: MyStates.s1,
      guard: (_, e) => e.y > 100 && e.x > 200
    },
    press: {
      to: MyStates.s2,
      guard: (_, e) => e.charCode > 23
    }
  }
};

interface EnterEvent extends Event<"enter"> {
  value: string;
}

type S2Events = EnterEvent | ClickEvent;
type S2State = State<MyStates, MyStates.s2, MyContext, S2Events>;
export const s2: S2State = {
  id: MyStates.s2,
  on: {
    click: {
      to: MyStates.s2,
      guard: (_, e) => e.y > 100 && e.x > 200
    },
    enter: {
      to: MyStates.s1,
      guard: (_, e) => e.value.length > 100
    }
  }
};

export declare const MyMachine: unique symbol;
export type MyMachine = Machine<typeof MyMachine, S1State | S2State>;
export const machine: MyMachine = {
  id: MyMachine,
  initial: MyStates.s1,
  states: {
    s1,
    s2
  }
};

export const pool: Pool<MyMachine> = {
  [MyMachine]: {
    x: [{ type: "click", x: 1, y: 2 }]
  }
};

// use helpers
// use Union or Enum as possible states
type States = "s11" | "s12" | "s13";
type S11State = State<States, "s11", MyContext, Events>;

export const s11: S11State = state<S11State>("s11", {
  click: transition("s13", guards((_, e) => e.y > 100 && e.x > 200)),
  press: transition("s12", guards((_, e) => e.charCode > 100))
});

type InvokeStates = "invoke" | "done" | "error";
type InvokeState = State<
  InvokeStates,
  "invoke",
  MyContext,
  InvokeEvent<string, Error>
>;
export const invokeState: InvokeState = invoke<InvokeState>(
  "invoke",
  (c, m) => Promise.resolve("foo"),
  "done",
  "error"
);
