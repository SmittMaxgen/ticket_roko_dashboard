import React from "react";
import { Button } from "@mui/material";

const CommonButton = ({
  children,
  variant = "contained",
  color = "primary",
  startIcon,
  endIcon,
  onClick,
  sx = {},
  ...props
}) => {
  return (
    <Button
      variant={variant}
      color={color}
      startIcon={startIcon}
      endIcon={endIcon}
      onClick={onClick}
      sx={{
        borderRadius: 2,
        px: 3,
        py: 1,
        fontWeight: 600,
        textTransform: "none",
        minWidth: "140px",
        height: "40px",
        ...sx,
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default CommonButton;
