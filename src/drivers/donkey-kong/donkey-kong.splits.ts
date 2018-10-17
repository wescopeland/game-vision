import { Split } from "../../models/split.model";

export const splits: Split[] = [
  {
    label: "L=01",
    subsplits: [
      {
        label: "1-1"
      },
      {
        label: "1-2"
      }
    ]
  },
  {
    label: "L=02",
    subsplits: [
      {
        label: "2-1"
      },
      {
        label: "2-2"
      },
      {
        label: "2-3"
      }
    ]
  },
  {
    label: "L=03",
    subsplits: [
      {
        label: "3-1"
      },
      {
        label: "3-2"
      },
      {
        label: "3-3"
      },
      {
        label: "3-4"
      }
    ]
  },
  {
    label: "L=04",
    subsplits: [
      {
        label: "4-1"
      },
      {
        label: "4-2"
      },
      {
        label: "4-3"
      },
      {
        label: "4-4"
      },
      {
        label: "4-5"
      }
    ]
  },
  {
    labelMaskForRepeat: "L=0$",
    repeatStart: 5,
    repeatEnd: 21,
    subsplits: [
      {
        label: "$-1"
      },
      {
        label: "$-2"
      },
      {
        label: "$-3"
      },
      {
        label: "$-4"
      },
      {
        label: "$-5"
      },
      {
        label: "$-6"
      }
    ]
  },
  {
    label: "L=22",
    subsplits: [
      {
        label: "22-1"
      }
    ]
  }
];
