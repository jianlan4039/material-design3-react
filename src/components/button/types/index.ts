import React from "react";
import type {Basic} from "@components/basic/index.js";

export interface ButtonProps extends Basic<HTMLButtonElement> {
  children?: React.ReactNode
  prefixIcon?: React.ReactNode
  suffixIcon?: React.ReactNode
  toggle?: boolean //when toggle is true, the button is a switch, the selected and unselected state are different.
  selected?: boolean
  disabled?: boolean
  size?: 'extra-small' | 'small' | 'medium' | 'large' | 'extra-large'
}