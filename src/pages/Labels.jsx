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
  InputLabel,
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
  InputAdornment,
  Badge,
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
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ImageIcon from "@mui/icons-material/Image";
import CloseIcon from "@mui/icons-material/Close";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchLabels,
  createLabel,
  updateLabel,
  deleteLabel,
  toggleLabelStatus,
  reorderLabels,
} from "../features/labels/labelThunks";

import {
  selectAllLabels,
  selectLabelsLoading,
  selectLabelsActionLoading,
  selectLabelsError,
  selectLabelsTotal,
  selectLabelsTotalPages,
  selectLabelsPage,
} from "../features/labels/labelSelectors";

// ─── Theme ────────────────────────────────────────────────────────────────────

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#6C63FF", light: "#9D96FF", dark: "#4B44CC" },
    secondary: { main: "#FF6584" },
    success: { main: "#22C55E" },
    error: { main: "#EF4444" },
    warning: { main: "#F59E0B" },
    background: { default: "#F3F4FF", paper: "#FFFFFF" },
    text: { primary: "#1A1A2E", secondary: "#6B7280" },
  },
  typography: {
    fontFamily: "'Sora', 'DM Sans', sans-serif",
    h4: { fontWeight: 800, letterSpacing: "-0.5px" },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
  },
  shape: { borderRadius: 14 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 10,
          fontSize: "0.875rem",
        },
        contained: {
          background: "linear-gradient(135deg, #6C63FF 0%, #9D96FF 100%)",
          boxShadow: "0 4px 15px rgba(108,99,255,0.35)",
          "&:hover": {
            background: "linear-gradient(135deg, #4B44CC 0%, #6C63FF 100%)",
            boxShadow: "0 6px 20px rgba(108,99,255,0.5)",
            transform: "translateY(-1px)",
          },
          transition: "all 0.2s ease",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 10,
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#6C63FF",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#6C63FF",
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: { borderRadius: 10 },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: { padding: 8 },
        track: { borderRadius: 12, opacity: 1, backgroundColor: "#E5E7EB" },
        thumb: { boxShadow: "0 2px 6px rgba(0,0,0,0.15)" },
        switchBase: {
          "&.Mui-checked": {
            "& + .MuiSwitch-track": {
              backgroundColor: "#6C63FF !important",
              opacity: "1 !important",
            },
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          color: "#6B7280",
          fontSize: "0.75rem",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          backgroundColor: "#F9FAFB",
          borderBottom: "2px solid #E5E7EB",
          padding: "14px 16px",
        },
        body: { borderBottom: "1px solid #F3F4F6", padding: "12px 16px" },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:hover": { backgroundColor: "#F9F8FF" },
          transition: "background 0.15s ease",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 20, boxShadow: "0 25px 50px rgba(0,0,0,0.12)" },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, borderRadius: 8 },
      },
    },
  },
});

// ─── Constants ────────────────────────────────────────────────────────────────

const BASE_URL = "api.ticketroko.retailian.in";
const imgSrc = (path) => (path ? `${BASE_URL}/${path}` : null);

