import {
  Event,
  State,
  States,
  Context,
  state,
  transition,
  guards
} from "../src/machine";

// type MyEvent = Event<"my"> & {isMe: true}

interface ClickEvent extends Event<"click"> {
  x: number;
  y: number;
}

interface PressEvent extends Event<"press"> {
  charCode: number;
}

type Events = ClickEvent | PressEvent;

type S1State = State<"s1", Context, Events>;

export const s1: S1State = {
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
export const s11 = state<"s11", Context, Events>("s11", {
  click: transition("StateClick", guards((_, e) => e.y > 100 && e.x > 200)),
  press: transition("StatePress", guards((_, e) => e.charCode > 100))
});

interface EnterEvent extends Event<"enter"> {
  value: string;
}

type S2Events = EnterEvent | ClickEvent;
type S2State = State<"s2", Context, S2Events>;
export const s2: S2State = {
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

export const states: States<S1State | S2State> = {
  s1,
  s2
};
