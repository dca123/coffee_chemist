import { useMeter, AriaMeterProps } from "react-aria";

export const Meter = (props: AriaMeterProps) => {
  const {
    label,
    showValueLabel = !!label,
    value = 50,
    minValue = 0,
    maxValue = 100,
  } = props;
  const { meterProps, labelProps } = useMeter(props);

  // Calculate the width of the progress bar as a percentage
  const percentage = (value - minValue) / (maxValue - minValue);
  const barWidth = `${Math.round(percentage * 100)}%`;

  return (
    <div {...meterProps} style={{ width: 200 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {label && <span {...labelProps}>{label}</span>}
        {showValueLabel && <span>{meterProps["aria-valuetext"]}</span>}
      </div>
      <div style={{ height: 10, background: "lightgray" }}>
        <div style={{ width: barWidth, height: 10, background: "green" }} />
      </div>
    </div>
  );
};
