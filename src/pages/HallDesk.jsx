import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHallsThunk, deleteHallThunk } from "../features/halls/hallThunks";

import {
  selectHallList,
  selectHallLoading,
  selectHallError,
  selectHallActionLoading,
} from "../features/halls/hallSelectors";

import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Stack,
  IconButton,
  Tooltip,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import CommonButton from "../commonComponents/CommonButton";

const HallDesk = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const halls = useSelector(selectHallList) ?? [];
  const loading = useSelector(selectHallLoading);
  const actionLoading = useSelector(selectHallActionLoading);
  const error = useSelector(selectHallError);

  useEffect(() => {
    dispatch(fetchHallsThunk());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this hall?")) {
      dispatch(deleteHallThunk(id));
    }
  };

  // const handleNavigate = (hall) => {
  //   navigate(`/hall-desk/${hall?.id || null}`);
  // };
  const handleNavigate = (hall) => {
    if (!hall?.id) {
      console.warn("Hall ID missing", hall);
      return;
    }
    navigate(`/hall-desk/${hall.id}`);
  };
  const handleAddHall = () => {
    navigate(`/hall`);
  };

  return (
    <Box sx={{ p: 0 }}>
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          mb: 4,
          pb: 3,
          borderBottom: "1px solid rgba(100, 116, 139, 0.2)",
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: "2rem",
              fontWeight: 800,
              background: "linear-gradient(135deg, #f59e0b 0%, #6366f1 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 0.5,
            }}
          >
            Venues
          </Typography>
          <Typography sx={{ color: "#a0aec0", fontSize: "0.9rem" }}>
            Manage your halls and venues
          </Typography>
        </Box>

        <CommonButton
          variant="contained"
          onClick={() => handleAddHall()}
          startIcon={<AddIcon />}
          sx={{
            background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
          }}
        >
          Add New Venue
        </CommonButton>
      </Stack>

      {/* Error */}
      {error && (
        <Typography color="error" mb={2}>
          {error}
        </Typography>
      )}

      {/* Loading */}
      {loading ? (
        <Box display="flex" justifyContent="center" mt={8}>
          <CircularProgress />
        </Box>
      ) : (
        <Stack spacing={2.5}>
          {halls?.length === 0 ? (
            <Card
              sx={{
                textAlign: "center",
                py: 8,
                background:
                  "linear-gradient(135deg, rgba(30,41,59,0.5), rgba(15,23,42,0.5))",
              }}
            >
              <Typography
                sx={{
                  fontSize: "1.2rem",
                  color: "#a0aec0",
                  fontWeight: 500,
                }}
              >
                No venues yet. Create your first venue to get started!
              </Typography>
            </Card>
          ) : (
            halls.map((hall, idx) => (
              <Card
                key={hall.id}
                variant="outlined"
                sx={{
                  background:
                    "linear-gradient(135deg, rgba(30,41,59,0.88), rgba(15,23,42,0.75))",
                  border: "1px solid rgba(100, 116, 139, 0.2)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  overflow: "hidden",
                  position: "relative",
                  borderRadius: 3,
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 12px 30px rgba(15, 23, 42, 0.2)",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "2px",
                    background:
                      "linear-gradient(90deg, #f59e0b, #6366f1, transparent)",
                  },
                  "&:hover": {
                    borderColor: "rgba(100, 116, 139, 0.45)",
                    boxShadow: "0 25px 50px rgba(15, 23, 42, 0.25)",
                    transform: "translateY(-4px)",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    spacing={3}
                  >
                    <Box flex={1}>
                      <Stack spacing={1.5}>
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 700,
                            fontSize: "1.3rem",
                            color: "#fff",
                          }}
                        >
                          {hall.name || "Unnamed Venue"}
                        </Typography>
                        <Stack spacing={0.5}>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#a0aec0",
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <span style={{ fontWeight: 600 }}>Capacity:</span>
                            <span
                              style={{
                                background: "rgba(245, 158, 11, 0.15)",
                                padding: "4px 8px",
                                borderRadius: "4px",
                                color: "#fcd34d",
                                fontWeight: 600,
                              }}
                            >
                              {hall.total_bookable_seats || "N/A"} seats
                            </span>
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{
                              color: "#a0aec0",
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <span style={{ fontWeight: 600 }}>Location:</span>
                            {hall.address || "N/A"}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Box>
                    <Stack direction="row" spacing={0.5}>
                      <Tooltip title="Edit Venue">
                        <IconButton
                          onClick={() => handleNavigate(hall)}
                          color="primary"
                          // sx={{
                          //   // borderRadius: "50%",
                          //   background: "rgba(245, 158, 11, 0.1)",
                          //   "&:hover": {
                          //     background: "rgba(245, 158, 11, 0.2)",
                          //   },
                          // }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete Venue">
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(hall.id)}
                          disabled={actionLoading}
                          // sx={{
                          //   background: "rgba(239, 68, 68, 0.1)",
                          //   "&:hover": {
                          //     background: "rgba(239, 68, 68, 0.2)",
                          //   },
                          // }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            ))
          )}
        </Stack>
      )}
    </Box>
  );
};

export default HallDesk;
