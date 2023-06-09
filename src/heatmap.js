import { Heatmap } from "contribution-heatmap";
// and then ... just use it like you would any components

export const YourComponent = () => (
  <Heatmap
    colour={["#ebedf0", "#c6e48b", "#40c463", "#30a14e", "#216e39"]}
    squareNumber={5}
    count={[3, 2, 20, 1, 14]}
    squareGap="4px"
    squareSize="15px"
  />
);
