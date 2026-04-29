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
}) => {
  return (
    <TextField
      select
      label={label}
      value={value}
      onChange={onChange}
      fullWidth={fullWidth}
      required={required}
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
