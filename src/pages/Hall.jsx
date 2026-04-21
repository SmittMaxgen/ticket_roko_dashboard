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
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";

const Hall = () => {
  const dispatch = useDispatch();

  const halls = useSelector(selectHallList);
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

  return (
    <Box p={3}>
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5" fontWeight="bold">
          Halls Management
        </Typography>

        <Button variant="contained" startIcon={<AddIcon />}>
          Add Hall
        </Button>
      </Stack>

      {/* Error */}
      {error && (
        <Typography color="error" mb={2}>
          {error}
        </Typography>
      )}

      {/* Loading */}
      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : (
        <Stack spacing={2}>
          {halls?.length === 0 ? (
            <Typography>No halls found</Typography>
          ) : (
            halls.map((hall) => (
              <Card key={hall.id} variant="outlined">
                <CardContent>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box>
                      <Typography variant="h6">
                        {hall.name || "Unnamed Hall"}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        Capacity: {hall.capacity || "N/A"}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        Location: {hall.location || "N/A"}
                      </Typography>
                    </Box>

                    <Stack direction="row" spacing={1}>
                      <IconButton color="primary">
                        <EditIcon />
                      </IconButton>

                      <IconButton
                        color="error"
                        onClick={() => handleDelete(hall.id)}
                        disabled={actionLoading}
                      >
                        <DeleteIcon />
                      </IconButton>
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

export default Hall;
