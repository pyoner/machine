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

type Events = ClickEvent | PressEvent;

type S1State = State<"s1", MyContext, Events>;

export const s1: S1State = {
  id: "s1",
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

interface EnterEvent extends Event<"enter"> {
  value: string;
}

type S2Events = EnterEvent | ClickEvent;
type S2State = State<"s2", MyContext, S2Events>;
export const s2: S2State = {
  id: "s2",
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

export const machine: Machine<S1State | S2State> = {
  initial: "s1",
  states: {
    s1,
    s2
  }
};

// use helpers
export const s11 = state<"s11", MyContext, Events>("s11", {
  click: transition("StateClick", guards((_, e) => e.y > 100 && e.x > 200)),
  press: transition("StatePress", guards((_, e) => e.charCode > 100))
});
