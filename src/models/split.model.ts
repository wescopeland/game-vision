export interface Split {
  label?: string;
  labelMaskForRepeat?: string;
  score?: number;
  subsplits?: Split[];
  isRepeater?: boolean;
  repeatStart?: number;
  repeatEnd?: number;
}
