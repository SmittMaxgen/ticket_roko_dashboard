import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
  Tooltip,
  InputLabel,
} from "@mui/material";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { API_BASE_URL } from "../api/axios";

import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FilterListIcon from "@mui/icons-material/FilterList";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import { useDispatch, useSelector } from "react-redux";
import {
  fetchCities,
  fetchCityById,
  createCity,
  updateCity,
  deleteCity,
} from "../features/city/cityThunks";

import {
  selectAllCities,
  selectCitiesLoading,
  selectCitiesError,
} from "../features/city/citySelectors";

import { clearSelected } from "../features/city/citySlice";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#3b82f6", light: "#60a5fa", dark: "#2563eb" },
    success: { main: "#22C55E" },
    error: { main: "#EF4444" },
    background: { default: "#F3F4FF", paper: "#FFFFFF" },
    text: { primary: "#1A1A2E", secondary: "#6B7280" },
  },
  typography: {
    fontFamily: "'Sora', 'DM Sans', sans-serif",
    h4: { fontWeight: 800, letterSpacing: "-0.5px" },
    h6: { fontWeight: 700 },
  },
  shape: { borderRadius: 14 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 600, borderRadius: 10 },
        contained: {
          background: "linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)",
          boxShadow: "0 4px 15px rgba(59,130,246,0.35)",
          "&:hover": {
            background: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
          },
        },
      },
    },
  },
});

const EMPTY_FORM = {
  name: "",
  slug: "",
  state: "",
  icon: "",
  image_url: "",
  is_active: true,
};

