import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";
import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";

import { scanTicketThunk } from "../features/partyPlot/partyPlotThunks";

const TicketScanner = ({ open, onClose }) => {
  const videoRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (open && videoRef.current) {
      startScanning();
    } else {
      stopScanning();
    }

    return () => {
      stopScanning();
    };
  }, [open]);

  const startScanning = async () => {
    if (!videoRef.current) return;

    setScanning(true);
    const codeReader = new BrowserMultiFormatReader();

    try {
      const result = await codeReader.decodeOnceFromVideoDevice(
        undefined,
        videoRef.current,
      );
      setResult(result.getText());
      handleScan(result.getText());
    } catch (error) {
      console.error("Scanning error:", error);
      enqueueSnackbar("Scanning failed", { variant: "error" });
    } finally {
      setScanning(false);
      codeReader.reset();
    }
  };

  const stopScanning = () => {
    setScanning(false);
    setResult(null);
  };

  const handleScan = (barcode) => {
    setLoading(true);
    dispatch(scanTicketThunk(barcode))
      .unwrap()
      .then((data) => {
        enqueueSnackbar("Ticket scanned successfully!", { variant: "success" });
        onClose();
      })
      .catch((error) => {
        enqueueSnackbar(error, { variant: "error" });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleManualScan = () => {
    const barcode = prompt("Enter barcode manually:");
    if (barcode) {
      handleScan(barcode);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Ticket Scanner</DialogTitle>
      <DialogContent>
        <Box sx={{ textAlign: "center" }}>
          <video
            ref={videoRef}
            style={{
              width: "100%",
              maxWidth: 400,
              height: 300,
              border: "1px solid #ccc",
              borderRadius: 8,
            }}
          />
          {scanning && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Scanning... Point camera at barcode
            </Typography>
          )}
          {loading && <CircularProgress sx={{ mt: 2 }} />}
          {result && (
            <Typography variant="body1" sx={{ mt: 2 }}>
              Scanned: {result}
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleManualScan}>Manual Entry</Button>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TicketScanner;
