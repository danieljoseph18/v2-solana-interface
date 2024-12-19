import React from "react";
import InfoRow from "./InfoRow";

const FeesInfo = ({
  positionFee,
  executionFee,
  priceUpdateFee,
}: {
  positionFee: number;
  executionFee: number;
  priceUpdateFee: number;
}) => (
  <>
    <InfoRow label="Position Fee" value={`$${positionFee}`} />
    <InfoRow label="Execution Fee" value={`${executionFee} ETH`} />
    <InfoRow
      label="Price Update Fee"
      value={`${priceUpdateFee.toFixed(18)} ETH`}
    />
  </>
);

export default FeesInfo;
