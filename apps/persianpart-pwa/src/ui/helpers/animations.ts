const scaleYIn: Keyframe[] = [
  {
    transform: 'scaleY(0)',
    opacity: 0,
  },
  {
    transform: 'scaleY(1)',
    opacity: 1,
  },
];

const scaleYOut: Keyframe[] = scaleYIn.reverse();

export default {
  scaleYIn,
  scaleYOut,
};
