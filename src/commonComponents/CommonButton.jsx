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
        borderRadius: 8,
        px: 3,
        py: 1.2,
        fontWeight: 600,
        textTransform: "none",
        minWidth: "140px",
        height: "42px",
        fontSize: "0.95rem",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 12px 24px rgba(0,0,0,0.3)",
        },
        "&:active": {
          transform: "translateY(0)",
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default CommonButton;
