import {
  Box,
  Grid,
  TextField,
  Typography,
  MenuItem,
  Button,
  Paper,
  Checkbox,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";

import { createVendorThunk } from "../features/vendor/vendorThunks";
import { meThunk } from "../features/auth/authThunks";

export default function VendorRegistration() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { createLoading } = useSelector((state) => state.vendor);
  const user = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    vendor_name: "",
    vendor_address: "",
    vendor_identity_type: "aadhaar_card",
    vendor_identity_number: "",
    phone: "",
    alternate_phone: "",
    email: "",
    alternate_email: "",
    event_name: "",
    event_description: "",
    organizing_committee: "educational_institute",
    event_type: "talk_show",
    event_date: "",
    start_time: "",
    end_time: "",
    event_pincode: "",
    expected_capacity: "",
    venue_address: "",
    food_required: false,
    ticketroko_services_required: false,
    sponsorship_required: false,
    services_details: "",
  });

  // Redirect if vendor profile is already completed
  useEffect(() => {
    if (
      user?.role === "vendor_organizer" &&
      user?.vendorProfile?.is_completed
    ) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await dispatch(createVendorThunk(formData)).unwrap();

      enqueueSnackbar(result.message || "Vendor Created Successfully", {
        variant: "success",
      });

      // Refresh user data in Redux
      await dispatch(meThunk()).unwrap();

      // Redirect to dashboard
      navigate("/", { replace: true });
    } catch (error) {
      console.error(error);
      enqueueSnackbar(
        error.message || "Something went wrong. Please try again.",
        { variant: "error" },
      );
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#0F172A",
        py: 5,
        px: 2,
      }}
    >
      <Paper
        sx={{
          maxWidth: 1200,
          mx: "auto",
          p: 4,
          borderRadius: 3,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
          Vendor Registration Form
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Vendor Details */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Vendor Name"
                name="vendor_name"
                value={formData.vendor_name}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Vendor Address"
                name="vendor_address"
                value={formData.vendor_address}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Identity Type"
                name="vendor_identity_type"
                value={formData.vendor_identity_type}
                onChange={handleChange}
              >
                <MenuItem value="aadhaar_card">Aadhaar Card</MenuItem>
                <MenuItem value="pan_card">PAN Card</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Identity Number"
                name="vendor_identity_number"
                value={formData.vendor_identity_number}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Alternate Email"
                name="alternate_email"
                type="email"
                value={formData.alternate_email}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Alternate Phone"
                name="alternate_phone"
                value={formData.alternate_phone}
                onChange={handleChange}
              />
            </Grid>

            {/* Event Details */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Event Name"
                name="event_name"
                value={formData.event_name}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Event Description"
                name="event_description"
                value={formData.event_description}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Organizing Committee"
                name="organizing_committee"
                value={formData.organizing_committee}
                onChange={handleChange}
              >
                <MenuItem value="educational_institute">
                  Educational Institute
                </MenuItem>
                <MenuItem value="others">Others</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Event Type"
                name="event_type"
                value={formData.event_type}
                onChange={handleChange}
              >
                <MenuItem value="talk_show">Talk Show</MenuItem>
                <MenuItem value="annual_function">Annual Function</MenuItem>
                <MenuItem value="seminar">Seminar</MenuItem>
                <MenuItem value="event_hosting">Event Hosting</MenuItem>
                <MenuItem value="get_together">Get Together</MenuItem>
                <MenuItem value="music_show">Music Show</MenuItem>
                <MenuItem value="movie_show">Movie Show</MenuItem>
                <MenuItem value="live_show">Live Show</MenuItem>
                <MenuItem value="others">Others</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="date"
                label="Event Date"
                name="event_date"
                value={formData.event_date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="time"
                label="Start Time"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="time"
                label="End Time"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Event Pincode"
                name="event_pincode"
                value={formData.event_pincode}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Expected Capacity"
                name="expected_capacity"
                type="number"
                value={formData.expected_capacity}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Venue Address"
                name="venue_address"
                value={formData.venue_address}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* Services */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, mt: 2 }}>
                Required Services
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.food_required}
                    onChange={handleChange}
                    name="food_required"
                  />
                }
                label="Food Required"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.ticketroko_services_required}
                    onChange={handleChange}
                    name="ticketroko_services_required"
                  />
                }
                label="TicketRoko Services Required"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.sponsorship_required}
                    onChange={handleChange}
                    name="sponsorship_required"
                  />
                }
                label="Sponsorship Required"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Additional Service Details"
                name="services_details"
                value={formData.services_details}
                onChange={handleChange}
                placeholder="Any specific requirements..."
              />
            </Grid>

            {/* Submit */}
            <Grid item xs={12} sx={{ mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={createLoading}
                sx={{
                  height: 52,
                  minWidth: 240,
                  fontWeight: 700,
                  fontSize: "1.05rem",
                }}
              >
                {createLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Submit Vendor Form"
                )}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}
