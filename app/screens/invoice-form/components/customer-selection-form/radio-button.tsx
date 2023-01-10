import React, { FC } from "react";
import { CircleOutline } from "./circle-outline";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { color } from "../../../../theme";

type TRadioButton = {
  isActive?: boolean
}

const RadioButton: FC<TRadioButton> = (props) => {
  const { isActive } = props;

  if (isActive) {
    return <Icon name={"disc"} size={25} color={color.primary} />;
  }
  return <CircleOutline size={20} />;
};

export default RadioButton;