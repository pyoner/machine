import { Event, State, Machine, Context } from "../src/machine";
import { state, transition, guards } from "../src/helpers";

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

type IDs = "s1" | "s2";

type Events = ClickEvent | PressEvent;

type S1State = State<IDs, "s1", MyContext, Events>;

export const s1: S1State = {
  id: "s1",
  on: {
    click: {
      to: "s1",
      guards: [(_, e) => e.y > 100 && e.x > 200]
    },
    press: {
      to: "s2",
      guards: [(_, e) => e.charCode > 23]
    }
  }
};

interface EnterEvent extends Event<"enter"> {
  value: string;
}

type S2Events = EnterEvent | ClickEvent;
type S2State = State<IDs, "s2", MyContext, S2Events>;
export const s2: S2State = {
  id: "s2",
  on: {
    click: {
      to: "s2",
      guards: [(_, e) => e.y > 100 && e.x > 200]
    },
    enter: {
      to: "s1",
      guards: [(_, e) => e.value.length > 100]
    }
  }
};

export const machine: Machine<S1State | S2State> = {
  initial: "s1",
  states: {
    s1,
    s2
  }
};

// use helpers
type NewIds = "s11" | "s12";
type S11State = State<NewIds, "s11", MyContext, Events>;

export const s11: S11State = state<S11State>("s11", {
  click: transition("s11", guards((_, e) => e.y > 100 && e.x > 200)),
  press: transition("s12", guards((_, e) => e.charCode > 100))
});