const EMPTY_FORM = {
  name: "",
  slug: "",
  tagline: "",
  description: "",
  badge_text: "",
  discount_text: "",
  terms_text: "",
  tags: "",
  age_rating: "",
  url_link: "",
  cta_text: "Book Now",
  bg_color: "#6C63FF",
  sort_order: 0,
  is_featured: false,
  is_active: true,
};

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, color, icon }) {
  return (
    <Card
      elevation={0}
      sx={{
        color: "white",
        border: "1px solid",
        borderColor: alpha(color, 0.15),
        background: `linear-gradient(135deg, ${alpha(color, 0.07)} 0%, ${alpha(color, 0.02)} 100%)`,
        borderRadius: 3,
        flex: 1,
        minWidth: 130,
      }}
    >
      <CardContent sx={{ py: 2.5, px: 3, "&:last-child": { pb: 2.5 } }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
              fontWeight={500}
              mb={0.5}
            >
              {label}
            </Typography>
            <Typography variant="h5" fontWeight={800} color={color}>
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: alpha(color, 0.12),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color,
            }}
          >
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

// ─── Section Label ─────────────────────────────────────────────────────────────

function SectionLabel({ children }) {
  return (
    <Typography
      variant="caption"
      fontWeight={700}
      color="text.secondary"
      sx={{
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        mb: 1,
        display: "block",
      }}
    >
      {children}
    </Typography>
  );
}

// ─── Label Form ───────────────────────────────────────────────────────────────

function LabelForm({ initial, onSubmit, loading }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [thumbFile, setThumbFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(imgSrc(initial?.image_url));
  const [thumbPreview, setThumbPreview] = useState(
    imgSrc(initial?.thumbnail_url),
  );

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleFile = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (type === "image") {
      setImageFile(file);
      setImagePreview(url);
    }
    if (type === "thumb") {
      setThumbFile(file);
      setThumbPreview(url);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (imageFile) fd.append("image_url", imageFile);
    if (thumbFile) fd.append("thumbnail_url", thumbFile);
    fd.set(
      "tags",
      JSON.stringify(
        form.tags
          ? form.tags
              .split(",")
              .map((t) => t.trim().toUpperCase())
              .filter(Boolean)
          : [],
      ),
    );
    onSubmit(fd);
  };

  const inputSx = { "& .MuiOutlinedInput-root": { bgcolor: "#FAFAFA" } };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Grid container spacing={2.5}>
        {/* Basic Info */}
        <Grid item xs={12}>
          <SectionLabel>Basic Info</SectionLabel>
          <Divider sx={{ mb: 2 }} />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Name"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            required
            sx={inputSx}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocalOfferIcon sx={{ color: "#6C63FF", fontSize: 18 }} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Slug"
            value={form.slug}
            onChange={(e) => set("slug", e.target.value)}
            sx={inputSx}
            helperText="URL-friendly identifier"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Tagline"
            value={form.tagline}
            onChange={(e) => set("tagline", e.target.value)}
            sx={inputSx}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Description"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            sx={inputSx}
          />
        </Grid>

        {/* Display */}
        <Grid item xs={12} sx={{ mt: 1 }}>
          <SectionLabel>Display & Offer</SectionLabel>
          <Divider sx={{ mb: 2 }} />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Badge Text"
            value={form.badge_text}
            onChange={(e) => set("badge_text", e.target.value)}
            sx={inputSx}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Age Rating"
            value={form.age_rating}
            onChange={(e) => set("age_rating", e.target.value)}
            sx={inputSx}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Discount Text"
            value={form.discount_text}
            onChange={(e) => set("discount_text", e.target.value)}
            sx={inputSx}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Terms Text"
            value={form.terms_text}
            onChange={(e) => set("terms_text", e.target.value)}
            sx={inputSx}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Tags (comma-separated)"
            value={form.tags}
            onChange={(e) => set("tags", e.target.value)}
            sx={inputSx}
            placeholder="MUSIC, LIVE, TRENDING"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Booking URL"
            value={form.url_link}
            onChange={(e) => set("url_link", e.target.value)}
            sx={inputSx}
          />
        </Grid>

        {/* Style */}
        <Grid item xs={12} sx={{ mt: 1 }}>
          <SectionLabel>Style & Ordering</SectionLabel>
          <Divider sx={{ mb: 2 }} />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="CTA Text"
            value={form.cta_text}
            onChange={(e) => set("cta_text", e.target.value)}
            sx={inputSx}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            type="color"
            label="Background Color"
            value={form.bg_color}
            onChange={(e) => set("bg_color", e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{
              ...inputSx,
              "& input[type=color]": {
                height: 40,
                cursor: "pointer",
                padding: "4px 8px",
              },
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            type="number"
            label="Sort Order"
            value={form.sort_order}
            onChange={(e) => set("sort_order", Number(e.target.value))}
            sx={inputSx}
          />
        </Grid>

        {/* Images */}
        <Grid item xs={12} sx={{ mt: 1 }}>
          <SectionLabel>Media</SectionLabel>
          <Divider sx={{ mb: 2 }} />
        </Grid>

        {["image", "thumb"].map((type) => {
          const preview = type === "image" ? imagePreview : thumbPreview;
          const label = type === "image" ? "Banner Image" : "Thumbnail";
          return (
            <Grid item xs={12} md={6} key={type}>
              <Box
                sx={{
                  border: "2px dashed",
                  borderColor: preview ? "#6C63FF" : "#E5E7EB",
                  borderRadius: 3,
                  overflow: "hidden",
                  transition: "border-color 0.2s",
                  "&:hover": { borderColor: "#6C63FF" },
                }}
              >
                {preview ? (
                  <Box sx={{ position: "relative" }}>
                    <Box
                      component="img"
                      src={preview}
                      sx={{
                        width: "100%",
                        height: 160,
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        bgcolor: "rgba(0,0,0,0.45)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: 0,
                        transition: "opacity 0.2s",
                        "&:hover": { opacity: 1 },
                      }}
                    >
                      <Button
                        variant="contained"
                        component="label"
                        size="small"
                      >
                        Change
                        <input
                          hidden
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFile(e, type)}
                        />
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <Button
                    component="label"
                    fullWidth
                    sx={{
                      py: 4,
                      flexDirection: "column",
                      gap: 1,
                      color: "#9CA3AF",
                      "&:hover": { color: "#6C63FF" },
                    }}
                  >
                    <ImageIcon sx={{ fontSize: 36 }} />
                    <Typography variant="body2" fontWeight={600}>
                      {label}
                    </Typography>
                    <Typography variant="caption">Click to upload</Typography>
                    <input
                      hidden
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFile(e, type)}
                    />
                  </Button>
                )}
              </Box>
            </Grid>
          );
        })}

        {/* Toggles */}
        <Grid item xs={12}>
          <Stack direction="row" spacing={2}>
            {[
              { key: "is_active", label: "Active", color: "#22C55E" },
              { key: "is_featured", label: "Featured", color: "#F59E0B" },
            ].map(({ key, label, color }) => (
              <Box
                key={key}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  px: 2.5,
                  py: 1.5,
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: form[key] ? alpha(color, 0.3) : "#E5E7EB",
                  bgcolor: form[key] ? alpha(color, 0.06) : "transparent",
                  transition: "all 0.2s",
                }}
              >
                <Switch
                  checked={form[key]}
                  onChange={(e) => set(key, e.target.checked)}
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                      backgroundColor: `${color} !important`,
                    },
                  }}
                />
                <Typography
                  fontWeight={600}
                  color={form[key] ? color : "text.secondary"}
                >
                  {label}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Grid>

        {/* Submit */}
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={loading}
            sx={{ py: 1.5, fontSize: "1rem" }}
          >
            {loading ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              "Save Label"
            )}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

// ─── View Modal ───────────────────────────────────────────────────────────────

function LabelViewModal({ label }) {
  if (!label) return null;
  const fields = [
    ["Slug", label.slug],
    ["Tagline", label.tagline],
    ["Badge", label.badge_text],
    ["Age Rating", label.age_rating],
    ["Discount", label.discount_text],
    ["Terms", label.terms_text],
    ["CTA", label.cta_text],
    ["URL", label.url_link],
    ["Sort Order", label.sort_order],
  ].filter(([, v]) => v != null && v !== "");

  return (
    <Stack spacing={3}>
      {/* Hero */}
      <Box
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          position: "relative",
          height: 180,
          bgcolor: label.bg_color || "#6C63FF",
        }}
      >
        {label.image_url && (
          <Box
            component="img"
            src={imgSrc(label.image_url)}
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        )}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)",
          }}
        />
        <Box sx={{ position: "absolute", bottom: 16, left: 16, right: 16 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              src={imgSrc(label.thumbnail_url)}
              variant="rounded"
              sx={{
                width: 52,
                height: 52,
                // bgcolor: alpha("#fff", 0.2),
                border: "2px solid rgba(255,255,255,0.4)",
              }}
            />
            <Box>
              <Typography variant="h6" color="white" fontWeight={800}>
                {label.name}
              </Typography>
              {label.tagline && (
                <Typography variant="body2" color="rgba(255,255,255,0.8)">
                  {label.tagline}
                </Typography>
              )}
            </Box>
          </Stack>
        </Box>
      </Box>

      {/* Tags */}
      {Array.isArray(label.tags) && label.tags.length > 0 && (
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {label.tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              sx={{
                bgcolor: alpha("#6C63FF", 0.1),
                color: "#6C63FF",
                fontWeight: 700,
              }}
            />
          ))}
        </Stack>
      )}

      {/* Badges */}
      <Stack direction="row" spacing={2}>
        <Chip
          icon={label.is_active ? <CheckCircleIcon /> : <CancelIcon />}
          label={label.is_active ? "Active" : "Inactive"}
          sx={{
            bgcolor: label.is_active
              ? alpha("#22C55E", 0.1)
              : alpha("#EF4444", 0.1),
            color: label.is_active ? "#22C55E" : "#EF4444",
            fontWeight: 700,
          }}
        />
        {label.is_featured && (
          <Chip
            icon={<StarRoundedIcon />}
            label="Featured"
            sx={{
              bgcolor: alpha("#F59E0B", 0.1),
              color: "#F59E0B",
              fontWeight: 700,
            }}
          />
        )}
      </Stack>

      {/* Fields */}
      {label.description && (
        <Box sx={{ borderRadius: 2, p: 2 }}>
          <Typography
            variant="caption"
            fontWeight={700}
            color="text.secondary"
            sx={{ textTransform: "uppercase", letterSpacing: "0.06em" }}
          >
            Description
          </Typography>
          <Typography variant="body2" mt={0.5}>
            {label.description}
          </Typography>
        </Box>
      )}

      <Grid container spacing={1.5}>
        {fields.map(([key, val]) => (
          <Grid item xs={6} key={key}>
            <Box sx={{ bgcolor: "#F9FAFB", borderRadius: 2, p: 1.5 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
                sx={{
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  display: "block",
                }}
              >
                {key}
              </Typography>
              <Typography variant="body2" fontWeight={600} mt={0.3} noWrap>
                {String(val)}
              </Typography>
            </Box>
          </Grid>
        ))}
        <Grid item xs={6}>
          <Box sx={{ bgcolor: "#F9FAFB", borderRadius: 2, p: 1.5 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={600}
              sx={{
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                display: "block",
              }}
            >
              BG Color
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1} mt={0.3}>
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: 1,
                  bgcolor: label.bg_color,
                  border: "1px solid rgba(0,0,0,0.1)",
                }}
              />
              <Typography variant="body2" fontWeight={600}>
                {label.bg_color}
              </Typography>
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Stack>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Labels() {
  const dispatch = useDispatch();

  const labels = useSelector(selectAllLabels);
  const loading = useSelector(selectLabelsLoading);
  const actionLoading = useSelector(selectLabelsActionLoading);
  const error = useSelector(selectLabelsError);
  const total = useSelector(selectLabelsTotal);
  const totalPages = useSelector(selectLabelsTotalPages);
  const currentPage = useSelector(selectLabelsPage);

  const [modal, setModal] = useState(null);
  const [target, setTarget] = useState(null);
  const [search, setSearch] = useState("");
  const [filterActive, setFilterActive] = useState("");
  const [filterFeatured, setFilterFeatured] = useState("");
  const [page, setPage] = useState(1);
  const [dragId, setDragId] = useState(null);
  const [dragOver, setDragOver] = useState(null);

  const load = useCallback(() => {
    const params = { page, limit: 10 };
    if (search) params.search = search;
    if (filterActive) params.is_active = filterActive;
    if (filterFeatured) params.is_featured = filterFeatured;
    dispatch(fetchLabels(params));
  }, [dispatch, page, search, filterActive, filterFeatured]);

  useEffect(() => {
    load();
  }, [load]);

  const closeModal = () => {
    setModal(null);
    setTarget(null);
  };

  const handleCreate = async (fd) => {
    const res = await dispatch(createLabel(fd));
    if (!res.error) closeModal();
  };

  const handleUpdate = async (fd) => {
    const res = await dispatch(updateLabel({ id: target.id, formData: fd }));
    if (!res.error) closeModal();
  };

  const handleDelete = async () => {
    const res = await dispatch(deleteLabel(target.id));
    if (!res.error) closeModal();
  };

  const handleToggle = (l) => dispatch(toggleLabelStatus(l.id));

  const handleDragStart = (id) => setDragId(id);
  const handleDragOver = (e, id) => {
    e.preventDefault();
    setDragOver(id);
  };
  const handleDrop = (targetId) => {
    setDragOver(null);
    if (dragId === targetId) return;
    const reordered = [...labels];
    const from = reordered.findIndex((l) => l.id === dragId);
    const to = reordered.findIndex((l) => l.id === targetId);
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);
    dispatch(
      reorderLabels(reordered.map((l, i) => ({ id: l.id, sort_order: i }))),
    );
    setDragId(null);
  };

  const activeCount = labels.filter((l) => l.is_active).length;
  const featuredCount = labels.filter((l) => l.is_featured).length;

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{ p: { xs: 2, md: 3.5 }, bgcolor: "#0f172a", minHeight: "100vh" }}
      >
        {/* ── Header ─────────────────────────────────────────────── */}
        <Stack
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            padding: "25px",
          }}
        >
          <Box>
            <Stack direction="row" alignItems="center" spacing={1.5} mb={0.5}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2.5,
                  background:
                    "linear-gradient(135deg, #6C63FF 0%, #9D96FF 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(108,99,255,0.35)",
                }}
              >
                <LabelIcon sx={{ color: "white", fontSize: 20 }} />
              </Box>
              <Typography variant="h4">Labels</Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" pl={0.5}>
              Manage and organise your label collection
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setTarget(null);
              setModal("create");
            }}
            sx={{ px: 3, py: 1.2 }}
          >
            New Label
          </Button>
        </Stack>

        {/* ── Stats ──────────────────────────────────────────────── */}
        <Stack direction="row" spacing={2} mb={3} flexWrap="wrap" useFlexGap>
          <StatCard
            label="Total Labels"
            value={total}
            color="#6C63FF"
            icon={<LabelIcon fontSize="small" />}
          />
          <StatCard
            label="Active"
            value={activeCount}
            color="#22C55E"
            icon={<CheckCircleIcon fontSize="small" />}
          />
          <StatCard
            label="Featured"
            value={featuredCount}
            color="#F59E0B"
            icon={<StarRoundedIcon fontSize="small" />}
          />
          <StatCard
            label="Inactive"
            value={total - activeCount}
            color="#EF4444"
            icon={<CancelIcon fontSize="small" />}
          />
        </Stack>

        {/* ── Error ──────────────────────────────────────────────── */}
        {error && (
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 2.5,
              borderRadius: 3,
              border: "1px solid",
              borderColor: alpha("#EF4444", 0.3),
              bgcolor: alpha("#EF4444", 0.05),
              color: "#EF4444",
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <CancelIcon fontSize="small" />
              <Typography fontWeight={600}>{error}</Typography>
            </Stack>
          </Paper>
        )}

        {/* ── Filters ────────────────────────────────────────────── */}
        <Card
          elevation={0}
          sx={{
            color: "white",
            // bgcolor: "#5a70a4",
            mt: 2.5,
            mb: 2.5,
            border: "1px solid #E5E7EB",
            // borderRadius: 3,
          }}
        >
          <CardContent sx={{ py: 2, "&:last-child": { pb: 2 } }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
              <FilterListIcon sx={{ color: "#6B7280", fontSize: 18 }} />
              <Typography
                variant="body2"
                fontWeight={700}
                color="text.secondary"
              >
                Filters
              </Typography>
            </Stack>
            <Grid container spacing={2}>
              <Grid item xs={12} md={5}>
                <TextField
                  fullWidth
                  placeholder="Search labels…"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: "#9CA3AF" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select
                    sx={{ width: "200px" }}
                    value={filterActive}
                    label="Status"
                    onChange={(e) => {
                      setFilterActive(e.target.value);
                      setPage(1);
                    }}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="true">Active</MenuItem>
                    <MenuItem value="false">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Featured</InputLabel>
                  <Select
                    sx={{ width: "200px" }}
                    value={filterFeatured}
                    label="Featured"
                    onChange={(e) => {
                      setFilterFeatured(e.target.value);
                      setPage(1);
                    }}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="true">Featured</MenuItem>
                    <MenuItem value="false">Not Featured</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* ── Table ──────────────────────────────────────────────── */}
        <Card
          elevation={0}
          sx={{
            border: "1px solid #E5E7EB",
            // borderRadius: ,
            overflow: "hidden",
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width={48} />
                  <TableCell>Label</TableCell>
                  <TableCell>Tags</TableCell>
                  <TableCell>Badge</TableCell>
                  <TableCell>Age</TableCell>
                  <TableCell>Featured</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                      <CircularProgress sx={{ color: "#6C63FF" }} />
                    </TableCell>
                  </TableRow>
                ) : labels.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                      <Stack alignItems="center" spacing={1.5}>
                        <Box
                          sx={{
                            width: 60,
                            height: 60,
                            borderRadius: 3,
                            bgcolor: alpha("#6C63FF", 0.08),
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <LabelIcon sx={{ color: "#6C63FF", fontSize: 28 }} />
                        </Box>
                        <Typography fontWeight={700} color="text.secondary">
                          No labels found
                        </Typography>
                        <Typography variant="body2" color="text.disabled">
                          Try adjusting your filters or create a new label
                        </Typography>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ) : (
                  labels.map((l) => (
                    <TableRow
                      key={l.id}
                      draggable
                      onDragStart={() => handleDragStart(l.id)}
                      onDragOver={(e) => handleDragOver(e, l.id)}
                      onDrop={() => handleDrop(l.id)}
                      sx={{
                        cursor: "grab",
                        outline:
                          dragOver === l.id ? "2px solid #6C63FF" : "none",
                        outlineOffset: -2,
                        "&:active": { cursor: "grabbing" },
                      }}
                    >
                      <TableCell>
                        <DragIndicatorIcon
                          sx={{
                            color: "#D1D5DB",
                            display: "block",
                            mx: "auto",
                          }}
                        />
                      </TableCell>

                      <TableCell>
                        <Stack
                          direction="row"
                          spacing={1.5}
                          alignItems="center"
                        >
                          <Avatar
                            src={imgSrc(l.thumbnail_url)}
                            variant="rounded"
                            sx={{
                              width: 44,
                              height: 44,
                              bgcolor: l.bg_color || "#6C63FF",
                              border: "2px solid",
                              borderColor: alpha(l.bg_color || "#6C63FF", 0.3),
                              fontSize: 16,
                              fontWeight: 700,
                            }}
                          >
                            {l.name?.[0]}
                          </Avatar>
                          <Box>
                            <Typography fontWeight={700} fontSize="0.875rem">
                              {l.name}
                            </Typography>
                            {l.tagline && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                noWrap
                                sx={{ maxWidth: 200, display: "block" }}
                              >
                                {l.tagline}
                              </Typography>
                            )}
                          </Box>
                        </Stack>
                      </TableCell>

                      <TableCell>
                        <Stack
                          direction="row"
                          spacing={0.5}
                          flexWrap="wrap"
                          useFlexGap
                        >
                          {(Array.isArray(l.tags) ? l.tags : [])
                            .slice(0, 3)
                            .map((tag) => (
                              <Chip
                                key={tag}
                                label={tag}
                                size="small"
                                sx={{
                                  bgcolor: alpha("#6C63FF", 0.08),
                                  color: "#6C63FF",
                                  fontSize: "0.7rem",
                                  height: 22,
                                }}
                              />
                            ))}
                          {(Array.isArray(l.tags) ? l.tags : []).length > 3 && (
                            <Chip
                              label={`+${l.tags.length - 3}`}
                              size="small"
                              sx={{
                                bgcolor: "#F3F4F6",
                                color: "#6B7280",
                                fontSize: "0.7rem",
                                height: 22,
                              }}
                            />
                          )}
                        </Stack>
                      </TableCell>

                      <TableCell>
                        {l.badge_text ? (
                          <Chip
                            label={l.badge_text}
                            size="small"
                            sx={{
                              bgcolor: alpha("#F59E0B", 0.1),
                              color: "#B45309",
                              fontWeight: 700,
                              fontSize: "0.72rem",
                            }}
                          />
                        ) : (
                          <Typography color="text.disabled">—</Typography>
                        )}
                      </TableCell>

                      <TableCell>
                        {l.age_rating ? (
                          <Box
                            sx={{
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: 36,
                              height: 24,
                              borderRadius: 1.5,
                              border: "1.5px solid #E5E7EB",
                              bgcolor: "#F9FAFB",
                            }}
                          >
                            <Typography variant="caption" fontWeight={700}>
                              {l.age_rating}
                            </Typography>
                          </Box>
                        ) : (
                          <Typography color="text.disabled">—</Typography>
                        )}
                      </TableCell>

                      <TableCell>
                        {l.is_featured ? (
                          <Chip
                            icon={
                              <StarRoundedIcon
                                sx={{ fontSize: "14px !important" }}
                              />
                            }
                            label="Yes"
                            size="small"
                            sx={{
                              bgcolor: alpha("#F59E0B", 0.1),
                              color: "#B45309",
                              fontWeight: 700,
                            }}
                          />
                        ) : (
                          <Typography variant="body2" color="text.disabled">
                            No
                          </Typography>
                        )}
                      </TableCell>

                      <TableCell>
                        <Switch
                          checked={l.is_active}
                          onChange={() => handleToggle(l)}
                          size="small"
                        />
                      </TableCell>

                      <TableCell align="right">
                        <Stack
                          direction="row"
                          spacing={0.5}
                          justifyContent="flex-end"
                        >
                          {[
                            {
                              tip: "View",
                              icon: <VisibilityIcon fontSize="small" />,
                              action: () => {
                                setTarget(l);
                                setModal("view");
                              },
                              color: "default",
                            },
                            {
                              tip: "Edit",
                              icon: <EditIcon fontSize="small" />,
                              action: () => {
                                setTarget(l);
                                setModal("edit");
                              },
                              color: "default",
                            },
                            {
                              tip: "Delete",
                              icon: <DeleteIcon fontSize="small" />,
                              action: () => {
                                setTarget(l);
                                setModal("delete");
                              },
                              color: "error",
                            },
                          ].map(({ tip, icon, action, color }) => (
                            <Tooltip key={tip} title={tip}>
                              <IconButton
                                size="small"
                                color={color}
                                onClick={action}
                                sx={{
                                  border: "1px solid",
                                  borderColor:
                                    color === "error"
                                      ? alpha("#EF4444", 0.2)
                                      : "#E5E7EB",
                                  bgcolor:
                                    color === "error"
                                      ? alpha("#EF4444", 0.04)
                                      : "transparent",
                                  "&:hover": {
                                    bgcolor:
                                      color === "error"
                                        ? alpha("#EF4444", 0.1)
                                        : alpha("#6C63FF", 0.08),
                                    borderColor:
                                      color === "error" ? "#EF4444" : "#6C63FF",
                                    color:
                                      color === "error" ? "#EF4444" : "#6C63FF",
                                  },
                                  transition: "all 0.15s",
                                }}
                              >
                                {icon}
                              </IconButton>
                            </Tooltip>
                          ))}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <Divider />
          <Stack
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              padding: "5px",
            }}
            // direction="row"
            // justifyContent="space-between"
            // alignItems="center"
            px={3}
            py={1.8}
          >
            <Typography variant="body2" color="text.secondary">
              Page <strong>{currentPage}</strong> of{" "}
              <strong>{totalPages || 1}</strong>
              {total > 0 && <> · {total} total</>}
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                size="small"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                sx={{
                  borderColor: "#E5E7EB",
                  color: "text.secondary",
                  minWidth: 80,
                }}
              >
                ← Prev
              </Button>
              <Button
                variant="outlined"
                size="small"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                sx={{
                  borderColor: "#E5E7EB",
                  color: "text.secondary",
                  minWidth: 80,
                }}
              >
                Next →
              </Button>
            </Stack>
          </Stack>
        </Card>

        {/* ── Create Dialog ──────────────────────────────────────── */}
        <Dialog
          open={modal === "create"}
          onClose={closeModal}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ pb: 0 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 2,
                    background:
                      "linear-gradient(135deg, #6C63FF 0%, #9D96FF 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AddIcon sx={{ color: "white", fontSize: 18 }} />
                </Box>
                <Typography variant="h6">Create Label</Typography>
              </Stack>
              <IconButton onClick={closeModal} size="small">
                <CloseIcon fontSize="small" />
              </IconButton>
            </Stack>
          </DialogTitle>
          <Divider sx={{ mt: 2 }} />
          <DialogContent sx={{ pt: 3 }}>
            <LabelForm onSubmit={handleCreate} loading={actionLoading} />
          </DialogContent>
        </Dialog>

        {/* ── Edit Dialog ────────────────────────────────────────── */}
        <Dialog
          open={modal === "edit"}
          onClose={closeModal}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ pb: 0 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 2,
                    background:
                      "linear-gradient(135deg, #6C63FF 0%, #9D96FF 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <EditIcon sx={{ color: "white", fontSize: 18 }} />
                </Box>
                <Typography variant="h6">Edit Label</Typography>
              </Stack>
              <IconButton onClick={closeModal} size="small">
                <CloseIcon fontSize="small" />
              </IconButton>
            </Stack>
          </DialogTitle>
          <Divider sx={{ mt: 2 }} />
          <DialogContent sx={{ pt: 3 }}>
            <LabelForm
              initial={{
                ...target,
                tags: Array.isArray(target?.tags) ? target.tags.join(", ") : "",
              }}
              onSubmit={handleUpdate}
              loading={actionLoading}
            />
          </DialogContent>
        </Dialog>

        {/* ── View Dialog ────────────────────────────────────────── */}
        <Dialog
          open={modal === "view"}
          onClose={closeModal}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ pb: 0 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6">Label Details</Typography>
              <IconButton onClick={closeModal} size="small">
                <CloseIcon fontSize="small" />
              </IconButton>
            </Stack>
          </DialogTitle>
          <Divider sx={{ mt: 2 }} />
          <DialogContent sx={{ pt: 3 }}>
            <LabelViewModal label={target} />
          </DialogContent>
        </Dialog>

        {/* ── Delete Dialog ──────────────────────────────────────── */}
        <Dialog
          open={modal === "delete"}
          onClose={closeModal}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6">Delete Label</Typography>
              <IconButton onClick={closeModal} size="small">
                <CloseIcon fontSize="small" />
              </IconButton>
            </Stack>
          </DialogTitle>
          <DialogContent>
            <Box
              sx={{
                p: 2.5,
                borderRadius: 3,
                bgcolor: alpha("#EF4444", 0.05),
                border: "1px solid",
                borderColor: alpha("#EF4444", 0.2),
                mb: 1,
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar
                  src={imgSrc(target?.thumbnail_url)}
                  variant="rounded"
                  sx={{
                    width: 44,
                    height: 44,
                    bgcolor: target?.bg_color || "#6C63FF",
                  }}
                >
                  {target?.name?.[0]}
                </Avatar>
                <Box>
                  <Typography fontWeight={700}>{target?.name}</Typography>
                  {target?.tagline && (
                    <Typography variant="body2" color="text.secondary">
                      {target.tagline}
                    </Typography>
                  )}
                </Box>
              </Stack>
            </Box>
            <Typography variant="body2" color="text.secondary" mt={1.5}>
              This action cannot be undone. All data associated with this label
              will be permanently removed.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
            <Button
              onClick={closeModal}
              variant="outlined"
              sx={{ flex: 1, borderColor: "#E5E7EB", color: "text.secondary" }}
            >
              Cancel
            </Button>
            <Button
              color="error"
              variant="contained"
              onClick={handleDelete}
              disabled={actionLoading}
              sx={{
                flex: 1,
                background: "linear-gradient(135deg, #EF4444 0%, #F87171 100%)",
                boxShadow: "0 4px 12px rgba(239,68,68,0.35)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #DC2626 0%, #EF4444 100%)",
                },
              }}
            >
              {actionLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Delete Label"
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}
