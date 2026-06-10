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
  Avatar,
  Tooltip,
  Divider,
  alpha,
  InputLabel,
} from "@mui/material";

import { createTheme, ThemeProvider } from "@mui/material/styles";

import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import SearchIcon from "@mui/icons-material/Search";
import LabelIcon from "@mui/icons-material/Label";
import FilterListIcon from "@mui/icons-material/FilterList";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import CloseIcon from "@mui/icons-material/Close";

import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  fetchCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../features/categories/categoryThunks";

import {
  selectCategories,
  selectCategoryLoading,
  selectCategoryError,
} from "../features/categories/categorySelectors";
import { clearCategory } from "../features/categories/categorySlice";

// Reuse the same beautiful theme from your Labels page
const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#6C63FF", light: "#9D96FF", dark: "#4B44CC" },
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
          background: "linear-gradient(135deg, #6C63FF 0%, #9D96FF 100%)",
          boxShadow: "0 4px 15px rgba(108,99,255,0.35)",
          "&:hover": {
            background: "linear-gradient(135deg, #4B44CC 0%, #6C63FF 100%)",
            transform: "translateY(-1px)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 10,
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#6C63FF",
            },
          },
        },
      },
    },
  },
});

const EMPTY_FORM = {
  name: "",
  slug: "",
  color: "#6366f1",
  is_active: true,
};

export default function Category() {
  const dispatch = useDispatch();

  const categories = useSelector(selectCategories);
  const loading = useSelector(selectCategoryLoading);
  const error = useSelector(selectCategoryError);

  const [modal, setModal] = useState(null); // 'create' | 'edit' | 'view' | 'delete'
  const [target, setTarget] = useState(null);
  const [search, setSearch] = useState("");
  const [filterActive, setFilterActive] = useState("");
  const [formData, setFormData] = useState(EMPTY_FORM);

  // Fetch categories
  const loadCategories = useCallback(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const openCreate = () => {
    setTarget(null);
    setFormData(EMPTY_FORM);
    setModal("create");
  };

  const openEdit = (cat) => {
    dispatch(fetchCategoryById(cat.id));
    setTarget(cat);
    setModal("edit");
  };

  const openView = (cat) => {
    setTarget(cat);
    setModal("view");
  };

  const openDelete = (cat) => {
    setTarget(cat);
    setModal("delete");
  };

  const closeModal = () => {
    setModal(null);
    setTarget(null);
    dispatch(clearCategory());
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
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    setFormData((prev) => ({ ...prev, name, slug }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (modal === "create") {
      await dispatch(createCategory(formData));
    } else if (modal === "edit" && target) {
      await dispatch(updateCategory({ id: target.id, data: formData }));
    }

    closeModal();
    loadCategories();
  };

  const handleDeleteConfirm = async () => {
    if (target) {
      await dispatch(deleteCategory(target.id));
      closeModal();
      loadCategories();
    }
  };

  // Sync form when editing
  useEffect(() => {
    if (modal === "edit" && target) {
      setFormData({
        name: target.name || "",
        slug: target.slug || "",
        color: target.color || "#6366f1",
        is_active: target.is_active ?? true,
      });
    }
  }, [target, modal]);

  const filteredCategories = categories.filter((cat) => {
    const matchesSearch =
      cat.name?.toLowerCase().includes(search.toLowerCase()) ||
      cat.slug?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      !filterActive || String(cat.is_active) === filterActive;
    return matchesSearch && matchesStatus;
  });

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{ p: { xs: 2, md: 3.5 }, bgcolor: "#0f172a", minHeight: "100vh" }}
      >
        {/* Header */}
        <Stack
          sx={{ mb: 3, display: "flex", justifyContent: "space-between" }}
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
                background: "linear-gradient(135deg, #6C63FF 0%, #9D96FF 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <LabelIcon sx={{ color: "white", fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h4" color="white" fontWeight={800}>
                Categories
              </Typography>
              <Typography variant="body2" color="#94a3b8">
                Manage your categories
              </Typography>
            </Box>
          </Stack>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openCreate}
            sx={{ px: 4, py: 1.2 }}
          >
            New Category
          </Button>
        </Stack>

        {/* Error */}
        {error && (
          <Paper
            sx={{
              p: 2,
              mb: 3,
              bgcolor: alpha("#EF4444", 0.1),
              color: "#EF4444",
              border: `1px solid ${alpha("#EF4444", 0.3)}`,
            }}
          >
            <Typography>{error}</Typography>
          </Paper>
        )}

        {/* Filters */}
        <Card sx={{ mb: 3, border: "1px solid #E5E7EB" }}>
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
                  placeholder="Search categories..."
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
                <FormControl sx={{ width: 120 }} fullWidth>
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
        <Card sx={{ border: "1px solid #E5E7EB", overflow: "hidden" }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width={50} />
                  <TableCell>Category</TableCell>
                  <TableCell>Slug</TableCell>
                  <TableCell>Color</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : filteredCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                      <Typography color="text.secondary">
                        No categories found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCategories.map((cat) => (
                    <TableRow key={cat.id} hover>
                      <TableCell>
                        <DragIndicatorIcon sx={{ color: "#cbd5e1" }} />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar
                            sx={{
                              bgcolor: cat.color || "#6366f1",
                              width: 46,
                              height: 46,
                              fontWeight: 700,
                            }}
                          >
                            {cat.name?.charAt(0)}
                          </Avatar>
                          <Typography fontWeight={600}>{cat.name}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography color="text.secondary">
                          {cat.slug}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: 2,
                            bgcolor: cat.color || "#6366f1",
                            border: "2px solid white",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={
                            cat.is_active ? <CheckCircleIcon /> : <CancelIcon />
                          }
                          label={cat.is_active ? "Active" : "Inactive"}
                          color={cat.is_active ? "success" : "error"}
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
                            <IconButton onClick={() => openView(cat)}>
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton onClick={() => openEdit(cat)}>
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              color="error"
                              onClick={() => openDelete(cat)}
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

        {/* Create & Edit Modal */}
        <Dialog
          open={modal === "create" || modal === "edit"}
          onClose={closeModal}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {modal === "create" ? "Create New Category" : "Edit Category"}
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Name"
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
                    label="Color"
                    name="color"
                    type="color"
                    value={formData.color}
                    onChange={handleChange}
                    sx={{ height: 56, width: 120, padding: 0 }}
                  />
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
              {modal === "create" ? "Create" : "Update"}
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
          <DialogTitle>Category Details</DialogTitle>
          <DialogContent>
            {target && (
              <Stack spacing={3} alignItems="center" textAlign="center">
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: target.color,
                    fontSize: 32,
                    fontWeight: 700,
                  }}
                >
                  {target.name?.[0]}
                </Avatar>
                <Box>
                  <Typography variant="h5">{target.name}</Typography>
                  <Typography color="text.secondary">{target.slug}</Typography>
                </Box>
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
          <DialogTitle>Delete Category?</DialogTitle>
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
