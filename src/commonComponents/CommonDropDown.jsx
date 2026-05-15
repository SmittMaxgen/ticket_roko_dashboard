// CommonDropDown.jsx
import React from "react";
import { TextField, MenuItem } from "@mui/material";

const CommonDropDown = ({
  label,
  value,
  onChange,
  options = [],
  fullWidth = true,
  required = false,
  valueKey = "id",
  labelKey = "name",
  sx = {},
}) => {
  return (
    <TextField
      select
      label={label}
      value={value}
      onChange={onChange}
      fullWidth={fullWidth}
      required={required}
      size="small"
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "8px",
          transition: "all 0.3s ease",
          "&:hover fieldset": {
            borderColor: "rgba(100, 116, 139, 0.6)",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#f59e0b",
            boxShadow: "0 0 0 3px rgba(245, 158, 11, 0.1)",
          },
        },
        "& .MuiInputLabel-root": {
          color: "#a0aec0",
          "&.Mui-focused": {
            color: "#f59e0b",
          },
        },
        ...sx,
      }}
    >
      {options.map((item) => (
        <MenuItem key={item[valueKey]} value={item[valueKey]}>
          {item[labelKey]}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default CommonDropDown;
