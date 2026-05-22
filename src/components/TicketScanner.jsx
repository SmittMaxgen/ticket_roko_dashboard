import React, { useCallback, useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";
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

const TicketScanner = ({ open, onClose, onScan, title = "Ticket Scanner" }) => {
  const videoRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleScan = useCallback(
    async (barcode) => {
      if (!onScan) return;

      setLoading(true);
      try {
        await onScan(barcode);
      } catch (error) {
        enqueueSnackbar(error || "Failed to scan ticket", { variant: "error" });
      } finally {
        setLoading(false);
      }
    },
    [onScan, enqueueSnackbar],
  );

  const startScanning = useCallback(async () => {
    if (!videoRef.current) return;

    setScanning(true);
    const codeReader = new BrowserMultiFormatReader();

    try {
      const result = await codeReader.decodeOnceFromVideoDevice(
        undefined,
        videoRef.current,
      );
      setResult(result.getText());
      await handleScan(result.getText());
    } catch (error) {
      console.error("Scanning error:", error);
      enqueueSnackbar("Scanning failed", { variant: "error" });
    } finally {
      setScanning(false);
      codeReader.reset();
    }
  }, [handleScan, enqueueSnackbar]);

  const stopScanning = useCallback(() => {
    setScanning(false);
    setResult(null);
  }, []);

  useEffect(() => {
    if (open && videoRef.current) {
      startScanning();
    } else {
      stopScanning();
    }

    return () => {
      stopScanning();
    };
  }, [open, startScanning, stopScanning]);

  const handleManualScan = () => {
    const barcode = prompt("Enter barcode manually:");
    if (barcode) {
      handleScan(barcode);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
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
