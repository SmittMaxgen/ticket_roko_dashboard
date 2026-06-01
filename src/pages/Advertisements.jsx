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
} from "@mui/material";

import { createTheme, ThemeProvider } from "@mui/material/styles";

import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ImageIcon from "@mui/icons-material/Image";
import CloseIcon from "@mui/icons-material/Close";
import CampaignIcon from "@mui/icons-material/Campaign";
import LinkIcon from "@mui/icons-material/Link";

import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchAdvertisements,
  createAdvertisement,
  updateAdvertisement,
  deleteAdvertisement,
  toggleAdvertisementStatus,
} from "../features/advertisement/advertisementthunks";

import {
  selectAllAdvertisements,
  selectAdvertisementsLoading,
  selectAdvertisementsActionLoading,
  selectAdvertisementsError,
  selectAdvertisementsTotal,
  selectAdvertisementsTotalPages,
  selectAdvertisementsPage,
} from "../features/advertisement/advertisementSelectors";

import { API_BASE_URL } from "../api/axios";

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
    MuiSelect: { styleOverrides: { root: { borderRadius: 10 } } },
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
    MuiChip: { styleOverrides: { root: { fontWeight: 600, borderRadius: 8 } } },
  },
});

// ─── Constants ────────────────────────────────────────────────────────────────