export default function City() {
  const dispatch = useDispatch();

  const cities = useSelector(selectAllCities);
  const loading = useSelector(selectCitiesLoading);
  const error = useSelector(selectCitiesError);

  const [modal, setModal] = useState(null); // 'create' | 'edit' | 'view' | 'delete'
  const [target, setTarget] = useState(null);
  console.log("target===>>>", target);
  const [search, setSearch] = useState("");
  const [filterActive, setFilterActive] = useState("");
  const [formData, setFormData] = useState(EMPTY_FORM);

  const loadCities = useCallback(() => {
    dispatch(fetchCities());
  }, [dispatch]);

  useEffect(() => {
    loadCities();
  }, [loadCities]);

  const openCreate = () => {
    setTarget(null);
    setFormData(EMPTY_FORM);
    setModal("create");
  };

  const openEdit = (city) => {
    dispatch(fetchCityById(city.id));
    setTarget(city);
    setModal("edit");
  };

  const openView = (city) => {
    setTarget(city);
    setModal("view");
  };

  const openDelete = (city) => {
    setTarget(city);
    setModal("delete");
  };

  const closeModal = () => {
    setModal(null);
    setTarget(null);
    dispatch(clearSelected());
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    setFormData((prev) => ({ ...prev, name, slug }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (modal === "create") {
      await dispatch(createCity(formData));
    } else if (modal === "edit" && target) {
      await dispatch(updateCity({ id: target.id, cityData: formData }));
    }

    closeModal();
    loadCities();
  };

  const handleDeleteConfirm = async () => {
    if (target) {
      await dispatch(deleteCity(target.id));
      closeModal();
      loadCities();
    }
  };

  // Sync form when editing
  useEffect(() => {
    if (modal === "edit" && target) {
      setFormData({
        name: target.name || "",
        slug: target.slug || "",
        state: target.state || "",
        icon: target.icon || "",
        image_url: target.image_url || "",
        is_active: target.is_active ?? true,
      });
    }
  }, [target, modal]);

  const filteredCities = cities.filter((city) => {
    const matchesSearch =
      city.name?.toLowerCase().includes(search.toLowerCase()) ||
      city.slug?.toLowerCase().includes(search.toLowerCase()) ||
      city.state?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      !filterActive || String(city.is_active) === filterActive;

    return matchesSearch && matchesStatus;
  });

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{ p: { xs: 2, md: 3.5 }, bgcolor: "#0f172a", minHeight: "100vh" }}
      >
        {/* Header */}
        <Stack
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
          px={1}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 3,
                background: "linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <LocationOnIcon sx={{ color: "white", fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h4" color="white" fontWeight={800}>
                Cities
              </Typography>
              <Typography variant="body2" color="#94a3b8">
                Manage cities across India
              </Typography>
            </Box>
          </Stack>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openCreate}
            sx={{ px: 4, py: 1.2 }}
          >
            Add New City
          </Button>
        </Stack>

        {/* Error Message */}
        {error && (
          <Paper
            sx={{
              p: 2,
              mb: 3,
              bgcolor: "rgba(239, 68, 68, 0.1)",
              color: "#EF4444",
              border: "1px solid rgba(239, 68, 68, 0.3)",
            }}
          >
            <Typography>{error}</Typography>
          </Paper>
        )}

        {/* Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <FilterListIcon sx={{ color: "#64748b" }} />
              <Typography
                variant="body2"
                fontWeight={700}
                color="text.secondary"
              >
                Filters
              </Typography>
            </Stack>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Search cities..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl sx={{ width: "120px" }} fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filterActive}
                    label="Status"
                    onChange={(e) => setFilterActive(e.target.value)}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="true">Active</MenuItem>
                    <MenuItem value="false">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>City Name</TableCell>
                  <TableCell>Slug</TableCell>
                  {/* <TableCell>State</TableCell> */}
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : filteredCities.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                      <Typography color="text.secondary">
                        No cities found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCities.map((city) => (
                    <TableRow key={city.id} hover>
                      <TableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          {city.image_url ? (
                            <Box
                              component="img"
                              src={`${API_BASE_URL}/${city.image_url}`}
                              alt={city.name}
                              sx={{
                                width: 36,
                                height: 36,
                                borderRadius: 1,
                                objectFit: "cover",
                              }}
                            />
                          ) : city.icon ? (
                            <Box
                              component="img"
                              src={`${API_BASE_URL}/${city.icon}`}
                              alt="icon"
                              sx={{
                                width: 36,
                                height: 36,
                                borderRadius: 1,
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <LocationOnIcon sx={{ color: "#3b82f6" }} />
                          )}
                          <Typography fontWeight={600}>{city.name}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography color="text.secondary">
                          {city.slug}
                        </Typography>
                      </TableCell>
                      {/* <TableCell>{city.state || "—"}</TableCell> */}
                      <TableCell>
                        <Chip
                          icon={
                            city.is_active ? (
                              <CheckCircleIcon />
                            ) : (
                              <CancelIcon />
                            )
                          }
                          label={city.is_active ? "Active" : "Inactive"}
                          color={city.is_active ? "success" : "error"}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="flex-end"
                        >
                          <Tooltip title="View">
                            <IconButton onClick={() => openView(city)}>
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton onClick={() => openEdit(city)}>
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              color="error"
                              onClick={() => openDelete(city)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* Create / Edit Modal */}
        <Dialog
          open={modal === "create" || modal === "edit"}
          onClose={closeModal}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {modal === "create" ? "Add New City" : "Edit City"}
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="City Name"
                    name="name"
                    value={formData.name}
                    onChange={handleNameChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    City Icon
                  </Typography>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        icon: e.target.files[0],
                      }))
                    }
                    style={{ width: "100%" }}
                  />
                  {formData.icon && typeof formData.icon === "string" && (
                    <Box
                      component="img"
                      src={`${import.meta.env.VITE_API_BASE_URL}/${formData.icon}`}
                      alt="icon preview"
                      sx={{
                        mt: 1,
                        width: 60,
                        height: 60,
                        objectFit: "cover",
                        borderRadius: 1,
                      }}
                    />
                  )}
                  {formData.icon && typeof formData.icon === "object" && (
                    <Box
                      component="img"
                      src={URL.createObjectURL(formData.icon)}
                      alt="icon preview"
                      sx={{
                        mt: 1,
                        width: 60,
                        height: 60,
                        objectFit: "cover",
                        borderRadius: 1,
                      }}
                    />
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    City Image
                  </Typography>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        image_url: e.target.files[0],
                      }))
                    }
                    style={{ width: "100%" }}
                  />
                  {formData.image_url &&
                    typeof formData.image_url === "string" && (
                      <Box
                        component="img"
                        src={`${import.meta.env.VITE_API_BASE_URL}/${formData.image_url}`}
                        alt="image preview"
                        sx={{
                          mt: 1,
                          width: "100%",
                          height: 120,
                          objectFit: "cover",
                          borderRadius: 2,
                        }}
                      />
                    )}
                  {formData.image_url &&
                    typeof formData.image_url === "object" && (
                      <Box
                        component="img"
                        src={URL.createObjectURL(formData.image_url)}
                        alt="image preview"
                        sx={{
                          mt: 1,
                          width: "100%",
                          height: 120,
                          objectFit: "cover",
                          borderRadius: 2,
                        }}
                      />
                    )}
                </Grid>
                <Grid item xs={12}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Switch
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleChange}
                    />
                    <Typography>Active</Typography>
                  </Stack>
                </Grid>
              </Grid>
            </form>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={closeModal}>Cancel</Button>
            <Button variant="contained" onClick={handleSubmit}>
              {modal === "create" ? "Create City" : "Update City"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* View Modal */}
        <Dialog
          open={modal === "view"}
          onClose={closeModal}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>City Details</DialogTitle>
          <DialogContent>
            {target && (
              <Stack spacing={3} alignItems="center" textAlign="center">
                {target.image_url ? (
                  <Box
                    component="img"
                    src={`${API_BASE_URL}/${target.image_url}`}
                    alt={target.name}
                    sx={{
                      width: "100%",
                      height: 160,
                      objectFit: "cover",
                      borderRadius: 2,
                    }}
                  />
                ) : target.icon ? (
                  <Typography sx={{ fontSize: 64 }}>
                    `${API_BASE_URL}/${target.icon}`
                  </Typography>
                ) : (
                  <LocationOnIcon sx={{ fontSize: 80, color: "#3b82f6" }} />
                )}
                <Box>
                  <Typography variant="h5">{target.name}</Typography>
                  {/* <Typography color="text.secondary">/{target.slug}</Typography> */}
                </Box>
                {target.state && <Typography>State: {target.state}</Typography>}
                <Chip
                  label={target.is_active ? "Active" : "Inactive"}
                  color={target.is_active ? "success" : "error"}
                />
              </Stack>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={closeModal}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation */}
        <Dialog open={modal === "delete"} onClose={closeModal} maxWidth="xs">
          <DialogTitle>Delete City?</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete <strong>{target?.name}</strong>?
              This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeModal}>Cancel</Button>
            <Button
              color="error"
              variant="contained"
              onClick={handleDeleteConfirm}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}