const imgSrc = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL}/${path}`;
};

const PLACEMENTS = [
  "home_top",
  "home_mid",
  "home_bottom",
  "sidebar",
  "popup",
  "other",
];

const EMPTY_FORM = {
  title: "",
  slug: "",
  tagline: "",
  description: "",
  badge_text: "",
  discount_text: "",
  terms_text: "",
  tags: "",
  placement: "home_top",
  starts_at: "",
  ends_at: "",
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
        color: color,
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
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box>
            <Typography variant="body2" color="white" fontWeight={500} mb={0.5}>
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

// ─── Advertisement Form ───────────────────────────────────────────────────────

function AdvertisementForm({ initial, onSubmit, loading }) {
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
    Object.entries(form).forEach(([k, v]) => {
      if (v !== null && v !== undefined) fd.append(k, v);
    });
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
        {/* Title & Slug */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Title"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            required
            sx={inputSx}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CampaignIcon sx={{ color: "#6C63FF", fontSize: 18 }} />
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
            helperText="Auto-generated if left empty"
          />
        </Grid>

        {/* Tagline & Description */}
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

        {/* Badge & Discount */}
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
            label="Discount Text"
            value={form.discount_text}
            onChange={(e) => set("discount_text", e.target.value)}
            sx={inputSx}
          />
        </Grid>

        {/* Terms & Tags */}
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
            placeholder="OFFER, FEATURED, NEW"
          />
        </Grid>

        {/* Placement & URL */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth sx={inputSx}>
            <InputLabel>Placement</InputLabel>
            <Select
              value={form.placement}
              label="Placement"
              onChange={(e) => set("placement", e.target.value)}
            >
              {PLACEMENTS.map((p) => (
                <MenuItem key={p} value={p}>
                  {p}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="URL Link"
            value={form.url_link}
            onChange={(e) => set("url_link", e.target.value)}
            sx={inputSx}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LinkIcon sx={{ color: "#6C63FF", fontSize: 18 }} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Schedule */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            type="datetime-local"
            label="Starts At"
            value={form.starts_at}
            onChange={(e) => set("starts_at", e.target.value)}
            sx={inputSx}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            type="datetime-local"
            label="Ends At"
            value={form.ends_at}
            onChange={(e) => set("ends_at", e.target.value)}
            sx={inputSx}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        {/* CTA, Color, Sort */}
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
            type="color"
            label="Background Color"
            value={form.bg_color}
            onChange={(e) => set("bg_color", e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{
              ...inputSx,
              "& input[type=color]": {
                height: 40,
                width: "140px",
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
              "Save Advertisement"
            )}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

// ─── View Modal ───────────────────────────────────────────────────────────────

function AdvertisementViewModal({ ad }) {
  if (!ad) return null;

  const fields = [
    ["Slug", ad.slug],
    ["Tagline", ad.tagline],
    ["Badge", ad.badge_text],
    ["Placement", ad.placement],
    ["Discount", ad.discount_text],
    ["Terms", ad.terms_text],
    ["CTA", ad.cta_text],
    ["URL", ad.url_link],
    ["Sort Order", ad.sort_order],
    [
      "Starts At",
      ad.starts_at ? new Date(ad.starts_at).toLocaleString() : null,
    ],
    ["Ends At", ad.ends_at ? new Date(ad.ends_at).toLocaleString() : null],
    ["Clicks", ad.click_count],
    ["Impressions", ad.impression_count],
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
          bgcolor: ad.bg_color || "#6C63FF",
        }}
      >
        {ad.image_url && (
          <Box
            component="img"
            src={imgSrc(ad.image_url)}
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
              src={imgSrc(ad.thumbnail_url)}
              variant="rounded"
              sx={{
                width: 52,
                height: 52,
                border: "2px solid rgba(255,255,255,0.4)",
              }}
            />
            <Box>
              <Typography variant="h6" color="white" fontWeight={800}>
                {ad.title}
              </Typography>
              {ad.tagline && (
                <Typography variant="body2" color="rgba(255,255,255,0.8)">
                  {ad.tagline}
                </Typography>
              )}
            </Box>
          </Stack>
        </Box>
      </Box>

      {/* Tags */}
      {Array.isArray(ad.tags) && ad.tags.length > 0 && (
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {ad.tags.map((tag) => (
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

      {/* Status badges */}
      <Stack direction="row" spacing={2}>
        <Chip
          icon={ad.is_active ? <CheckCircleIcon /> : <CancelIcon />}
          label={ad.is_active ? "Active" : "Inactive"}
          sx={{
            bgcolor: ad.is_active
              ? alpha("#22C55E", 0.1)
              : alpha("#EF4444", 0.1),
            color: ad.is_active ? "#22C55E" : "#EF4444",
            fontWeight: 700,
          }}
        />
        {ad.is_featured && (
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

      {/* Description */}
      {ad.description && (
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
            {ad.description}
          </Typography>
        </Box>
      )}

      {/* Fields grid */}
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
                  bgcolor: ad.bg_color,
                  border: "1px solid rgba(0,0,0,0.1)",
                }}
              />
              <Typography variant="body2" fontWeight={600}>
                {ad.bg_color}
              </Typography>
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Stack>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Advertisements() {
  const dispatch = useDispatch();

  const advertisements = useSelector(selectAllAdvertisements);
  const loading = useSelector(selectAdvertisementsLoading);
  const actionLoading = useSelector(selectAdvertisementsActionLoading);
  const error = useSelector(selectAdvertisementsError);
  const total = useSelector(selectAdvertisementsTotal);
  const totalPages = useSelector(selectAdvertisementsTotalPages);
  const currentPage = useSelector(selectAdvertisementsPage);

  const [modal, setModal] = useState(null);
  const [target, setTarget] = useState(null);
  const [search, setSearch] = useState("");
  const [filterActive, setFilterActive] = useState("");
  const [filterFeatured, setFilterFeatured] = useState("");
  const [filterPlacement, setFilterPlacement] = useState("");
  const [page, setPage] = useState(1);

  const load = useCallback(() => {
    const params = { page, limit: 10 };
    if (search) params.search = search;
    if (filterActive) params.is_active = filterActive;
    if (filterFeatured) params.is_featured = filterFeatured;
    if (filterPlacement) params.placement = filterPlacement;
    dispatch(fetchAdvertisements(params));
  }, [dispatch, page, search, filterActive, filterFeatured, filterPlacement]);

  useEffect(() => {
    load();
  }, [load]);

  const closeModal = () => {
    setModal(null);
    setTarget(null);
  };

  const handleCreate = async (fd) => {
    const res = await dispatch(createAdvertisement(fd));
    if (!res.error) closeModal();
  };

  const handleUpdate = async (fd) => {
    const res = await dispatch(
      updateAdvertisement({ id: target.id, formData: fd }),
    );
    if (!res.error) closeModal();
  };

  const handleDelete = async () => {
    const res = await dispatch(deleteAdvertisement(target.id));
    if (!res.error) closeModal();
  };

  const handleToggle = (ad) => dispatch(toggleAdvertisementStatus(ad.id));

  const activeCount = advertisements.filter((a) => a.is_active).length;
  const featuredCount = advertisements.filter((a) => a.is_featured).length;

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{ p: { xs: 2, md: 3.5 }, bgcolor: "#0f172a", minHeight: "100vh" }}
      >
        {/* ── Header ───────────────────────────────────────────── */}
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
                <CampaignIcon sx={{ color: "white", fontSize: 20 }} />
              </Box>
              <Typography variant="h4">Advertisements</Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" pl={0.5}>
              Manage and organise your advertisement banners
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
            New Advertisement
          </Button>
        </Stack>

        {/* ── Stats ────────────────────────────────────────────── */}
        <Stack direction="row" spacing={2} mb={3} flexWrap="wrap" useFlexGap>
          <StatCard
            label="Total Ads"
            value={total}
            color="#548701"
            icon={<CampaignIcon fontSize="small" />}
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

        {/* ── Error ────────────────────────────────────────────── */}
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

        {/* ── Filters ──────────────────────────────────────────── */}
        <Card
          elevation={0}
          sx={{ mt: 2.5, mb: 2.5, border: "1px solid #E5E7EB" }}
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
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Search advertisements…"
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
              <Grid item xs={6} md={2}>
                <FormControl sx={{ width: "200px" }} size="small">
                  <InputLabel>Status</InputLabel>
                  <Select
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
              <Grid item xs={6} md={2}>
                <FormControl sx={{ width: "200px" }} size="small">
                  <InputLabel>Featured</InputLabel>
                  <Select
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
              <Grid item xs={6} md={3}>
                <FormControl sx={{ width: "200px" }} size="small">
                  <InputLabel>Placement</InputLabel>
                  <Select
                    value={filterPlacement}
                    label="Placement"
                    onChange={(e) => {
                      setFilterPlacement(e.target.value);
                      setPage(1);
                    }}
                  >
                    <MenuItem value="">All</MenuItem>
                    {PLACEMENTS.map((p) => (
                      <MenuItem key={p} value={p}>
                        {p}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* ── Table ────────────────────────────────────────────── */}
        <Card
          elevation={0}
          sx={{ border: "1px solid #E5E7EB", overflow: "hidden" }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Advertisement</TableCell>
                  <TableCell>Placement</TableCell>
                  <TableCell>Tags</TableCell>
                  <TableCell>Badge</TableCell>
                  <TableCell>Featured</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                      <CircularProgress sx={{ color: "#6C63FF" }} />
                    </TableCell>
                  </TableRow>
                ) : advertisements.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
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
                          <CampaignIcon
                            sx={{ color: "#6C63FF", fontSize: 28 }}
                          />
                        </Box>
                        <Typography fontWeight={700} color="text.secondary">
                          No advertisements found
                        </Typography>
                        <Typography variant="body2" color="text.disabled">
                          Try adjusting your filters or create a new
                          advertisement
                        </Typography>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ) : (
                  advertisements.map((ad) => (
                    <TableRow key={ad.id}>
                      {/* Title + thumbnail */}
                      <TableCell>
                        <Stack
                          direction="row"
                          spacing={1.5}
                          alignItems="center"
                        >
                          <Avatar
                            src={imgSrc(ad.thumbnail_url)}
                            variant="rounded"
                            sx={{
                              width: 44,
                              height: 44,
                              bgcolor: ad.bg_color || "#6C63FF",
                              border: "2px solid",
                              borderColor: alpha(ad.bg_color || "#6C63FF", 0.3),
                              fontSize: 16,
                              fontWeight: 700,
                            }}
                          >
                            {ad.title?.[0]}
                          </Avatar>
                          <Box>
                            <Typography fontWeight={700} fontSize="0.875rem">
                              {ad.title}
                            </Typography>
                            {ad.tagline && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                noWrap
                                sx={{ maxWidth: 200, display: "block" }}
                              >
                                {ad.tagline}
                              </Typography>
                            )}
                          </Box>
                        </Stack>
                      </TableCell>

                      {/* Placement */}
                      <TableCell>
                        <Chip
                          label={ad.placement || "—"}
                          size="small"
                          sx={{
                            bgcolor: alpha("#6C63FF", 0.08),
                            color: "#6C63FF",
                            fontSize: "0.7rem",
                            height: 22,
                          }}
                        />
                      </TableCell>

                      {/* Tags */}
                      <TableCell>
                        <Stack
                          direction="row"
                          spacing={0.5}
                          flexWrap="wrap"
                          useFlexGap
                        >
                          {(Array.isArray(ad.tags) ? ad.tags : [])
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
                          {(Array.isArray(ad.tags) ? ad.tags : []).length >
                            3 && (
                            <Chip
                              label={`+${ad.tags.length - 3}`}
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

                      {/* Badge */}
                      <TableCell>
                        {ad.badge_text ? (
                          <Chip
                            label={ad.badge_text}
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

                      {/* Featured */}
                      <TableCell>
                        {ad.is_featured ? (
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

                      {/* Status toggle */}
                      <TableCell>
                        <Switch
                          checked={ad.is_active}
                          onChange={() => handleToggle(ad)}
                          size="small"
                        />
                      </TableCell>

                      {/* Actions */}
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
                                setTarget(ad);
                                setModal("view");
                              },
                              color: "default",
                            },
                            {
                              tip: "Edit",
                              icon: <EditIcon fontSize="small" />,
                              action: () => {
                                setTarget(ad);
                                setModal("edit");
                              },
                              color: "default",
                            },
                            {
                              tip: "Delete",
                              icon: <DeleteIcon fontSize="small" />,
                              action: () => {
                                setTarget(ad);
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

        {/* ── Create Dialog ─────────────────────────────────────── */}
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
                <Typography variant="h6">Create Advertisement</Typography>
              </Stack>
              <IconButton onClick={closeModal} size="small">
                <CloseIcon fontSize="small" />
              </IconButton>
            </Stack>
          </DialogTitle>
          <Divider sx={{ mt: 2 }} />
          <DialogContent sx={{ pt: 3 }}>
            <AdvertisementForm
              onSubmit={handleCreate}
              loading={actionLoading}
            />
          </DialogContent>
        </Dialog>

        {/* ── Edit Dialog ───────────────────────────────────────── */}
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
                <Typography variant="h6">Edit Advertisement</Typography>
              </Stack>
              <IconButton onClick={closeModal} size="small">
                <CloseIcon fontSize="small" />
              </IconButton>
            </Stack>
          </DialogTitle>
          <Divider sx={{ mt: 2 }} />
          <DialogContent sx={{ pt: 3 }}>
            <AdvertisementForm
              initial={{
                ...target,
                tags: Array.isArray(target?.tags) ? target.tags.join(", ") : "",
                starts_at: target?.starts_at
                  ? new Date(target.starts_at).toISOString().slice(0, 16)
                  : "",
                ends_at: target?.ends_at
                  ? new Date(target.ends_at).toISOString().slice(0, 16)
                  : "",
              }}
              onSubmit={handleUpdate}
              loading={actionLoading}
            />
          </DialogContent>
        </Dialog>

        {/* ── View Dialog ───────────────────────────────────────── */}
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
              <Typography variant="h6">Advertisement Details</Typography>
              <IconButton onClick={closeModal} size="small">
                <CloseIcon fontSize="small" />
              </IconButton>
            </Stack>
          </DialogTitle>
          <Divider sx={{ mt: 2 }} />
          <DialogContent sx={{ pt: 3 }}>
            <AdvertisementViewModal ad={target} />
          </DialogContent>
        </Dialog>

        {/* ── Delete Dialog ─────────────────────────────────────── */}
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
              <Typography variant="h6">Delete Advertisement</Typography>
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
                  {target?.title?.[0]}
                </Avatar>
                <Box>
                  <Typography fontWeight={700}>{target?.title}</Typography>
                  {target?.tagline && (
                    <Typography variant="body2" color="text.secondary">
                      {target.tagline}
                    </Typography>
                  )}
                </Box>
              </Stack>
            </Box>
            <Typography variant="body2" color="text.secondary" mt={1.5}>
              This action cannot be undone. All data associated with this
              advertisement will be permanently removed.
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
                "Delete Advertisement"
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}
