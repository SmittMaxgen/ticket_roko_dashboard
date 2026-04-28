// // import { useState, useRef, useCallback } from "react";

// // const MODES = ["Book Seats", "Admin: Draw Mode"];

// // const INIT_SECTIONS = [
// //   {
// //     id: "premium",
// //     label: "PREMIUM",
// //     color: "#f59e0b",
// //     price: 800,
// //     rows: [
// //       {
// //         label: "A",
// //         seats: Array.from({ length: 12 }, (_, i) => ({
// //           id: `A${i + 1}`,
// //           num: i + 1,
// //           status: i === 3 || i === 7 ? "booked" : "available",
// //         })),
// //       },
// //       {
// //         label: "B",
// //         seats: Array.from({ length: 12 }, (_, i) => ({
// //           id: `B${i + 1}`,
// //           num: i + 1,
// //           status: i === 5 ? "booked" : "available",
// //         })),
// //       },
// //     ],
// //   },
// //   {
// //     id: "executive",
// //     label: "EXECUTIVE",
// //     color: "#818cf8",
// //     price: 500,
// //     rows: [
// //       {
// //         label: "C",
// //         seats: Array.from({ length: 16 }, (_, i) => ({
// //           id: `C${i + 1}`,
// //           num: i + 1,
// //           status: i === 2 || i === 9 || i === 10 ? "booked" : "available",
// //         })),
// //       },
// //       {
// //         label: "D",
// //         seats: Array.from({ length: 16 }, (_, i) => ({
// //           id: `D${i + 1}`,
// //           num: i + 1,
// //           status: i === 6 ? "booked" : "available",
// //         })),
// //       },
// //       {
// //         label: "E",
// //         seats: Array.from({ length: 16 }, (_, i) => ({
// //           id: `E${i + 1}`,
// //           num: i + 1,
// //           status: i === 1 || i === 14 ? "booked" : "available",
// //         })),
// //       },
// //     ],
// //   },
// //   {
// //     id: "general",
// //     label: "GENERAL",
// //     color: "#34d399",
// //     price: 250,
// //     rows: [
// //       {
// //         label: "F",
// //         seats: Array.from({ length: 20 }, (_, i) => ({
// //           id: `F${i + 1}`,
// //           num: i + 1,
// //           status: i === 0 || i === 11 ? "booked" : "available",
// //         })),
// //       },
// //       {
// //         label: "G",
// //         seats: Array.from({ length: 20 }, (_, i) => ({
// //           id: `G${i + 1}`,
// //           num: i + 1,
// //           status: i === 7 || i === 8 ? "booked" : "available",
// //         })),
// //       },
// //       {
// //         label: "H",
// //         seats: Array.from({ length: 20 }, (_, i) => ({
// //           id: `H${i + 1}`,
// //           num: i + 1,
// //           status: i === 4 || i === 19 ? "booked" : "available",
// //         })),
// //       },
// //       {
// //         label: "I",
// //         seats: Array.from({ length: 20 }, (_, i) => ({
// //           id: `I${i + 1}`,
// //           num: i + 1,
// //           status: i === 9 || i === 10 ? "booked" : "available",
// //         })),
// //       },
// //     ],
// //   },
// // ];

// // const DRAW_TOOLS = [
// //   { id: "row", icon: "▬", label: "Add Row" },
// //   { id: "seat", icon: "◻", label: "Add Seat" },
// //   { id: "erase", icon: "⌫", label: "Erase" },
// // ];

// // const DRAW_SECTIONS = [
// //   { id: "premium", label: "Premium", color: "#f59e0b" },
// //   { id: "executive", label: "Executive", color: "#818cf8" },
// //   { id: "general", label: "General", color: "#34d399" },
// //   { id: "vip", label: "VIP", color: "#f472b6" },
// // ];

// // const SEAT_SHAPES = [
// //   { id: "rounded", r: 4, label: "Rounded" },
// //   { id: "square", r: 1, label: "Square" },
// //   { id: "circle", r: 11, label: "Circle" },
// // ];

// // const S = 22;
// // const GAP = 5;

// // function seatsAlongLine(x1, y1, x2, y2) {
// //   const dx = x2 - x1,
// //     dy = y2 - y1;
// //   const dist = Math.sqrt(dx * dx + dy * dy);
// //   const count = Math.max(1, Math.round(dist / (S + GAP)) + 1);
// //   const ux = dist === 0 ? 1 : dx / dist;
// //   const uy = dist === 0 ? 0 : dy / dist;
// //   return Array.from({ length: count }, (_, i) => ({
// //     x: x1 + ux * i * (S + GAP),
// //     y: y1 + uy * i * (S + GAP),
// //   }));
// // }

// // function BookingView({ sections: initSections }) {
// //   const [sections, setSections] = useState(() =>
// //     initSections.map((s) => ({
// //       ...s,
// //       rows: s.rows.map((r) => ({
// //         ...r,
// //         seats: r.seats.map((seat) => ({ ...seat })),
// //       })),
// //     })),
// //   );
// //   const [selected, setSelected] = useState([]);
// //   const [zoom, setZoom] = useState(1);
// //   const [tooltip, setTooltip] = useState(null);

// //   const toggleSeat = useCallback((secId, rowLabel, seatId) => {
// //     setSections((prev) =>
// //       prev.map((sec) => {
// //         if (sec.id !== secId) return sec;
// //         return {
// //           ...sec,
// //           rows: sec.rows.map((row) => {
// //             if (row.label !== rowLabel) return row;
// //             return {
// //               ...row,
// //               seats: row.seats.map((seat) => {
// //                 if (seat.id !== seatId || seat.status === "booked") return seat;
// //                 return {
// //                   ...seat,
// //                   status: seat.status === "selected" ? "available" : "selected",
// //                 };
// //               }),
// //             };
// //           }),
// //         };
// //       }),
// //     );
// //     setSelected((prev) => {
// //       const sec = initSections.find((s) => s.id === secId);
// //       const key = `${secId}:${seatId}`;
// //       if (prev.find((s) => s.key === key))
// //         return prev.filter((s) => s.key !== key);
// //       return [
// //         ...prev,
// //         {
// //           key,
// //           secId,
// //           seatId,
// //           rowLabel,
// //           price: sec?.price || 0,
// //           color: sec?.color || "#fff",
// //         },
// //       ];
// //     });
// //   }, []);

// //   const total = selected.reduce((a, s) => a + s.price, 0);

// //   return (
// //     <div
// //       style={{
// //         display: "grid",
// //         gridTemplateColumns: "1fr 300px",
// //         height: "100%",
// //       }}
// //     >
// //       <div
// //         style={{
// //           background: "#0d0d14",
// //           overflowY: "auto",
// //           padding: "24px 20px",
// //         }}
// //       >
// //         <div
// //           style={{
// //             display: "flex",
// //             justifyContent: "flex-end",
// //             gap: 6,
// //             marginBottom: 16,
// //           }}
// //         >
// //           {[0.75, 1, 1.25, 1.5].map((z) => (
// //             <button
// //               key={z}
// //               onClick={() => setZoom(z)}
// //               style={{
// //                 padding: "4px 10px",
// //                 background: zoom === z ? "#f59e0b" : "#1e1e2a",
// //                 color: zoom === z ? "#000" : "#888",
// //                 border: "none",
// //                 borderRadius: 6,
// //                 fontSize: 12,
// //                 cursor: "pointer",
// //                 fontWeight: zoom === z ? 700 : 400,
// //               }}
// //             >
// //               {Math.round(z * 100)}%
// //             </button>
// //           ))}
// //         </div>
// //         <div
// //           style={{
// //             transform: `scale(${zoom})`,
// //             transformOrigin: "top center",
// //             transition: "transform 0.2s",
// //           }}
// //         >
// //           <div style={{ textAlign: "center", marginBottom: 32 }}>
// //             <div
// //               style={{
// //                 width: 340,
// //                 height: 6,
// //                 background:
// //                   "linear-gradient(90deg,transparent,#fff8,transparent)",
// //                 borderRadius: 50,
// //                 margin: "0 auto 6px",
// //               }}
// //             />
// //             <div
// //               style={{
// //                 fontSize: 11,
// //                 color: "#666",
// //                 letterSpacing: 3,
// //                 fontWeight: 500,
// //               }}
// //             >
// //               SCREEN
// //             </div>
// //           </div>
// //           {sections.map((sec) => (
// //             <div key={sec.id} style={{ marginBottom: 28 }}>
// //               <div style={{ textAlign: "center", marginBottom: 10 }}>
// //                 <span
// //                   style={{
// //                     fontSize: 11,
// //                     color: sec.color,
// //                     letterSpacing: 2,
// //                     fontWeight: 600,
// //                     background: sec.color + "15",
// //                     padding: "3px 16px",
// //                     borderRadius: 20,
// //                     border: `1px solid ${sec.color}33`,
// //                   }}
// //                 >
// //                   {sec.label} · ₹{sec.price}
// //                 </span>
// //               </div>
// //               {sec.rows.map((row) => (
// //                 <div
// //                   key={row.label}
// //                   style={{
// //                     display: "flex",
// //                     alignItems: "center",
// //                     justifyContent: "center",
// //                     gap: 5,
// //                     marginBottom: 6,
// //                   }}
// //                 >
// //                   <span
// //                     style={{
// //                       fontSize: 10,
// //                       color: "#444",
// //                       width: 18,
// //                       textAlign: "right",
// //                       fontFamily: "monospace",
// //                     }}
// //                   >
// //                     {row.label}
// //                   </span>
// //                   <div style={{ display: "flex", gap: 4 }}>
// //                     {row.seats.map((seat, si) => (
// //                       <div
// //                         key={seat.id}
// //                         style={{ display: "flex", alignItems: "center" }}
// //                       >
// //                         {sec.id === "general" && si === 9 && (
// //                           <div style={{ width: 14 }} />
// //                         )}
// //                         <div
// //                           onMouseEnter={(e) =>
// //                             setTooltip({
// //                               sec: sec.label,
// //                               row: row.label,
// //                               num: seat.num,
// //                               price: sec.price,
// //                               status: seat.status,
// //                               x: e.clientX,
// //                               y: e.clientY,
// //                             })
// //                           }
// //                           onMouseLeave={() => setTooltip(null)}
// //                           onClick={() => toggleSeat(sec.id, row.label, seat.id)}
// //                           style={{
// //                             width: 26,
// //                             height: 26,
// //                             borderRadius:
// //                               seat.status === "selected" ? "50%" : "6px",
// //                             background:
// //                               seat.status === "booked"
// //                                 ? "#1e1215"
// //                                 : seat.status === "selected"
// //                                   ? sec.color
// //                                   : sec.color + "22",
// //                             border: `1.5px solid ${seat.status === "booked" ? "#4a1a2244" : seat.status === "selected" ? sec.color : sec.color + "55"}`,
// //                             cursor:
// //                               seat.status === "booked"
// //                                 ? "not-allowed"
// //                                 : "pointer",
// //                             transition: "all 0.15s",
// //                             transform:
// //                               seat.status === "selected"
// //                                 ? "scale(1.1)"
// //                                 : "scale(1)",
// //                             display: "flex",
// //                             alignItems: "center",
// //                             justifyContent: "center",
// //                             fontSize: 8,
// //                             color:
// //                               seat.status === "selected"
// //                                 ? "#000"
// //                                 : "transparent",
// //                             fontWeight: 700,
// //                           }}
// //                         >
// //                           {seat.status === "selected" ? "✓" : ""}
// //                         </div>
// //                       </div>
// //                     ))}
// //                   </div>
// //                   <span
// //                     style={{
// //                       fontSize: 10,
// //                       color: "#444",
// //                       width: 18,
// //                       fontFamily: "monospace",
// //                     }}
// //                   >
// //                     {row.label}
// //                   </span>
// //                 </div>
// //               ))}
// //             </div>
// //           ))}
// //           <div
// //             style={{
// //               display: "flex",
// //               justifyContent: "center",
// //               gap: 20,
// //               marginTop: 24,
// //               paddingTop: 20,
// //               borderTop: "1px solid #1e1e2a",
// //             }}
// //           >
// //             {[
// //               { label: "Available", bg: "#1e1e2a", border: "#444" },
// //               { label: "Selected", bg: "#f59e0b", border: "#f59e0b" },
// //               { label: "Booked", bg: "#1e1215", border: "#4a1a2244" },
// //             ].map((l) => (
// //               <div
// //                 key={l.label}
// //                 style={{
// //                   display: "flex",
// //                   alignItems: "center",
// //                   gap: 7,
// //                   fontSize: 12,
// //                   color: "#888",
// //                 }}
// //               >
// //                 <div
// //                   style={{
// //                     width: 14,
// //                     height: 14,
// //                     background: l.bg,
// //                     border: `1.5px solid ${l.border}`,
// //                     borderRadius: 4,
// //                   }}
// //                 />
// //                 {l.label}
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </div>

// //       <div
// //         style={{
// //           background: "#13131c",
// //           borderLeft: "1px solid #1e1e2a",
// //           display: "flex",
// //           flexDirection: "column",
// //         }}
// //       >
// //         <div
// //           style={{ padding: "20px 18px", borderBottom: "1px solid #1e1e2a" }}
// //         >
// //           <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>
// //             Grand Auditorium
// //           </div>
// //           <div style={{ fontSize: 12, color: "#666" }}>
// //             Saturday, 15 Mar · 7:30 PM
// //           </div>
// //           <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
// //             {sections.map((s) => {
// //               const avail = s.rows
// //                 .flatMap((r) => r.seats)
// //                 .filter((seat) => seat.status === "available").length;
// //               return (
// //                 <div
// //                   key={s.id}
// //                   style={{
// //                     flex: 1,
// //                     background: s.color + "11",
// //                     borderRadius: 8,
// //                     padding: "8px 6px",
// //                     textAlign: "center",
// //                     border: `1px solid ${s.color}22`,
// //                   }}
// //                 >
// //                   <div
// //                     style={{ fontSize: 16, fontWeight: 700, color: s.color }}
// //                   >
// //                     {avail}
// //                   </div>
// //                   <div style={{ fontSize: 9, color: "#666", marginTop: 2 }}>
// //                     {s.label}
// //                   </div>
// //                 </div>
// //               );
// //             })}
// //           </div>
// //         </div>
// //         <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px" }}>
// //           <div
// //             style={{
// //               fontSize: 12,
// //               color: "#666",
// //               fontWeight: 600,
// //               marginBottom: 10,
// //               letterSpacing: 1,
// //             }}
// //           >
// //             SELECTED SEATS
// //           </div>
// //           {selected.length === 0 ? (
// //             <div
// //               style={{
// //                 textAlign: "center",
// //                 padding: "32px 0",
// //                 color: "#444",
// //                 fontSize: 13,
// //               }}
// //             >
// //               <div style={{ fontSize: 32, marginBottom: 8 }}>🎭</div>Click seats
// //               to select
// //             </div>
// //           ) : (
// //             selected.map((s) => (
// //               <div
// //                 key={s.key}
// //                 style={{
// //                   display: "flex",
// //                   alignItems: "center",
// //                   justifyContent: "space-between",
// //                   background: "#1a1a24",
// //                   borderRadius: 8,
// //                   padding: "10px 12px",
// //                   marginBottom: 6,
// //                   border: `1px solid ${s.color}22`,
// //                 }}
// //               >
// //                 <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
// //                   <div
// //                     style={{
// //                       width: 10,
// //                       height: 10,
// //                       borderRadius: "50%",
// //                       background: s.color,
// //                     }}
// //                   />
// //                   <span style={{ fontSize: 13, fontWeight: 600 }}>
// //                     Row {s.rowLabel} · {s.seatId}
// //                   </span>
// //                 </div>
// //                 <span style={{ fontSize: 13, color: s.color, fontWeight: 700 }}>
// //                   ₹{s.price}
// //                 </span>
// //               </div>
// //             ))
// //           )}
// //         </div>
// //         <div style={{ padding: "16px 18px", borderTop: "1px solid #1e1e2a" }}>
// //           <div
// //             style={{
// //               display: "flex",
// //               justifyContent: "space-between",
// //               fontSize: 13,
// //               marginBottom: 4,
// //             }}
// //           >
// //             <span style={{ color: "#888" }}>Subtotal</span>
// //             <span style={{ fontWeight: 600 }}>₹{total}</span>
// //           </div>
// //           <div
// //             style={{
// //               display: "flex",
// //               justifyContent: "space-between",
// //               fontSize: 12,
// //               marginBottom: 14,
// //             }}
// //           >
// //             <span style={{ color: "#555" }}>Convenience fee</span>
// //             <span style={{ color: "#555" }}>₹{Math.round(total * 0.05)}</span>
// //           </div>
// //           <div
// //             style={{
// //               display: "flex",
// //               justifyContent: "space-between",
// //               fontSize: 16,
// //               fontWeight: 700,
// //               marginBottom: 16,
// //               paddingTop: 10,
// //               borderTop: "1px solid #1e1e2a",
// //             }}
// //           >
// //             <span>Total</span>
// //             <span style={{ color: "#f59e0b" }}>
// //               ₹{total + Math.round(total * 0.05)}
// //             </span>
// //           </div>
// //           <button
// //             disabled={selected.length === 0}
// //             style={{
// //               width: "100%",
// //               background: selected.length > 0 ? "#f59e0b" : "#1e1e2a",
// //               color: selected.length > 0 ? "#000" : "#444",
// //               border: "none",
// //               borderRadius: 10,
// //               padding: "13px",
// //               fontWeight: 700,
// //               fontSize: 14,
// //               cursor: selected.length > 0 ? "pointer" : "not-allowed",
// //               transition: "all 0.2s",
// //             }}
// //           >
// //             {selected.length > 0 ? "Proceed to Pay  →" : "Select Seats"}
// //           </button>
// //         </div>
// //       </div>

// //       {tooltip && (
// //         <div
// //           style={{
// //             position: "fixed",
// //             left: tooltip.x + 12,
// //             top: tooltip.y - 60,
// //             background: "#1e1e2a",
// //             border: "1px solid #2a2a3a",
// //             borderRadius: 8,
// //             padding: "8px 12px",
// //             fontSize: 12,
// //             pointerEvents: "none",
// //             zIndex: 9999,
// //           }}
// //         >
// //           <div style={{ fontWeight: 600, marginBottom: 2 }}>
// //             {tooltip.sec} · Row {tooltip.row} · Seat {tooltip.num}
// //           </div>
// //           <div
// //             style={{
// //               color: tooltip.status === "booked" ? "#ef4444" : "#f59e0b",
// //             }}
// //           >
// //             {tooltip.status === "booked"
// //               ? "Already Booked"
// //               : `₹${tooltip.price}`}
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // // ─── Draw Mode ────────────────────────────────────────────────────────────────
// // function DrawMode() {
// //   const svgRef = useRef(null);
// //   const [tool, setTool] = useState("row");
// //   const [activeSec, setActiveSec] = useState("premium");
// //   const [seatShape, setSeatShape] = useState("rounded");
// //   const [drawing, setDrawing] = useState(false);
// //   const [startPos, setStartPos] = useState(null);
// //   const [liveEnd, setLiveEnd] = useState(null);
// //   const [placedRows, setPlacedRows] = useState([]);
// //   const [placedSeats, setPlacedSeats] = useState([]);
// //   const [hoverPos, setHoverPos] = useState(null);

// //   const getSec = () => DRAW_SECTIONS.find((s) => s.id === activeSec);
// //   const getShape = () => SEAT_SHAPES.find((s) => s.id === seatShape);

// //   const svgPoint = (e) => {
// //     const rect = svgRef.current?.getBoundingClientRect();
// //     if (!rect) return { x: 0, y: 0 };
// //     return { x: e.clientX - rect.left, y: e.clientY - rect.top };
// //   };

// //   const handleMouseDown = (e) => {
// //     if (e.button !== 0) return;
// //     const pos = svgPoint(e);
// //     setDrawing(true);
// //     setStartPos(pos);
// //     setLiveEnd(pos);
// //   };

// //   const handleMouseMove = (e) => {
// //     const pos = svgPoint(e);
// //     setHoverPos(pos);
// //     if (drawing) setLiveEnd(pos);
// //   };

// //   const handleMouseUp = (e) => {
// //     if (!drawing || !startPos) return;
// //     const pos = svgPoint(e);
// //     const sec = getSec();

// //     if (tool === "row") {
// //       const pts = seatsAlongLine(startPos.x, startPos.y, pos.x, pos.y);
// //       if (pts.length > 0) {
// //         setPlacedRows((prev) => [
// //           ...prev,
// //           {
// //             id: `r${Date.now()}`,
// //             pts,
// //             color: sec.color,
// //             sectionId: activeSec,
// //             shape: seatShape,
// //             label: sec.label,
// //           },
// //         ]);
// //       }
// //     } else if (tool === "seat") {
// //       setPlacedSeats((prev) => [
// //         ...prev,
// //         {
// //           id: `s${Date.now()}`,
// //           x: pos.x,
// //           y: pos.y,
// //           color: sec.color,
// //           sectionId: activeSec,
// //           shape: seatShape,
// //         },
// //       ]);
// //     } else if (tool === "erase") {
// //       const RADIUS = 20;
// //       setPlacedRows((prev) =>
// //         prev.filter(
// //           (row) =>
// //             !row.pts.some((p) => Math.hypot(p.x - pos.x, p.y - pos.y) < RADIUS),
// //         ),
// //       );
// //       setPlacedSeats((prev) =>
// //         prev.filter((s) => Math.hypot(s.x - pos.x, s.y - pos.y) >= RADIUS),
// //       );
// //     }

// //     setDrawing(false);
// //     setStartPos(null);
// //     setLiveEnd(null);
// //   };

// //   const previewPts =
// //     drawing && startPos && liveEnd && tool === "row"
// //       ? seatsAlongLine(startPos.x, startPos.y, liveEnd.x, liveEnd.y)
// //       : [];

// //   const angleNow =
// //     drawing && startPos && liveEnd
// //       ? Math.round(
// //           (Math.atan2(liveEnd.y - startPos.y, liveEnd.x - startPos.x) * 180) /
// //             Math.PI,
// //         )
// //       : null;

// //   const shapeR = getShape().r;
// //   const secColor = getSec().color;

// //   const totalSeats =
// //     placedRows.reduce((a, row) => a + row.pts.length, 0) + placedSeats.length;

// //   return (
// //     <div
// //       style={{
// //         display: "grid",
// //         gridTemplateColumns: "185px 1fr 205px",
// //         height: "100%",
// //       }}
// //     >
// //       {/* Left toolbar */}
// //       <div
// //         style={{
// //           background: "#13131c",
// //           borderRight: "1px solid #1e1e2a",
// //           padding: 14,
// //           display: "flex",
// //           flexDirection: "column",
// //           gap: 18,
// //           overflowY: "auto",
// //         }}
// //       >
// //         <div>
// //           <div
// //             style={{
// //               fontSize: 10,
// //               color: "#555",
// //               letterSpacing: 1,
// //               marginBottom: 8,
// //               fontWeight: 600,
// //             }}
// //           >
// //             TOOLS
// //           </div>
// //           {DRAW_TOOLS.map((t) => (
// //             <button
// //               key={t.id}
// //               onClick={() => setTool(t.id)}
// //               style={{
// //                 width: "100%",
// //                 display: "flex",
// //                 alignItems: "center",
// //                 gap: 10,
// //                 padding: "9px 12px",
// //                 background: tool === t.id ? "#1e1e2e" : "transparent",
// //                 border: `1px solid ${tool === t.id ? "#6366f1" : "transparent"}`,
// //                 borderRadius: 8,
// //                 color: tool === t.id ? "#fff" : "#666",
// //                 cursor: "pointer",
// //                 marginBottom: 4,
// //                 fontSize: 13,
// //                 fontWeight: tool === t.id ? 600 : 400,
// //                 transition: "all 0.15s",
// //               }}
// //             >
// //               <span style={{ fontSize: 15 }}>{t.icon}</span> {t.label}
// //             </button>
// //           ))}
// //         </div>

// //         <div>
// //           <div
// //             style={{
// //               fontSize: 10,
// //               color: "#555",
// //               letterSpacing: 1,
// //               marginBottom: 8,
// //               fontWeight: 600,
// //             }}
// //           >
// //             SECTION
// //           </div>
// //           {DRAW_SECTIONS.map((s) => (
// //             <button
// //               key={s.id}
// //               onClick={() => setActiveSec(s.id)}
// //               style={{
// //                 width: "100%",
// //                 display: "flex",
// //                 alignItems: "center",
// //                 gap: 8,
// //                 padding: "8px 10px",
// //                 background: activeSec === s.id ? s.color + "22" : "transparent",
// //                 border: `1px solid ${activeSec === s.id ? s.color + "66" : "transparent"}`,
// //                 borderRadius: 8,
// //                 color: activeSec === s.id ? s.color : "#666",
// //                 cursor: "pointer",
// //                 marginBottom: 4,
// //                 fontSize: 12,
// //                 fontWeight: activeSec === s.id ? 600 : 400,
// //                 transition: "all 0.15s",
// //               }}
// //             >
// //               <div
// //                 style={{
// //                   width: 10,
// //                   height: 10,
// //                   borderRadius: "50%",
// //                   background: s.color,
// //                   flexShrink: 0,
// //                 }}
// //               />{" "}
// //               {s.label}
// //             </button>
// //           ))}
// //         </div>

// //         <div>
// //           <div
// //             style={{
// //               fontSize: 10,
// //               color: "#555",
// //               letterSpacing: 1,
// //               marginBottom: 8,
// //               fontWeight: 600,
// //             }}
// //           >
// //             SEAT SHAPE
// //           </div>
// //           {SEAT_SHAPES.map((s) => (
// //             <button
// //               key={s.id}
// //               onClick={() => setSeatShape(s.id)}
// //               style={{
// //                 width: "100%",
// //                 display: "flex",
// //                 alignItems: "center",
// //                 gap: 8,
// //                 padding: "8px 10px",
// //                 background: seatShape === s.id ? "#1e1e2e" : "transparent",
// //                 border: `1px solid ${seatShape === s.id ? "#6366f1" : "transparent"}`,
// //                 borderRadius: 8,
// //                 color: seatShape === s.id ? "#fff" : "#666",
// //                 cursor: "pointer",
// //                 marginBottom: 4,
// //                 fontSize: 12,
// //                 transition: "all 0.15s",
// //               }}
// //             >
// //               <div
// //                 style={{
// //                   width: 14,
// //                   height: 14,
// //                   background: seatShape === s.id ? "#6366f1" : "#333",
// //                   borderRadius: s.r >= 10 ? "50%" : s.r + "px",
// //                   flexShrink: 0,
// //                 }}
// //               />{" "}
// //               {s.label}
// //             </button>
// //           ))}
// //         </div>

// //         <button
// //           onClick={() => {
// //             setPlacedRows([]);
// //             setPlacedSeats([]);
// //           }}
// //           style={{
// //             marginTop: "auto",
// //             padding: "8px",
// //             background: "transparent",
// //             border: "1px solid #ef444433",
// //             borderRadius: 8,
// //             color: "#ef4444",
// //             cursor: "pointer",
// //             fontSize: 12,
// //           }}
// //         >
// //           Clear All
// //         </button>
// //       </div>

// //       {/* SVG Canvas */}
// //       <div
// //         style={{
// //           background: "#0d0d14",
// //           overflow: "hidden",
// //           position: "relative",
// //           display: "flex",
// //           flexDirection: "column",
// //         }}
// //       >
// //         <div
// //           style={{
// //             padding: "8px 16px",
// //             borderBottom: "1px solid #1a1a24",
// //             display: "flex",
// //             alignItems: "center",
// //             gap: 10,
// //             flexShrink: 0,
// //             minHeight: 36,
// //           }}
// //         >
// //           <div
// //             style={{
// //               width: 7,
// //               height: 7,
// //               borderRadius: "50%",
// //               background: "#22c55e",
// //               flexShrink: 0,
// //             }}
// //           />
// //           <span style={{ fontSize: 12, color: "#555" }}>
// //             {tool === "row" &&
// //               "Click & drag freely in any direction — seats follow your path at any angle"}
// //             {tool === "seat" && "Click anywhere to drop a single seat"}
// //             {tool === "erase" && "Click on any seat or row to erase it"}
// //           </span>
// //           {angleNow !== null && (
// //             <span
// //               style={{
// //                 marginLeft: "auto",
// //                 fontSize: 12,
// //                 color: secColor,
// //                 fontWeight: 600,
// //                 background: secColor + "15",
// //                 padding: "2px 10px",
// //                 borderRadius: 12,
// //               }}
// //             >
// //               {previewPts.length} seats · {angleNow}°
// //             </span>
// //           )}
// //         </div>

// //         <svg
// //           ref={svgRef}
// //           style={{
// //             flex: 1,
// //             width: "100%",
// //             display: "block",
// //             cursor: "crosshair",
// //             userSelect: "none",
// //           }}
// //           onMouseDown={handleMouseDown}
// //           onMouseMove={handleMouseMove}
// //           onMouseUp={handleMouseUp}
// //           onMouseLeave={() => {
// //             setHoverPos(null);
// //             if (drawing) {
// //               setDrawing(false);
// //               setStartPos(null);
// //               setLiveEnd(null);
// //             }
// //           }}
// //         >
// //           {/* Dot grid */}
// //           <defs>
// //             <pattern
// //               id="dotgrid"
// //               width="27"
// //               height="27"
// //               patternUnits="userSpaceOnUse"
// //             >
// //               <circle cx="1" cy="1" r="1" fill="#2a2a35" />
// //             </pattern>
// //           </defs>
// //           <rect width="100%" height="100%" fill="url(#dotgrid)" />

// //           {/* Stage */}
// //           <rect
// //             x="50%"
// //             y="18"
// //             width="180"
// //             height="28"
// //             rx="6"
// //             fill="#1a1a24"
// //             stroke="#2a2a35"
// //             strokeWidth="1"
// //             transform="translate(-90,0)"
// //           />
// //           <text
// //             x="50%"
// //             y="36"
// //             textAnchor="middle"
// //             fill="#444"
// //             fontSize="11"
// //             letterSpacing="3"
// //             fontFamily="DM Sans,sans-serif"
// //             fontWeight="500"
// //           >
// //             STAGE
// //           </text>

// //           {/* Placed rows */}
// //           {placedRows.map((row) => {
// //             const r2 = SEAT_SHAPES.find((s) => s.id === row.shape)?.r ?? 4;
// //             return row.pts.map((pt, i) => (
// //               <rect
// //                 key={`${row.id}-${i}`}
// //                 x={pt.x - S / 2}
// //                 y={pt.y - S / 2}
// //                 width={S}
// //                 height={S}
// //                 rx={r2}
// //                 ry={r2}
// //                 fill={row.color + "30"}
// //                 stroke={row.color + "99"}
// //                 strokeWidth={1.5}
// //               />
// //             ));
// //           })}

// //           {/* Placed individual seats */}
// //           {placedSeats.map((seat) => {
// //             const r2 = SEAT_SHAPES.find((s) => s.id === seat.shape)?.r ?? 4;
// //             return (
// //               <rect
// //                 key={seat.id}
// //                 x={seat.x - S / 2}
// //                 y={seat.y - S / 2}
// //                 width={S}
// //                 height={S}
// //                 rx={r2}
// //                 ry={r2}
// //                 fill={seat.color + "30"}
// //                 stroke={seat.color + "99"}
// //                 strokeWidth={1.5}
// //               />
// //             );
// //           })}

// //           {/* Guide line while dragging */}
// //           {drawing && startPos && liveEnd && tool === "row" && (
// //             <line
// //               x1={startPos.x}
// //               y1={startPos.y}
// //               x2={liveEnd.x}
// //               y2={liveEnd.y}
// //               stroke={secColor + "50"}
// //               strokeWidth={1}
// //               strokeDasharray="4 3"
// //             />
// //           )}

// //           {/* Live preview seats */}
// //           {previewPts.map((pt, i) => (
// //             <rect
// //               key={`prev-${i}`}
// //               x={pt.x - S / 2}
// //               y={pt.y - S / 2}
// //               width={S}
// //               height={S}
// //               rx={shapeR}
// //               ry={shapeR}
// //               fill={secColor + "30"}
// //               stroke={secColor}
// //               strokeWidth={1.5}
// //               strokeDasharray="3 2"
// //               opacity={0.8}
// //             />
// //           ))}

// //           {/* Start anchor dot */}
// //           {drawing && startPos && (
// //             <circle
// //               cx={startPos.x}
// //               cy={startPos.y}
// //               r={5}
// //               fill={secColor}
// //               opacity={0.9}
// //             />
// //           )}

// //           {/* Single seat hover ghost */}
// //           {!drawing && hoverPos && tool === "seat" && (
// //             <rect
// //               x={hoverPos.x - S / 2}
// //               y={hoverPos.y - S / 2}
// //               width={S}
// //               height={S}
// //               rx={shapeR}
// //               ry={shapeR}
// //               fill={secColor + "30"}
// //               stroke={secColor}
// //               strokeWidth={1.5}
// //               strokeDasharray="3 2"
// //               opacity={0.6}
// //               style={{ pointerEvents: "none" }}
// //             />
// //           )}

// //           {/* Eraser radius indicator */}
// //           {tool === "erase" && hoverPos && (
// //             <circle
// //               cx={hoverPos.x}
// //               cy={hoverPos.y}
// //               r={20}
// //               fill="none"
// //               stroke="#ef444877"
// //               strokeWidth={1.5}
// //               strokeDasharray="4 3"
// //               style={{ pointerEvents: "none" }}
// //             />
// //           )}
// //         </svg>
// //       </div>

// //       {/* Right summary */}
// //       <div
// //         style={{
// //           background: "#13131c",
// //           borderLeft: "1px solid #1e1e2a",
// //           padding: 16,
// //           display: "flex",
// //           flexDirection: "column",
// //           gap: 16,
// //           overflowY: "auto",
// //         }}
// //       >
// //         <div>
// //           <div
// //             style={{
// //               fontSize: 10,
// //               color: "#555",
// //               letterSpacing: 1,
// //               marginBottom: 10,
// //               fontWeight: 600,
// //             }}
// //           >
// //             LAYOUT SUMMARY
// //           </div>
// //           <div style={{ background: "#0d0d14", borderRadius: 10, padding: 14 }}>
// //             {[
// //               { label: "Total seats", value: totalSeats, color: "#f59e0b" },
// //               { label: "Rows placed", value: placedRows.length, color: "#fff" },
// //               { label: "Individual", value: placedSeats.length, color: "#fff" },
// //             ].map((row) => (
// //               <div
// //                 key={row.label}
// //                 style={{
// //                   display: "flex",
// //                   justifyContent: "space-between",
// //                   fontSize: 13,
// //                   marginBottom: 8,
// //                 }}
// //               >
// //                 <span style={{ color: "#888" }}>{row.label}</span>
// //                 <span style={{ fontWeight: 700, color: row.color }}>
// //                   {row.value}
// //                 </span>
// //               </div>
// //             ))}
// //           </div>
// //         </div>

// //         <div>
// //           <div
// //             style={{
// //               fontSize: 10,
// //               color: "#555",
// //               letterSpacing: 1,
// //               marginBottom: 10,
// //               fontWeight: 600,
// //             }}
// //           >
// //             SECTIONS USED
// //           </div>
// //           {DRAW_SECTIONS.map((s) => {
// //             const cnt =
// //               placedRows
// //                 .filter((r) => r.sectionId === s.id)
// //                 .reduce((a, r) => a + r.pts.length, 0) +
// //               placedSeats.filter((p) => p.sectionId === s.id).length;
// //             if (cnt === 0) return null;
// //             return (
// //               <div
// //                 key={s.id}
// //                 style={{
// //                   display: "flex",
// //                   alignItems: "center",
// //                   justifyContent: "space-between",
// //                   marginBottom: 8,
// //                 }}
// //               >
// //                 <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
// //                   <div
// //                     style={{
// //                       width: 10,
// //                       height: 10,
// //                       borderRadius: "50%",
// //                       background: s.color,
// //                     }}
// //                   />
// //                   <span style={{ fontSize: 12, color: "#888" }}>{s.label}</span>
// //                 </div>
// //                 <span style={{ fontSize: 13, fontWeight: 600, color: s.color }}>
// //                   {cnt}
// //                 </span>
// //               </div>
// //             );
// //           })}
// //           {totalSeats === 0 && (
// //             <div
// //               style={{
// //                 fontSize: 12,
// //                 color: "#333",
// //                 textAlign: "center",
// //                 padding: "16px 0",
// //               }}
// //             >
// //               No seats placed yet
// //             </div>
// //           )}
// //         </div>

// //         {/* Angle compass */}
// //         <div style={{ background: "#0d0d14", borderRadius: 10, padding: 12 }}>
// //           <div
// //             style={{
// //               fontSize: 10,
// //               color: "#555",
// //               letterSpacing: 1,
// //               marginBottom: 6,
// //               fontWeight: 600,
// //             }}
// //           >
// //             ANGLE GUIDE
// //           </div>
// //           <svg width="100%" viewBox="0 0 160 90">
// //             {[0, 45, 90, 135, -45, -90, -135, 180].map((deg) => {
// //               const rad = (deg * Math.PI) / 180;
// //               const cx = 80,
// //                 cy = 45,
// //                 len = 30;
// //               const isActive =
// //                 angleNow !== null && Math.abs(angleNow - deg) < 25;
// //               return (
// //                 <g key={deg}>
// //                   <line
// //                     x1={cx}
// //                     y1={cy}
// //                     x2={cx + Math.cos(rad) * len}
// //                     y2={cy + Math.sin(rad) * len}
// //                     stroke={isActive ? secColor : "#2a2a35"}
// //                     strokeWidth={isActive ? 2 : 1}
// //                   />
// //                   <text
// //                     x={cx + Math.cos(rad) * (len + 12)}
// //                     y={cy + Math.sin(rad) * (len + 12) + 3}
// //                     fill={isActive ? secColor : "#444"}
// //                     fontSize="8"
// //                     textAnchor="middle"
// //                     fontFamily="monospace"
// //                   >
// //                     {deg}°
// //                   </text>
// //                 </g>
// //               );
// //             })}
// //             <circle cx="80" cy="45" r="3" fill={secColor} />
// //             {angleNow !== null && (
// //               <line
// //                 x1="80"
// //                 y1="45"
// //                 x2={80 + Math.cos((angleNow * Math.PI) / 180) * 28}
// //                 y2={45 + Math.sin((angleNow * Math.PI) / 180) * 28}
// //                 stroke={secColor}
// //                 strokeWidth={2}
// //                 opacity={0.9}
// //               />
// //             )}
// //           </svg>
// //           <div
// //             style={{
// //               fontSize: 10,
// //               color: "#444",
// //               textAlign: "center",
// //               marginTop: 2,
// //             }}
// //           >
// //             {angleNow !== null ? `Current: ${angleNow}°` : "Drag any direction"}
// //           </div>
// //         </div>

// //         <div style={{ marginTop: "auto" }}>
// //           <button
// //             disabled={totalSeats === 0}
// //             style={{
// //               width: "100%",
// //               background: totalSeats > 0 ? "#f59e0b" : "#1e1e2a",
// //               color: totalSeats > 0 ? "#000" : "#444",
// //               border: "none",
// //               borderRadius: 10,
// //               padding: "12px",
// //               fontWeight: 700,
// //               fontSize: 13,
// //               cursor: totalSeats > 0 ? "pointer" : "not-allowed",
// //               transition: "all 0.2s",
// //             }}
// //           >
// //             Save Layout →
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // export default function App() {
// //   const [mode, setMode] = useState(0);
// //   return (
// //     <div
// //       style={{
// //         height: "100vh",
// //         display: "flex",
// //         flexDirection: "column",
// //         background: "#0d0d14",
// //         fontFamily: "'DM Sans', sans-serif",
// //         color: "#fff",
// //       }}
// //     >
// //       <link
// //         href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap"
// //         rel="stylesheet"
// //       />
// //       <div
// //         style={{
// //           background: "#13131c",
// //           borderBottom: "1px solid #1e1e2a",
// //           padding: "0 20px",
// //           display: "flex",
// //           alignItems: "center",
// //           height: 52,
// //           flexShrink: 0,
// //         }}
// //       >
// //         <div
// //           style={{
// //             display: "flex",
// //             alignItems: "center",
// //             gap: 8,
// //             marginRight: 28,
// //           }}
// //         >
// //           <div
// //             style={{
// //               width: 28,
// //               height: 28,
// //               borderRadius: 6,
// //               background: "linear-gradient(135deg,#f59e0b,#ef4444)",
// //               display: "flex",
// //               alignItems: "center",
// //               justifyContent: "center",
// //               fontSize: 14,
// //             }}
// //           >
// //             🎭
// //           </div>
// //           <span style={{ fontWeight: 700, fontSize: 15 }}>HallDesk</span>
// //         </div>
// //         {MODES.map((m, i) => (
// //           <button
// //             key={i}
// //             onClick={() => setMode(i)}
// //             style={{
// //               padding: "0 18px",
// //               height: "100%",
// //               background: "transparent",
// //               border: "none",
// //               borderBottom: `2px solid ${mode === i ? "#f59e0b" : "transparent"}`,
// //               color: mode === i ? "#fff" : "#666",
// //               cursor: "pointer",
// //               fontSize: 13,
// //               fontWeight: mode === i ? 600 : 400,
// //               transition: "all 0.2s",
// //             }}
// //           >
// //             {m}
// //           </button>
// //         ))}
// //         <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
// //           <div
// //             style={{
// //               fontSize: 12,
// //               background: "#1e1e2a",
// //               padding: "4px 12px",
// //               borderRadius: 20,
// //               color: "#888",
// //             }}
// //           >
// //             Grand Auditorium
// //           </div>
// //           <div
// //             style={{
// //               fontSize: 12,
// //               background: "#f59e0b22",
// //               border: "1px solid #f59e0b44",
// //               padding: "4px 12px",
// //               borderRadius: 20,
// //               color: "#f59e0b",
// //             }}
// //           >
// //             Sat, 15 Mar · 7:30 PM
// //           </div>
// //         </div>
// //       </div>
// //       <div style={{ flex: 1, overflow: "hidden" }}>
// //         {mode === 0 ? <BookingView sections={INIT_SECTIONS} /> : <DrawMode />}
// //       </div>
// //     </div>
// //   );
// // }

// // src/pages/TheaterSeatApp.jsx
// // ─────────────────────────────────────────────────────────────
// // Two modes:
// //  1. Book Seats  — loads hall from API, renders dynamic grid, lets user select & pay
// //  2. Admin Draw  — free-draw canvas, saves hall + seats to API via Redux
// // ─────────────────────────────────────────────────────────────
// import { useState, useRef, useEffect, useCallback } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useSnackbar } from "notistack";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Button,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   CircularProgress,
//   Alert,
//   Grid,
//   Box,
//   Typography,
//   Chip,
// } from "@mui/material";

// import {
//   fetchHallByIdThunk,
//   createHallThunk,
//   serialiseDrawLayout,
// } from "../features/halls/hallThunks";
// import {
//   selectCurrentHall,
//   selectHallLoading,
//   selectHallActionLoading,
// } from "../features/halls/hallSelectors";
// import {
//   toggleSeatSelected,
//   clearSelections,
// } from "../features/hallSeat/hallSeatSlice";
// import {
//   selectSelectedSeats,
//   selectSelectedTotal,
//   selectSeatsByRow,
// } from "../features/hallSeat/seatSelectors";

// // ─────────────────────────────────────────────────────────────
// // CONSTANTS
// // ─────────────────────────────────────────────────────────────
// const MODES = ["Book Seats", "Admin: Draw Mode"];

// const DRAW_SECTIONS = [
//   {
//     id: "premium",
//     label: "Premium",
//     color: "#f59e0b",
//     price: 800,
//     seat_type: "vip",
//   },
//   {
//     id: "executive",
//     label: "Executive",
//     color: "#818cf8",
//     price: 500,
//     seat_type: "standard",
//   },
//   {
//     id: "general",
//     label: "General",
//     color: "#34d399",
//     price: 250,
//     seat_type: "standard",
//   },
//   { id: "vip", label: "VIP", color: "#f472b6", price: 1200, seat_type: "vip" },
// ];

// const DRAW_TOOLS = [
//   { id: "row", icon: "▬", label: "Add Row" },
//   { id: "seat", icon: "◻", label: "Add Seat" },
//   { id: "erase", icon: "⌫", label: "Erase" },
// ];

// const SEAT_SHAPES = [
//   { id: "rounded", r: 4, label: "Rounded" },
//   { id: "square", r: 1, label: "Square" },
//   { id: "circle", r: 11, label: "Circle" },
// ];

// const HALL_TYPES = ["end_stage", "arena", "proscenium", "traverse", "custom"];

// // Seat size + gap on draw canvas
// const S = 22;
// const GAP = 5;

// // ─────────────────────────────────────────────────────────────
// // GEOMETRY
// // ─────────────────────────────────────────────────────────────
// function seatsAlongLine(x1, y1, x2, y2) {
//   const dx = x2 - x1,
//     dy = y2 - y1;
//   const dist = Math.sqrt(dx * dx + dy * dy);
//   const count = Math.max(1, Math.round(dist / (S + GAP)) + 1);
//   const ux = dist === 0 ? 1 : dx / dist;
//   const uy = dist === 0 ? 0 : dy / dist;
//   return Array.from({ length: count }, (_, i) => ({
//     x: x1 + ux * i * (S + GAP),
//     y: y1 + uy * i * (S + GAP),
//   }));
// }

// // Status → colours
// const seatBg = (seat) => {
//   if (seat.is_space) return "transparent";
//   if (seat.status === "sold") return "#1e1215";
//   if (seat.status === "selected") return seat.fill || "#f59e0b";
//   return (seat.fill || "#b2b2b2") + "22";
// };

// const seatBorder = (seat) => {
//   if (seat.is_space) return "transparent";
//   if (seat.status === "sold") return "#4a1a2244";
//   if (seat.status === "selected") return seat.fill || "#f59e0b";
//   return (seat.fill || "#b2b2b2") + "66";
// };

// // ─────────────────────────────────────────────────────────────
// // SAVE HALL DIALOG (used inside DrawMode)
// // ─────────────────────────────────────────────────────────────
// function SaveHallDialog({ open, onClose, onSave, saving }) {
//   const [form, setForm] = useState({
//     name: "",
//     description: "",
//     hall_type: "end_stage",
//     city: "",
//     address: "",
//   });
//   const [err, setErr] = useState("");

//   const handleSubmit = () => {
//     if (!form.name.trim()) {
//       setErr("Hall name is required");
//       return;
//     }
//     if (!form.city.trim()) {
//       setErr("City is required");
//       return;
//     }
//     if (!form.address.trim()) {
//       setErr("Address is required");
//       return;
//     }
//     setErr("");
//     onSave(form);
//   };

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       maxWidth="sm"
//       fullWidth
//       PaperProps={{
//         sx: { background: "#1E293B", border: "1px solid #334155" },
//       }}
//     >
//       <DialogTitle sx={{ color: "#F8FAFC", fontWeight: 700, fontSize: 16 }}>
//         Save Hall Layout
//       </DialogTitle>
//       <DialogContent>
//         <Grid container spacing={2} sx={{ pt: 1 }}>
//           {err && (
//             <Grid item xs={12}>
//               <Alert
//                 severity="error"
//                 sx={{ background: "#2d1515", color: "#fca5a5", fontSize: 12 }}
//               >
//                 {err}
//               </Alert>
//             </Grid>
//           )}
//           <Grid item xs={12}>
//             <TextField
//               label="Hall Name"
//               size="small"
//               fullWidth
//               value={form.name}
//               onChange={(e) => setForm({ ...form, name: e.target.value })}
//               sx={{
//                 "& .MuiOutlinedInput-root fieldset": { borderColor: "#334155" },
//               }}
//             />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <FormControl size="small" fullWidth>
//               <InputLabel sx={{ color: "#64748B" }}>Hall Type</InputLabel>
//               <Select
//                 label="Hall Type"
//                 value={form.hall_type}
//                 onChange={(e) =>
//                   setForm({ ...form, hall_type: e.target.value })
//                 }
//                 sx={{
//                   "& fieldset": { borderColor: "#334155" },
//                   color: "#F8FAFC",
//                 }}
//               >
//                 {HALL_TYPES.map((t) => (
//                   <MenuItem key={t} value={t}>
//                     {t.replace("_", " ")}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <TextField
//               label="City"
//               size="small"
//               fullWidth
//               value={form.city}
//               onChange={(e) => setForm({ ...form, city: e.target.value })}
//               sx={{
//                 "& .MuiOutlinedInput-root fieldset": { borderColor: "#334155" },
//               }}
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               label="Address"
//               size="small"
//               fullWidth
//               multiline
//               rows={2}
//               value={form.address}
//               onChange={(e) => setForm({ ...form, address: e.target.value })}
//               sx={{
//                 "& .MuiOutlinedInput-root fieldset": { borderColor: "#334155" },
//               }}
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               label="Description (optional)"
//               size="small"
//               fullWidth
//               multiline
//               rows={2}
//               value={form.description}
//               onChange={(e) =>
//                 setForm({ ...form, description: e.target.value })
//               }
//               sx={{
//                 "& .MuiOutlinedInput-root fieldset": { borderColor: "#334155" },
//               }}
//             />
//           </Grid>
//         </Grid>
//       </DialogContent>
//       <DialogActions sx={{ p: "16px 24px", gap: 1 }}>
//         <Button onClick={onClose} sx={{ color: "#64748B" }}>
//           Cancel
//         </Button>
//         <Button
//           variant="contained"
//           onClick={handleSubmit}
//           disabled={saving}
//           sx={{
//             background: "linear-gradient(135deg,#2563EB,#1D4ED8)",
//             "&:hover": { background: "#1D4ED8" },
//           }}
//         >
//           {saving ? (
//             <CircularProgress size={18} sx={{ color: "#fff" }} />
//           ) : (
//             "Save Hall →"
//           )}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }

// // ─────────────────────────────────────────────────────────────
// // BOOKING VIEW — loads from API via Redux
// // ─────────────────────────────────────────────────────────────
// function BookingView({ hallId }) {
//   const dispatch = useDispatch();
//   const hall = useSelector(selectCurrentHall);
//   console.log("hall====>>>>", hall);
//   const loading = useSelector(selectHallLoading);
//   const selectedSeats = useSelector(selectSelectedSeats);
//   const total = useSelector(selectSelectedTotal);

//   const [zoom, setZoom] = useState(1);
//   const [tooltip, setTooltip] = useState(null);
//   // Local seat state (copy from API data for interactive selection)
//   const [localSeats, setLocalSeats] = useState([]);

//   // Load hall when hallId changes
//   useEffect(() => {
//     // if (hallId) {
//     dispatch(fetchHallByIdThunk({ id: 3 }));
//     // }
//   }, []);

//   // Sync local seats when API data arrives
//   useEffect(() => {
//     if (hall?.seats) {
//       setLocalSeats(hall.seats.map((s) => ({ ...s })));
//     }
//   }, [hall]);

//   const toggleSeat = useCallback((seatId) => {
//     setLocalSeats((prev) =>
//       prev.map((s) => {
//         if (s.id !== seatId || s.is_space || s.status === "sold") return s;
//         return {
//           ...s,
//           status: s.status === "selected" ? "available" : "selected",
//         };
//       }),
//     );
//   }, []);

//   const selectedLocal = localSeats.filter((s) => s.status === "selected");
//   const localTotal = selectedLocal.reduce(
//     (a, s) => a + Number(s.price || 0),
//     0,
//   );

//   // Group by row_label for rendering
//   const rowMap = {};
//   localSeats
//     .slice()
//     .sort(
//       (a, b) =>
//         a.row_label.localeCompare(b.row_label) || a.col_index - b.col_index,
//     )
//     .forEach((seat) => {
//       const key = seat.row_label || "__AISLE__";
//       if (!rowMap[key]) rowMap[key] = [];
//       rowMap[key].push(seat);
//     });

//   // Unique sections (for summary cards)
//   const sectionSummary = {};
//   localSeats
//     .filter((s) => !s.is_space)
//     .forEach((s) => {
//       const k = s.section_label || "General";
//       if (!sectionSummary[k])
//         sectionSummary[k] = { label: k, color: s.fill, avail: 0, total: 0 };
//       sectionSummary[k].total++;
//       if (s.status === "available") sectionSummary[k].avail++;
//     });

//   if (loading) {
//     return (
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           height: "100%",
//           background: "#0d0d14",
//         }}
//       >
//         <CircularProgress sx={{ color: "#2563EB" }} />
//         <span style={{ color: "#64748B", marginLeft: 12, fontSize: 14 }}>
//           Loading hall layout…
//         </span>
//       </div>
//     );
//   }

//   if (!hall && !loading) {
//     return (
//       <div
//         style={{
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           justifyContent: "center",
//           height: "100%",
//           background: "#0d0d14",
//           color: "#475569",
//           gap: 12,
//         }}
//       >
//         <div style={{ fontSize: 48 }}>🎭</div>
//         <div style={{ fontSize: 14 }}>
//           No hall selected. Select a hall to view the seat map.
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       style={{
//         display: "grid",
//         gridTemplateColumns: "1fr 300px",
//         height: "100%",
//       }}
//     >
//       {/* ── Hall map ───────────────────────────────────────── */}
//       <div
//         style={{
//           background: "#0d0d14",
//           overflowY: "auto",
//           padding: "24px 20px",
//         }}
//       >
//         {/* Zoom controls */}
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "flex-end",
//             gap: 6,
//             marginBottom: 16,
//           }}
//         >
//           {[0.75, 1, 1.25, 1.5].map((z) => (
//             <button
//               key={z}
//               onClick={() => setZoom(z)}
//               style={{
//                 padding: "4px 10px",
//                 background: zoom === z ? "#2563EB" : "#1e1e2a",
//                 color: zoom === z ? "#fff" : "#888",
//                 border: "none",
//                 borderRadius: 6,
//                 fontSize: 12,
//                 cursor: "pointer",
//                 fontWeight: zoom === z ? 700 : 400,
//               }}
//             >
//               {Math.round(z * 100)}%
//             </button>
//           ))}
//         </div>

//         <div
//           style={{
//             transform: `scale(${zoom})`,
//             transformOrigin: "top center",
//             transition: "transform 0.2s",
//           }}
//         >
//           {/* Screen */}
//           <div style={{ textAlign: "center", marginBottom: 36 }}>
//             <div
//               style={{
//                 width: 340,
//                 height: 6,
//                 background:
//                   "linear-gradient(90deg,transparent,#fff8,transparent)",
//                 borderRadius: 50,
//                 margin: "0 auto 8px",
//               }}
//             />
//             <div
//               style={{
//                 fontSize: 11,
//                 color: "#555",
//                 letterSpacing: 4,
//                 fontWeight: 600,
//               }}
//             >
//               SCREEN / STAGE
//             </div>
//           </div>

//           {/* Rows */}
//           {Object.entries(rowMap).map(([rowLabel, seats]) => (
//             <div
//               key={rowLabel}
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 gap: 5,
//                 marginBottom: 7,
//               }}
//             >
//               {/* Row label */}
//               <span
//                 style={{
//                   fontSize: 10,
//                   color: "#444",
//                   width: 18,
//                   textAlign: "right",
//                   fontFamily: "monospace",
//                   fontWeight: 600,
//                 }}
//               >
//                 {rowLabel !== "__AISLE__" ? rowLabel : ""}
//               </span>

//               <div style={{ display: "flex", gap: 4 }}>
//                 {seats.map((seat) => (
//                   <div
//                     key={seat.id}
//                     onMouseEnter={(e) =>
//                       !seat.is_space &&
//                       setTooltip({ seat, x: e.clientX, y: e.clientY })
//                     }
//                     onMouseLeave={() => setTooltip(null)}
//                     onClick={() =>
//                       !seat.is_space &&
//                       seat.status !== "sold" &&
//                       toggleSeat(seat.id)
//                     }
//                     title={
//                       seat.is_space
//                         ? ""
//                         : `${seat.section_label || ""} · ${seat.seat_name} · ₹${seat.price}`
//                     }
//                     style={{
//                       width: seat.is_space ? 14 : 26,
//                       height: 26,
//                       borderRadius: seat.status === "selected" ? "50%" : "6px",
//                       background: seatBg(seat),
//                       border: `1.5px solid ${seatBorder(seat)}`,
//                       cursor: seat.is_space
//                         ? "default"
//                         : seat.status === "sold"
//                           ? "not-allowed"
//                           : "pointer",
//                       transition: "all 0.15s",
//                       transform:
//                         seat.status === "selected" ? "scale(1.12)" : "scale(1)",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       fontSize: 8,
//                       color:
//                         seat.status === "selected" ? "#000" : "transparent",
//                       fontWeight: 700,
//                       flexShrink: 0,
//                     }}
//                   >
//                     {seat.status === "selected" ? "✓" : ""}
//                   </div>
//                 ))}
//               </div>

//               <span
//                 style={{
//                   fontSize: 10,
//                   color: "#444",
//                   width: 18,
//                   fontFamily: "monospace",
//                   fontWeight: 600,
//                 }}
//               >
//                 {rowLabel !== "__AISLE__" ? rowLabel : ""}
//               </span>
//             </div>
//           ))}

//           {/* Legend */}
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "center",
//               gap: 20,
//               marginTop: 28,
//               paddingTop: 20,
//               borderTop: "1px solid #1e1e2a",
//             }}
//           >
//             {[
//               { label: "Available", bg: "#1e1e2a", border: "#444" },
//               { label: "Selected", bg: "#2563EB", border: "#2563EB" },
//               { label: "Sold", bg: "#1e1215", border: "#4a1a2244" },
//             ].map((l) => (
//               <div
//                 key={l.label}
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 7,
//                   fontSize: 12,
//                   color: "#888",
//                 }}
//               >
//                 <div
//                   style={{
//                     width: 14,
//                     height: 14,
//                     background: l.bg,
//                     border: `1.5px solid ${l.border}`,
//                     borderRadius: 4,
//                   }}
//                 />
//                 {l.label}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* ── Booking panel ──────────────────────────────────── */}
//       <div
//         style={{
//           background: "#13131c",
//           borderLeft: "1px solid #1e1e2a",
//           display: "flex",
//           flexDirection: "column",
//         }}
//       >
//         {/* Hall info */}
//         <div
//           style={{ padding: "20px 18px", borderBottom: "1px solid #1e1e2a" }}
//         >
//           <div
//             style={{
//               fontSize: 15,
//               fontWeight: 700,
//               marginBottom: 2,
//               color: "#F8FAFC",
//             }}
//           >
//             {hall?.name || "Hall"}
//           </div>
//           <div style={{ fontSize: 12, color: "#64748B", marginBottom: 12 }}>
//             {hall?.city} · {hall?.hall_type?.replace("_", " ")}
//           </div>

//           {/* Section summary cards */}
//           <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
//             {Object.values(sectionSummary).map((sec) => (
//               <div
//                 key={sec.label}
//                 style={{
//                   flex: "1 1 60px",
//                   minWidth: 60,
//                   background: sec.color + "15",
//                   borderRadius: 8,
//                   padding: "7px 6px",
//                   textAlign: "center",
//                   border: `1px solid ${sec.color}30`,
//                 }}
//               >
//                 <div
//                   style={{ fontSize: 15, fontWeight: 700, color: sec.color }}
//                 >
//                   {sec.avail}
//                 </div>
//                 <div
//                   style={{
//                     fontSize: 9,
//                     color: "#64748B",
//                     marginTop: 1,
//                     whiteSpace: "nowrap",
//                     overflow: "hidden",
//                     textOverflow: "ellipsis",
//                   }}
//                 >
//                   {sec.label}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Selected seat list */}
//         <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px" }}>
//           <div
//             style={{
//               fontSize: 11,
//               color: "#64748B",
//               fontWeight: 600,
//               marginBottom: 10,
//               letterSpacing: 1,
//             }}
//           >
//             SELECTED SEATS
//           </div>
//           {selectedLocal.length === 0 ? (
//             <div
//               style={{
//                 textAlign: "center",
//                 padding: "32px 0",
//                 color: "#374151",
//                 fontSize: 13,
//               }}
//             >
//               <div style={{ fontSize: 32, marginBottom: 8 }}>🎭</div>
//               Click seats to select
//             </div>
//           ) : (
//             selectedLocal.map((seat) => (
//               <div
//                 key={seat.id}
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "space-between",
//                   background: "#0F172A",
//                   borderRadius: 8,
//                   padding: "10px 12px",
//                   marginBottom: 6,
//                   border: `1px solid ${seat.fill || "#2563EB"}33`,
//                 }}
//               >
//                 <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//                   <div
//                     style={{
//                       width: 10,
//                       height: 10,
//                       borderRadius: "50%",
//                       background: seat.fill || "#2563EB",
//                       flexShrink: 0,
//                     }}
//                   />
//                   <div>
//                     <div
//                       style={{
//                         fontSize: 12,
//                         fontWeight: 600,
//                         color: "#F8FAFC",
//                       }}
//                     >
//                       {seat.seat_name}
//                     </div>
//                     <div style={{ fontSize: 10, color: "#64748B" }}>
//                       {seat.section_label}
//                     </div>
//                   </div>
//                 </div>
//                 <span
//                   style={{
//                     fontSize: 13,
//                     color: seat.fill || "#2563EB",
//                     fontWeight: 700,
//                   }}
//                 >
//                   ₹{Number(seat.price).toLocaleString("en-IN")}
//                 </span>
//               </div>
//             ))
//           )}
//         </div>

//         {/* Summary + Pay */}
//         <div style={{ padding: "16px 18px", borderTop: "1px solid #1e1e2a" }}>
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               fontSize: 13,
//               marginBottom: 4,
//             }}
//           >
//             <span style={{ color: "#64748B" }}>
//               Subtotal ({selectedLocal.length} seats)
//             </span>
//             <span style={{ fontWeight: 600, color: "#F8FAFC" }}>
//               ₹{localTotal.toLocaleString("en-IN")}
//             </span>
//           </div>
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               fontSize: 12,
//               marginBottom: 14,
//             }}
//           >
//             <span style={{ color: "#475569" }}>Convenience fee (5%)</span>
//             <span style={{ color: "#475569" }}>
//               ₹{Math.round(localTotal * 0.05).toLocaleString("en-IN")}
//             </span>
//           </div>
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               fontSize: 16,
//               fontWeight: 700,
//               marginBottom: 16,
//               paddingTop: 10,
//               borderTop: "1px solid #1e1e2a",
//             }}
//           >
//             <span style={{ color: "#F8FAFC" }}>Total</span>
//             <span style={{ color: "#2563EB" }}>
//               ₹
//               {(localTotal + Math.round(localTotal * 0.05)).toLocaleString(
//                 "en-IN",
//               )}
//             </span>
//           </div>
//           <button
//             disabled={selectedLocal.length === 0}
//             style={{
//               width: "100%",
//               background:
//                 selectedLocal.length > 0
//                   ? "linear-gradient(135deg,#2563EB,#1D4ED8)"
//                   : "#1e1e2a",
//               color: selectedLocal.length > 0 ? "#fff" : "#444",
//               border: "none",
//               borderRadius: 10,
//               padding: "13px",
//               fontWeight: 700,
//               fontSize: 14,
//               cursor: selectedLocal.length > 0 ? "pointer" : "not-allowed",
//               transition: "all 0.2s",
//               boxShadow:
//                 selectedLocal.length > 0
//                   ? "0 4px 16px rgba(37,99,235,0.4)"
//                   : "none",
//             }}
//           >
//             {selectedLocal.length > 0 ? `Proceed to Pay  →` : "Select Seats"}
//           </button>
//         </div>
//       </div>

//       {/* Tooltip */}
//       {tooltip && !tooltip.seat.is_space && (
//         <div
//           style={{
//             position: "fixed",
//             left: tooltip.x + 12,
//             top: tooltip.y - 70,
//             background: "#0F172A",
//             border: "1px solid #334155",
//             borderRadius: 10,
//             padding: "10px 14px",
//             fontSize: 12,
//             pointerEvents: "none",
//             zIndex: 9999,
//             boxShadow: "0 8px 24px #000a",
//           }}
//         >
//           <div style={{ fontWeight: 600, color: "#F8FAFC", marginBottom: 3 }}>
//             {tooltip.seat.section_label} · {tooltip.seat.seat_name}
//           </div>
//           <div
//             style={{
//               color: tooltip.seat.status === "sold" ? "#ef4444" : "#2563EB",
//               fontWeight: 700,
//             }}
//           >
//             {tooltip.seat.status === "sold"
//               ? "Already Sold"
//               : `₹${Number(tooltip.seat.price).toLocaleString("en-IN")}`}
//           </div>
//           <div
//             style={{
//               color: "#475569",
//               fontSize: 11,
//               marginTop: 2,
//               textTransform: "capitalize",
//             }}
//           >
//             {tooltip.seat.seat_type}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // ─────────────────────────────────────────────────────────────
// // DRAW MODE — free canvas, saves to API
// // ─────────────────────────────────────────────────────────────
// function DrawMode() {
//   const dispatch = useDispatch();
//   const { enqueueSnackbar } = useSnackbar();
//   const saving = useSelector(selectHallActionLoading);

//   const svgRef = useRef(null);

//   const [tool, setTool] = useState("row");
//   const [activeSec, setActiveSec] = useState("premium");
//   const [seatShape, setSeatShape] = useState("rounded");
//   const [drawing, setDrawing] = useState(false);
//   const [startPos, setStartPos] = useState(null);
//   const [liveEnd, setLiveEnd] = useState(null);
//   const [hoverPos, setHoverPos] = useState(null);
//   const [placedRows, setPlacedRows] = useState([]);
//   const [placedSeats, setPlacedSeats] = useState([]);
//   const [saveOpen, setSaveOpen] = useState(false);

//   const getSec = () => DRAW_SECTIONS.find((s) => s.id === activeSec);
//   const getShape = () => SEAT_SHAPES.find((s) => s.id === seatShape);

//   const svgPoint = (e) => {
//     const rect = svgRef.current?.getBoundingClientRect();
//     if (!rect) return { x: 0, y: 0 };
//     return { x: e.clientX - rect.left, y: e.clientY - rect.top };
//   };

//   const handleMouseDown = (e) => {
//     if (e.button !== 0) return;
//     const pos = svgPoint(e);
//     setDrawing(true);
//     setStartPos(pos);
//     setLiveEnd(pos);
//   };

//   const handleMouseMove = (e) => {
//     const pos = svgPoint(e);
//     setHoverPos(pos);
//     if (drawing) setLiveEnd(pos);
//   };

//   const handleMouseUp = (e) => {
//     if (!drawing || !startPos) return;
//     const pos = svgPoint(e);
//     const sec = getSec();

//     if (tool === "row") {
//       const pts = seatsAlongLine(startPos.x, startPos.y, pos.x, pos.y);
//       if (pts.length > 0) {
//         const angle = Math.round(
//           (Math.atan2(pos.y - startPos.y, pos.x - startPos.x) * 180) / Math.PI,
//         );
//         setPlacedRows((prev) => [
//           ...prev,
//           {
//             id: `r${Date.now()}`,
//             pts,
//             color: sec.color,
//             sectionId: activeSec,
//             shape: seatShape,
//             startX: startPos.x,
//             startY: startPos.y,
//             endX: pos.x,
//             endY: pos.y,
//             angle,
//           },
//         ]);
//       }
//     } else if (tool === "seat") {
//       setPlacedSeats((prev) => [
//         ...prev,
//         {
//           id: `s${Date.now()}`,
//           x: pos.x,
//           y: pos.y,
//           color: sec.color,
//           sectionId: activeSec,
//           shape: seatShape,
//         },
//       ]);
//     } else if (tool === "erase") {
//       const R = 20;
//       setPlacedRows((prev) =>
//         prev.filter(
//           (row) =>
//             !row.pts.some((p) => Math.hypot(p.x - pos.x, p.y - pos.y) < R),
//         ),
//       );
//       setPlacedSeats((prev) =>
//         prev.filter((s) => Math.hypot(s.x - pos.x, s.y - pos.y) >= R),
//       );
//     }

//     setDrawing(false);
//     setStartPos(null);
//     setLiveEnd(null);
//   };

//   // ── Save to API ────────────────────────────────────────────
//   const handleSave = async (hallMeta) => {
//     const svgEl = svgRef.current;
//     const canvasWidth = svgEl?.clientWidth || 800;
//     const canvasHeight = svgEl?.clientHeight || 600;

//     const layout = serialiseDrawLayout({
//       placedRows,
//       placedSeats,
//       sections: DRAW_SECTIONS,
//       canvasWidth,
//       canvasHeight,
//     });

//     if (!layout.seats.length) {
//       enqueueSnackbar("Draw at least one row of seats first", {
//         variant: "warning",
//       });
//       return;
//     }

//     const result = await dispatch(createHallThunk({ ...hallMeta, ...layout }));

//     if (createHallThunk.fulfilled.match(result)) {
//       const count = layout.seats.filter((s) => !s.is_space).length;
//       enqueueSnackbar(`✅ Hall "${hallMeta.name}" saved with ${count} seats!`, {
//         variant: "success",
//       });
//       setSaveOpen(false);
//       setPlacedRows([]);
//       setPlacedSeats([]);
//     } else {
//       enqueueSnackbar(result.payload || "Failed to save hall", {
//         variant: "error",
//       });
//     }
//   };

//   // Derived
//   const previewPts =
//     drawing && startPos && liveEnd && tool === "row"
//       ? seatsAlongLine(startPos.x, startPos.y, liveEnd.x, liveEnd.y)
//       : [];

//   const angleNow =
//     drawing && startPos && liveEnd
//       ? Math.round(
//           (Math.atan2(liveEnd.y - startPos.y, liveEnd.x - startPos.x) * 180) /
//             Math.PI,
//         )
//       : null;

//   const shapeR = getShape().r;
//   const secColor = getSec().color;
//   const totalSeats =
//     placedRows.reduce((a, r) => a + r.pts.length, 0) + placedSeats.length;

//   const sectionCounts = DRAW_SECTIONS.map((s) => ({
//     ...s,
//     count:
//       placedRows
//         .filter((r) => r.sectionId === s.id)
//         .reduce((a, r) => a + r.pts.length, 0) +
//       placedSeats.filter((p) => p.sectionId === s.id).length,
//   }));

//   return (
//     <>
//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "220px 1fr 200px",
//           height: "100%",
//         }}
//       >
//         {/* ── LEFT TOOLBAR ───────────────────────────────────── */}
//         <div
//           style={{
//             background: "#13131c",
//             borderRight: "1px solid #1e1e2a",
//             display: "flex",
//             flexDirection: "column",
//             overflowY: "auto",
//           }}
//         >
//           {/* Section picker — most prominent */}
//           <div
//             style={{
//               padding: "14px 14px 12px",
//               borderBottom: "1px solid #1e1e2a",
//             }}
//           >
//             <div
//               style={{
//                 fontSize: 10,
//                 color: "#555",
//                 letterSpacing: 1,
//                 marginBottom: 10,
//                 fontWeight: 600,
//               }}
//             >
//               DRAWING SECTION
//             </div>
//             {DRAW_SECTIONS.map((s) => {
//               const active = activeSec === s.id;
//               const cnt = sectionCounts.find((x) => x.id === s.id)?.count || 0;
//               return (
//                 <button
//                   key={s.id}
//                   onClick={() => setActiveSec(s.id)}
//                   style={{
//                     width: "100%",
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 10,
//                     padding: "10px 12px",
//                     marginBottom: 6,
//                     background: active ? s.color + "18" : "#0d0d14",
//                     border: `1.5px solid ${active ? s.color : "#1e1e2a"}`,
//                     borderRadius: 10,
//                     cursor: "pointer",
//                     transition: "all 0.15s",
//                   }}
//                 >
//                   <div
//                     style={{
//                       width: 12,
//                       height: 12,
//                       borderRadius: "50%",
//                       background: s.color,
//                       boxShadow: active ? `0 0 8px ${s.color}99` : "none",
//                       flexShrink: 0,
//                     }}
//                   />
//                   <div style={{ flex: 1, textAlign: "left" }}>
//                     <div
//                       style={{
//                         fontSize: 12,
//                         fontWeight: active ? 700 : 400,
//                         color: active ? s.color : "#888",
//                       }}
//                     >
//                       {s.label}
//                     </div>
//                     <div
//                       style={{
//                         fontSize: 10,
//                         color: active ? s.color + "bb" : "#444",
//                       }}
//                     >
//                       ₹{s.price} · {cnt} seats
//                     </div>
//                   </div>
//                   {active && (
//                     <div
//                       style={{
//                         width: 6,
//                         height: 6,
//                         borderRadius: "50%",
//                         background: s.color,
//                       }}
//                     />
//                   )}
//                 </button>
//               );
//             })}
//           </div>

//           {/* Tools */}
//           <div
//             style={{ padding: "12px 14px", borderBottom: "1px solid #1e1e2a" }}
//           >
//             <div
//               style={{
//                 fontSize: 10,
//                 color: "#555",
//                 letterSpacing: 1,
//                 marginBottom: 8,
//                 fontWeight: 600,
//               }}
//             >
//               TOOLS
//             </div>
//             {DRAW_TOOLS.map((t) => (
//               <button
//                 key={t.id}
//                 onClick={() => setTool(t.id)}
//                 style={{
//                   width: "100%",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 10,
//                   padding: "9px 12px",
//                   marginBottom: 4,
//                   background: tool === t.id ? "#1e1e2e" : "transparent",
//                   border: `1px solid ${tool === t.id ? "#2563EB" : "transparent"}`,
//                   borderRadius: 8,
//                   color: tool === t.id ? "#fff" : "#666",
//                   cursor: "pointer",
//                   fontSize: 13,
//                   fontWeight: tool === t.id ? 600 : 400,
//                   transition: "all 0.15s",
//                 }}
//               >
//                 <span style={{ fontSize: 15 }}>{t.icon}</span> {t.label}
//               </button>
//             ))}
//           </div>

//           {/* Seat shape */}
//           <div style={{ padding: "12px 14px" }}>
//             <div
//               style={{
//                 fontSize: 10,
//                 color: "#555",
//                 letterSpacing: 1,
//                 marginBottom: 8,
//                 fontWeight: 600,
//               }}
//             >
//               SEAT SHAPE
//             </div>
//             {SEAT_SHAPES.map((s) => (
//               <button
//                 key={s.id}
//                 onClick={() => setSeatShape(s.id)}
//                 style={{
//                   width: "100%",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 8,
//                   padding: "8px 10px",
//                   marginBottom: 4,
//                   background: seatShape === s.id ? "#1e1e2e" : "transparent",
//                   border: `1px solid ${seatShape === s.id ? "#2563EB" : "transparent"}`,
//                   borderRadius: 8,
//                   color: seatShape === s.id ? "#fff" : "#666",
//                   cursor: "pointer",
//                   fontSize: 12,
//                   transition: "all 0.15s",
//                 }}
//               >
//                 <div
//                   style={{
//                     width: 14,
//                     height: 14,
//                     background: seatShape === s.id ? "#2563EB" : "#333",
//                     borderRadius: s.r >= 10 ? "50%" : s.r + "px",
//                     flexShrink: 0,
//                   }}
//                 />
//                 {s.label}
//               </button>
//             ))}
//           </div>

//           <div style={{ padding: "0 14px 14px", marginTop: "auto" }}>
//             <button
//               onClick={() => {
//                 setPlacedRows([]);
//                 setPlacedSeats([]);
//               }}
//               style={{
//                 width: "100%",
//                 padding: "8px",
//                 background: "transparent",
//                 border: "1px solid #ef444433",
//                 borderRadius: 8,
//                 color: "#ef4444",
//                 cursor: "pointer",
//                 fontSize: 12,
//               }}
//             >
//               Clear All
//             </button>
//           </div>
//         </div>

//         {/* ── SVG CANVAS ─────────────────────────────────────── */}
//         <div
//           style={{
//             background: "#0d0d14",
//             overflow: "hidden",
//             position: "relative",
//             display: "flex",
//             flexDirection: "column",
//           }}
//         >
//           {/* Hint bar */}
//           <div
//             style={{
//               padding: "8px 16px",
//               borderBottom: "1px solid #1a1a24",
//               display: "flex",
//               alignItems: "center",
//               gap: 10,
//               flexShrink: 0,
//               minHeight: 38,
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 6,
//                 background: secColor + "15",
//                 border: `1px solid ${secColor}33`,
//                 padding: "3px 10px",
//                 borderRadius: 20,
//               }}
//             >
//               <div
//                 style={{
//                   width: 8,
//                   height: 8,
//                   borderRadius: "50%",
//                   background: secColor,
//                 }}
//               />
//               <span style={{ fontSize: 11, color: secColor, fontWeight: 600 }}>
//                 {getSec().label}
//               </span>
//             </div>
//             <span style={{ fontSize: 12, color: "#555" }}>
//               {tool === "row" && "Drag to draw a row of seats at any angle"}
//               {tool === "seat" && "Click to place a single seat"}
//               {tool === "erase" && "Click to erase seats / rows"}
//             </span>
//             {angleNow !== null && (
//               <span
//                 style={{
//                   marginLeft: "auto",
//                   fontSize: 12,
//                   color: secColor,
//                   fontWeight: 600,
//                   background: secColor + "15",
//                   padding: "2px 10px",
//                   borderRadius: 12,
//                 }}
//               >
//                 {previewPts.length} seats · {angleNow}°
//               </span>
//             )}
//           </div>

//           <svg
//             ref={svgRef}
//             style={{
//               flex: 1,
//               width: "100%",
//               display: "block",
//               cursor: "crosshair",
//               userSelect: "none",
//             }}
//             onMouseDown={handleMouseDown}
//             onMouseMove={handleMouseMove}
//             onMouseUp={handleMouseUp}
//             onMouseLeave={() => {
//               setHoverPos(null);
//               if (drawing) {
//                 setDrawing(false);
//                 setStartPos(null);
//                 setLiveEnd(null);
//               }
//             }}
//           >
//             <defs>
//               <pattern
//                 id="dotgrid"
//                 width="27"
//                 height="27"
//                 patternUnits="userSpaceOnUse"
//               >
//                 <circle cx="1" cy="1" r="1" fill="#1e1e2a" />
//               </pattern>
//             </defs>
//             <rect width="100%" height="100%" fill="url(#dotgrid)" />

//             {/* Stage */}
//             <rect
//               x="50%"
//               y="18"
//               width="180"
//               height="28"
//               rx="6"
//               fill="#1a1a24"
//               stroke="#2a2a35"
//               strokeWidth="1"
//               transform="translate(-90,0)"
//             />
//             <text
//               x="50%"
//               y="36"
//               textAnchor="middle"
//               fill="#444"
//               fontSize="11"
//               letterSpacing="3"
//               fontFamily="DM Sans,sans-serif"
//               fontWeight="500"
//             >
//               STAGE
//             </text>

//             {/* Placed rows */}
//             {placedRows.map((row) => {
//               const r2 = SEAT_SHAPES.find((s) => s.id === row.shape)?.r ?? 4;
//               return row.pts.map((pt, i) => (
//                 <rect
//                   key={`${row.id}-${i}`}
//                   x={pt.x - S / 2}
//                   y={pt.y - S / 2}
//                   width={S}
//                   height={S}
//                   rx={r2}
//                   ry={r2}
//                   fill={row.color + "30"}
//                   stroke={row.color + "99"}
//                   strokeWidth={1.5}
//                 />
//               ));
//             })}

//             {/* Individual seats */}
//             {placedSeats.map((seat) => {
//               const r2 = SEAT_SHAPES.find((s) => s.id === seat.shape)?.r ?? 4;
//               return (
//                 <rect
//                   key={seat.id}
//                   x={seat.x - S / 2}
//                   y={seat.y - S / 2}
//                   width={S}
//                   height={S}
//                   rx={r2}
//                   ry={r2}
//                   fill={seat.color + "30"}
//                   stroke={seat.color + "99"}
//                   strokeWidth={1.5}
//                 />
//               );
//             })}

//             {/* Guide line */}
//             {drawing && startPos && liveEnd && tool === "row" && (
//               <line
//                 x1={startPos.x}
//                 y1={startPos.y}
//                 x2={liveEnd.x}
//                 y2={liveEnd.y}
//                 stroke={secColor + "50"}
//                 strokeWidth={1}
//                 strokeDasharray="4 3"
//               />
//             )}

//             {/* Preview */}
//             {previewPts.map((pt, i) => (
//               <rect
//                 key={`prev-${i}`}
//                 x={pt.x - S / 2}
//                 y={pt.y - S / 2}
//                 width={S}
//                 height={S}
//                 rx={shapeR}
//                 ry={shapeR}
//                 fill={secColor + "30"}
//                 stroke={secColor}
//                 strokeWidth={1.5}
//                 strokeDasharray="3 2"
//                 opacity={0.8}
//               />
//             ))}

//             {drawing && startPos && (
//               <circle
//                 cx={startPos.x}
//                 cy={startPos.y}
//                 r={5}
//                 fill={secColor}
//                 opacity={0.9}
//               />
//             )}

//             {!drawing && hoverPos && tool === "seat" && (
//               <rect
//                 x={hoverPos.x - S / 2}
//                 y={hoverPos.y - S / 2}
//                 width={S}
//                 height={S}
//                 rx={shapeR}
//                 ry={shapeR}
//                 fill={secColor + "30"}
//                 stroke={secColor}
//                 strokeWidth={1.5}
//                 strokeDasharray="3 2"
//                 opacity={0.6}
//                 style={{ pointerEvents: "none" }}
//               />
//             )}

//             {tool === "erase" && hoverPos && (
//               <circle
//                 cx={hoverPos.x}
//                 cy={hoverPos.y}
//                 r={20}
//                 fill="none"
//                 stroke="#ef444877"
//                 strokeWidth={1.5}
//                 strokeDasharray="4 3"
//                 style={{ pointerEvents: "none" }}
//               />
//             )}
//           </svg>
//         </div>

//         {/* ── RIGHT SUMMARY ──────────────────────────────────── */}
//         <div
//           style={{
//             background: "#13131c",
//             borderLeft: "1px solid #1e1e2a",
//             padding: 16,
//             display: "flex",
//             flexDirection: "column",
//             gap: 14,
//             overflowY: "auto",
//           }}
//         >
//           <div>
//             <div
//               style={{
//                 fontSize: 10,
//                 color: "#555",
//                 letterSpacing: 1,
//                 marginBottom: 10,
//                 fontWeight: 600,
//               }}
//             >
//               LAYOUT SUMMARY
//             </div>
//             <div
//               style={{ background: "#0d0d14", borderRadius: 10, padding: 14 }}
//             >
//               {[
//                 { label: "Total seats", value: totalSeats, color: "#2563EB" },
//                 {
//                   label: "Rows drawn",
//                   value: placedRows.length,
//                   color: "#F8FAFC",
//                 },
//                 {
//                   label: "Individual",
//                   value: placedSeats.length,
//                   color: "#F8FAFC",
//                 },
//               ].map((row) => (
//                 <div
//                   key={row.label}
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     fontSize: 13,
//                     marginBottom: 8,
//                   }}
//                 >
//                   <span style={{ color: "#64748B" }}>{row.label}</span>
//                   <span style={{ fontWeight: 700, color: row.color }}>
//                     {row.value}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div>
//             <div
//               style={{
//                 fontSize: 10,
//                 color: "#555",
//                 letterSpacing: 1,
//                 marginBottom: 8,
//                 fontWeight: 600,
//               }}
//             >
//               SECTIONS
//             </div>
//             {sectionCounts.map((s) => (
//               <div
//                 key={s.id}
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "space-between",
//                   marginBottom: 8,
//                   opacity: s.count === 0 ? 0.3 : 1,
//                 }}
//               >
//                 <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
//                   <div
//                     style={{
//                       width: 9,
//                       height: 9,
//                       borderRadius: "50%",
//                       background: s.color,
//                     }}
//                   />
//                   <span style={{ fontSize: 12, color: "#64748B" }}>
//                     {s.label}
//                   </span>
//                 </div>
//                 <span
//                   style={{
//                     fontSize: 12,
//                     fontWeight: 600,
//                     color: s.count > 0 ? s.color : "#334155",
//                   }}
//                 >
//                   {s.count}
//                 </span>
//               </div>
//             ))}
//           </div>

//           {/* Angle compass */}
//           <div style={{ background: "#0d0d14", borderRadius: 10, padding: 12 }}>
//             <div
//               style={{
//                 fontSize: 10,
//                 color: "#555",
//                 letterSpacing: 1,
//                 marginBottom: 6,
//                 fontWeight: 600,
//               }}
//             >
//               ANGLE
//             </div>
//             <svg width="100%" viewBox="0 0 160 90">
//               {[0, 45, 90, 135, -45, -90, -135, 180].map((deg) => {
//                 const rad = (deg * Math.PI) / 180;
//                 const cx = 80,
//                   cy = 45,
//                   len = 28;
//                 const isActive =
//                   angleNow !== null && Math.abs(angleNow - deg) < 25;
//                 return (
//                   <g key={deg}>
//                     <line
//                       x1={cx}
//                       y1={cy}
//                       x2={cx + Math.cos(rad) * len}
//                       y2={cy + Math.sin(rad) * len}
//                       stroke={isActive ? secColor : "#2a2a35"}
//                       strokeWidth={isActive ? 2 : 1}
//                     />
//                     <text
//                       x={cx + Math.cos(rad) * (len + 11)}
//                       y={cy + Math.sin(rad) * (len + 11) + 3}
//                       fill={isActive ? secColor : "#444"}
//                       fontSize="8"
//                       textAnchor="middle"
//                       fontFamily="monospace"
//                     >
//                       {deg}°
//                     </text>
//                   </g>
//                 );
//               })}
//               <circle cx="80" cy="45" r="3" fill={secColor} />
//               {angleNow !== null && (
//                 <line
//                   x1="80"
//                   y1="45"
//                   x2={80 + Math.cos((angleNow * Math.PI) / 180) * 26}
//                   y2={45 + Math.sin((angleNow * Math.PI) / 180) * 26}
//                   stroke={secColor}
//                   strokeWidth={2}
//                   opacity={0.9}
//                 />
//               )}
//             </svg>
//             <div
//               style={{ fontSize: 10, color: "#475569", textAlign: "center" }}
//             >
//               {angleNow !== null ? `${angleNow}°` : "drag to set angle"}
//             </div>
//           </div>

//           <div style={{ marginTop: "auto" }}>
//             <button
//               disabled={totalSeats === 0 || saving}
//               onClick={() => setSaveOpen(true)}
//               style={{
//                 width: "100%",
//                 background:
//                   totalSeats > 0
//                     ? "linear-gradient(135deg,#2563EB,#1D4ED8)"
//                     : "#1e1e2a",
//                 color: totalSeats > 0 ? "#fff" : "#444",
//                 border: "none",
//                 borderRadius: 10,
//                 padding: "12px",
//                 fontWeight: 700,
//                 fontSize: 13,
//                 cursor: totalSeats > 0 ? "pointer" : "not-allowed",
//                 transition: "all 0.2s",
//                 boxShadow:
//                   totalSeats > 0 ? "0 4px 16px rgba(37,99,235,0.35)" : "none",
//               }}
//             >
//               {saving ? "Saving…" : `Save Hall → (${totalSeats} seats)`}
//             </button>
//           </div>
//         </div>
//       </div>

//       <SaveHallDialog
//         open={saveOpen}
//         onClose={() => setSaveOpen(false)}
//         onSave={handleSave}
//         saving={saving}
//       />
//     </>
//   );
// }

// // ─────────────────────────────────────────────────────────────
// // APP ROOT
// // ─────────────────────────────────────────────────────────────
// export default function Dashboard({ hallId }) {
//   const [mode, setMode] = useState(0);

//   return (
//     <div
//       style={{
//         height: "100vh",
//         display: "flex",
//         flexDirection: "column",
//         background: "#0d0d14",
//         fontFamily: "'DM Sans', sans-serif",
//         color: "#fff",
//       }}
//     >
//       <link
//         href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap"
//         rel="stylesheet"
//       />

//       {/* Top nav */}
//       <div
//         style={{
//           background: "#0F172A",
//           borderBottom: "1px solid #1e1e2a",
//           padding: "0 20px",
//           display: "flex",
//           alignItems: "center",
//           height: 52,
//           flexShrink: 0,
//         }}
//       >
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: 8,
//             marginRight: 28,
//           }}
//         >
//           <div
//             style={{
//               width: 28,
//               height: 28,
//               borderRadius: 6,
//               background: "linear-gradient(135deg,#2563EB,#1D4ED8)",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               fontSize: 14,
//               boxShadow: "0 0 12px rgba(37,99,235,0.4)",
//             }}
//           >
//             🎭
//           </div>
//           <span style={{ fontWeight: 700, fontSize: 15, color: "#F8FAFC" }}>
//             HallDesk
//           </span>
//         </div>

//         {MODES.map((m, i) => (
//           <button
//             key={i}
//             onClick={() => setMode(i)}
//             style={{
//               padding: "0 18px",
//               height: "100%",
//               background: "transparent",
//               border: "none",
//               borderBottom: `2px solid ${mode === i ? "#2563EB" : "transparent"}`,
//               color: mode === i ? "#F8FAFC" : "#64748B",
//               cursor: "pointer",
//               fontSize: 13,
//               fontWeight: mode === i ? 600 : 400,
//               transition: "all 0.2s",
//             }}
//           >
//             {m}
//           </button>
//         ))}

//         <div
//           style={{
//             marginLeft: "auto",
//             display: "flex",
//             gap: 8,
//             alignItems: "center",
//           }}
//         >
//           {mode === 0 && (
//             <div
//               style={{
//                 fontSize: 12,
//                 background: "#1e1e2a",
//                 padding: "4px 12px",
//                 borderRadius: 20,
//                 color: "#64748B",
//               }}
//             >
//               Hall ID: {hallId || "—"}
//             </div>
//           )}
//           <div
//             style={{
//               fontSize: 12,
//               background: "#2563EB22",
//               border: "1px solid #2563EB44",
//               padding: "4px 12px",
//               borderRadius: 20,
//               color: "#2563EB",
//               fontWeight: 600,
//             }}
//           >
//             {mode === 0 ? "Live Booking" : "Admin Mode"}
//           </div>
//         </div>
//       </div>

//       <div style={{ flex: 1, overflow: "hidden" }}>
//         {mode === 0 ? <BookingView hallId={hallId} /> : <DrawMode />}
//       </div>
//     </div>
//   );
// }

// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  LinearProgress,
  IconButton,
  Tooltip,
  Skeleton,
  Divider,
  Button,
  Badge,
} from "@mui/material";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// Icons
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import CurrencyRupeeOutlinedIcon from "@mui/icons-material/CurrencyRupeeOutlined";
import MeetingRoomOutlinedIcon from "@mui/icons-material/MeetingRoomOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
// import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import RefreshIcon from "@mui/icons-material/Refresh";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
// import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
// import PersonOutline from "@mui/icons-material/PersonOutline";
import TaskAltIcon from "@mui/icons-material/TaskAlt";

// Redux
import {
  fetchDashboardOverviewThunk,
  fetchRevenueChartThunk,
  fetchTopEventsThunk,
  fetchRecentBookingsThunk,
  fetchCategoryStatsThunk,
  fetchAllDashboardThunk,
} from "../features/dashboard/dashboardThunks";
import {
  selectDashboardOverview,
  selectDashboardRevenueChart,
  selectDashboardTopEvents,
  selectDashboardRecentBookings,
  selectDashboardCategoryStats,
  selectDashboardLoading,
  selectPendingEventCount,
  selectPendingKycCount,
} from "../features/dashboard/dashboardSelectors";
import { fetchHallStatsThunk } from "../features/halls/hallThunks";
import { selectHallStats } from "../features/halls/hallSelectors";
import {
  selectUser,
  selectIsAdmin,
  selectUserRole,
} from "../features/auth/authSelectors";

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
const fmt = (n) => Number(n || 0).toLocaleString("en-IN");
const fmtRs = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

const STATUS_COLORS = {
  confirmed: {
    bg: "#052e16",
    border: "#166534",
    color: "#4ade80",
    label: "Confirmed",
  },
  paid: { bg: "#052e16", border: "#166534", color: "#4ade80", label: "Paid" },
  pending: {
    bg: "#2d1a00",
    border: "#854d0e",
    color: "#fbbf24",
    label: "Pending",
  },
  cancelled: {
    bg: "#2d1515",
    border: "#991b1b",
    color: "#f87171",
    label: "Cancelled",
  },
  approved: {
    bg: "#052e16",
    border: "#166534",
    color: "#4ade80",
    label: "Approved",
  },
  rejected: {
    bg: "#2d1515",
    border: "#991b1b",
    color: "#f87171",
    label: "Rejected",
  },
};
const getStatus = (s = "") =>
  STATUS_COLORS[s?.toLowerCase()] || STATUS_COLORS.pending;

const PIE_COLORS = [
  "#2563EB",
  "#f59e0b",
  "#22c55e",
  "#f472b6",
  "#14b8a6",
  "#8b5cf6",
  "#ef4444",
  "#f97316",
];

// ─────────────────────────────────────────────────────────────
// STATUS CHIP
// ─────────────────────────────────────────────────────────────
function StatusChip({ status }) {
  const s = getStatus(status);
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.5,
        px: "8px",
        py: "3px",
        borderRadius: "20px",
        background: s.bg,
        border: `1px solid ${s.border}`,
        fontSize: 10,
        fontWeight: 700,
        color: s.color,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        flexShrink: 0,
      }}
    >
      <Box
        sx={{ width: 4, height: 4, borderRadius: "50%", background: s.color }}
      />
      {s.label}
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────
// KPI STAT CARD
// ─────────────────────────────────────────────────────────────
function StatCard({
  title,
  value,
  sub,
  icon,
  color,
  trend,
  trendUp,
  badge,
  loading,
  onClick,
}) {
  return (
    <Card
      onClick={onClick}
      sx={{
        background: "#1E293B",
        border: "1px solid #334155",
        height: "100%",
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.2s",
        position: "relative",
        overflow: "hidden",
        "&:hover": onClick
          ? {
              border: `1px solid ${color}55`,
              transform: "translateY(-2px)",
              boxShadow: `0 8px 24px ${color}15`,
            }
          : {},
      }}
    >
      {/* Background shimmer */}
      <Box
        sx={{
          position: "absolute",
          top: -30,
          right: -30,
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: color + "10",
          pointerEvents: "none",
        }}
      />

      <CardContent sx={{ p: "20px !important" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                fontSize: 10,
                color: "#64748B",
                fontWeight: 600,
                letterSpacing: 1,
                mb: 1,
              }}
            >
              {title}
            </Typography>
            {loading ? (
              <Skeleton
                variant="text"
                width={80}
                height={40}
                sx={{ bgcolor: "#334155" }}
              />
            ) : (
              <Typography
                sx={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: "#F8FAFC",
                  lineHeight: 1,
                  mb: 0.5,
                }}
              >
                {value ?? "—"}
              </Typography>
            )}
            {sub && !loading && (
              <Typography sx={{ fontSize: 11, color: "#64748B" }}>
                {sub}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              width: 46,
              height: 46,
              borderRadius: "12px",
              background: color + "18",
              border: `1px solid ${color}25`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Box sx={{ color, "& svg": { fontSize: 22 } }}>{icon}</Box>
          </Box>
        </Box>

        {(trend || badge > 0) && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mt: 1.5,
              pt: 1.5,
              borderTop: "1px solid #1E293B",
            }}
          >
            {trend && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                {trendUp ? (
                  <TrendingUpIcon sx={{ fontSize: 14, color: "#22c55e" }} />
                ) : (
                  <TrendingDownIcon sx={{ fontSize: 14, color: "#ef4444" }} />
                )}
                <Typography
                  sx={{
                    fontSize: 11,
                    color: trendUp ? "#22c55e" : "#ef4444",
                    fontWeight: 600,
                  }}
                >
                  {trend}
                </Typography>
              </Box>
            )}
            {badge > 0 && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <WarningAmberOutlinedIcon
                  sx={{ fontSize: 13, color: "#f59e0b" }}
                />
                <Typography
                  sx={{ fontSize: 10, color: "#f59e0b", fontWeight: 600 }}
                >
                  {badge} need action
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────
// SECTION HEADER
// ─────────────────────────────────────────────────────────────
function SectionHeader({ title, sub, action, onAction }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        mb: 2,
      }}
    >
      <Box>
        <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#F8FAFC" }}>
          {title}
        </Typography>
        {sub && (
          <Typography sx={{ fontSize: 11, color: "#64748B", mt: 0.2 }}>
            {sub}
          </Typography>
        )}
      </Box>
      {action && (
        <Button
          size="small"
          endIcon={<ArrowForwardIcon sx={{ fontSize: 13 }} />}
          onClick={onAction}
          sx={{
            fontSize: 11,
            color: "#2563EB",
            textTransform: "none",
            fontWeight: 600,
            "&:hover": { background: "#2563EB15" },
          }}
        >
          {action}
        </Button>
      )}
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────
// ALERT BANNER
// ─────────────────────────────────────────────────────────────
function AlertBanner({ icon, message, color, action, onAction }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        px: 2,
        py: 1.2,
        borderRadius: "10px",
        background: color + "12",
        border: `1px solid ${color}30`,
        mb: 1,
      }}
    >
      <Box sx={{ color, "& svg": { fontSize: 18 } }}>{icon}</Box>
      <Typography sx={{ fontSize: 12, color: "#94A3B8", flex: 1 }}>
        {message}
      </Typography>
      {action && (
        <Button
          size="small"
          variant="outlined"
          onClick={onAction}
          sx={{
            fontSize: 10,
            py: 0.3,
            px: 1.5,
            borderRadius: "6px",
            borderColor: color + "66",
            color,
            minWidth: 0,
            "&:hover": { borderColor: color, background: color + "15" },
          }}
        >
          {action}
        </Button>
      )}
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────
// SKELETON CARD
// ─────────────────────────────────────────────────────────────
function CardSkeleton({ height = 300 }) {
  return (
    <Card sx={{ background: "#1E293B", border: "1px solid #334155", height }}>
      <CardContent>
        <Skeleton
          variant="text"
          width="40%"
          height={24}
          sx={{ bgcolor: "#334155", mb: 2 }}
        />
        <Skeleton
          variant="rounded"
          height={height - 80}
          sx={{ bgcolor: "#334155" }}
        />
      </CardContent>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────
// CUSTOM TOOLTIP FOR CHARTS
// ─────────────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <Box
      sx={{
        background: "#0F172A",
        border: "1px solid #334155",
        borderRadius: "8px",
        p: "10px 14px",
        boxShadow: "0 8px 24px #000a",
      }}
    >
      <Typography sx={{ fontSize: 11, color: "#64748B", mb: 0.5 }}>
        {label}
      </Typography>
      {payload.map((p, i) => (
        <Typography
          key={i}
          sx={{ fontSize: 13, fontWeight: 700, color: p.color }}
        >
          {p.name === "revenue" ? fmtRs(p.value) : p.value}
        </Typography>
      ))}
    </Box>
  );
};

// ─────────────────────────────────────────────────────────────
// MAIN DASHBOARD
// ─────────────────────────────────────────────────────────────
export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Auth
  const user = useSelector(selectUser);
  const isAdmin = useSelector(selectIsAdmin);
  const role = useSelector(selectUserRole);
  const isSuperAdmin = role === "super_admin";

  // Dashboard data
  const overview = useSelector(selectDashboardOverview);
  const revenue = useSelector(selectDashboardRevenueChart);
  const topEvents = useSelector(selectDashboardTopEvents);
  const recent = useSelector(selectDashboardRecentBookings);
  const catStats = useSelector(selectDashboardCategoryStats);
  const loading = useSelector(selectDashboardLoading);
  const pendingEvt = useSelector(selectPendingEventCount);
  const pendingKyc = useSelector(selectPendingKycCount);
  const hallStats = useSelector(selectHallStats);

  const [period, setPeriod] = useState(30);

  const load = () => {
    dispatch(fetchAllDashboardThunk());
    dispatch(fetchHallStatsThunk());
  };

  useEffect(() => {
    load();
  }, []);

  const revenueData = (revenue || []).map((d) => ({
    ...d,
    revenue: +d.revenue || 0,
    bookings: +d.bookings || 0,
  }));

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const roleLabel = {
    super_admin: "Super Admin",
    admin: "Admin",
    organizer: "Organizer",
    user: "Customer",
  };

  // ─────────────────────────────────────────────────────────
  // LOADING STATE
  // ─────────────────────────────────────────────────────────
  if (loading && !overview) {
    return (
      <Box>
        <Skeleton
          variant="text"
          width={280}
          height={40}
          sx={{ bgcolor: "#1E293B", mb: 1 }}
        />
        <Skeleton
          variant="text"
          width={180}
          height={20}
          sx={{ bgcolor: "#1E293B", mb: 3 }}
        />
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          {[...Array(5)].map((_, i) => (
            <Grid key={i} item xs={12} sm={6} xl={2.4}>
              <Skeleton
                variant="rounded"
                height={120}
                sx={{ bgcolor: "#1E293B", borderRadius: 2 }}
              />
            </Grid>
          ))}
        </Grid>
        <Grid container spacing={2.5}>
          <Grid item xs={12} lg={8}>
            <CardSkeleton height={340} />
          </Grid>
          <Grid item xs={12} lg={4}>
            <CardSkeleton height={340} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <Box>
      {/* ── PAGE HEADER ────────────────────────────────────── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Box>
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}
          >
            <Typography
              variant="h5"
              sx={{ color: "#F8FAFC", fontWeight: 800, letterSpacing: -0.5 }}
            >
              {greeting()}, {user?.name?.split(" ")[0]} 👋
            </Typography>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.6,
                px: "8px",
                py: "3px",
                borderRadius: "20px",
                background: isSuperAdmin ? "#2563EB20" : "#1E293B",
                border: `1px solid ${isSuperAdmin ? "#2563EB44" : "#334155"}`,
                fontSize: 10,
                fontWeight: 700,
                color: isSuperAdmin ? "#60A5FA" : "#64748B",
              }}
            >
              {isAdmin ? (
                <AdminPanelSettingsIcon sx={{ fontSize: 12 }} />
              ) : (
                // <PersonOutline sx={{ fontSize: 12 }} />
                <>ICON</>
              )}
              {roleLabel[role] || role}
            </Box>
          </Box>
          <Typography sx={{ color: "#64748B", fontSize: 13 }}>
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            {" · "}Here's what's happening with your events.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Tooltip title="Refresh dashboard">
            <IconButton
              size="small"
              onClick={load}
              disabled={loading}
              sx={{
                color: "#64748B",
                border: "1px solid #334155",
                borderRadius: "8px",
                "&:hover": {
                  color: "#2563EB",
                  borderColor: "#2563EB44",
                  background: "#2563EB10",
                },
              }}
            >
              <RefreshIcon
                fontSize="small"
                sx={{
                  animation: loading ? "spin 1s linear infinite" : "none",
                  "@keyframes spin": {
                    "100%": { transform: "rotate(360deg)" },
                  },
                }}
              />
            </IconButton>
          </Tooltip>
          {isAdmin && (
            <Button
              variant="contained"
              size="small"
              startIcon={<EventOutlinedIcon />}
              onClick={() => navigate("/events")}
              sx={{
                fontSize: 12,
                borderRadius: "8px",
                background: "linear-gradient(135deg,#2563EB,#1D4ED8)",
                boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
                "&:hover": { boxShadow: "0 6px 18px rgba(37,99,235,0.45)" },
              }}
            >
              Manage Events
            </Button>
          )}
        </Box>
      </Box>

      {/* ── ACTION ALERTS (admin only) ──────────────────────── */}
      {isAdmin && (pendingEvt > 0 || pendingKyc > 0) && (
        <Box sx={{ mb: 3 }}>
          {pendingEvt > 0 && (
            <AlertBanner
              icon={<WarningAmberOutlinedIcon />}
              message={`${pendingEvt} event${pendingEvt !== 1 ? "s" : ""} waiting for your approval before going live.`}
              color="#f59e0b"
              action="Review Events"
              onAction={() => navigate("/events")}
            />
          )}
          {pendingKyc > 0 && (
            <AlertBanner
              icon={<AdminPanelSettingsIcon />}
              message={`${pendingKyc} organizer${pendingKyc !== 1 ? "s" : ""} have submitted KYC documents and need verification.`}
              color="#2563EB"
              action="Verify KYC"
              onAction={() => navigate("/users")}
            />
          )}
        </Box>
      )}

      {/* ── KPI CARDS ───────────────────────────────────────── */}
      {isAdmin ? (
        // ADMIN KPI CARDS
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} xl={2.4}>
            <StatCard
              title="TOTAL USERS"
              value={fmt(overview?.users?.total)}
              sub={`${fmt(overview?.users?.organizers)} organizers · ${fmt(overview?.users?.customers)} customers`}
              icon={<PeopleOutlinedIcon />}
              color="#2563EB"
              trend={`${fmt(overview?.users?.pending_kyc)} KYC pending`}
              trendUp={false}
              badge={pendingKyc}
              loading={loading}
              onClick={() => navigate("/users")}
            />
          </Grid>
          <Grid item xs={12} sm={6} xl={2.4}>
            <StatCard
              title="TOTAL EVENTS"
              value={fmt(overview?.events?.total)}
              sub={`${fmt(overview?.events?.approved)} live · ${fmt(overview?.events?.completed)} completed`}
              icon={<EventOutlinedIcon />}
              color="#f59e0b"
              trend={`${fmt(overview?.events?.pending)} pending approval`}
              trendUp={false}
              badge={pendingEvt}
              loading={loading}
              onClick={() => navigate("/events")}
            />
          </Grid>
          <Grid item xs={12} sm={6} xl={2.4}>
            <StatCard
              title="TOTAL BOOKINGS"
              value={fmt(overview?.bookings?.total)}
              sub={`${fmt(overview?.bookings?.today)} today`}
              icon={<ConfirmationNumberOutlinedIcon />}
              color="#22c55e"
              trend={`${fmtRs(overview?.bookings?.today_revenue)} today`}
              trendUp={true}
              loading={loading}
              onClick={() => navigate("/bookings")}
            />
          </Grid>
          <Grid item xs={12} sm={6} xl={2.4}>
            <StatCard
              title="TOTAL REVENUE"
              value={fmtRs(overview?.bookings?.revenue)}
              sub="All confirmed bookings"
              icon={<CurrencyRupeeOutlinedIcon />}
              color="#a78bfa"
              trend={`Today: ${fmtRs(overview?.bookings?.today_revenue)}`}
              trendUp={true}
              loading={loading}
              onClick={() => navigate("/analytics")}
            />
          </Grid>
          <Grid item xs={12} sm={6} xl={2.4}>
            <StatCard
              title="ACTIVE HALLS"
              value={fmt(hallStats?.total_halls)}
              sub={`${fmt(hallStats?.bookable_seats)} bookable seats`}
              icon={<MeetingRoomOutlinedIcon />}
              color="#14b8a6"
              trend={`${fmt(hallStats?.vip_seats)} VIP seats`}
              trendUp={true}
              loading={loading}
              onClick={() => navigate("/halls")}
            />
          </Grid>
        </Grid>
      ) : (
        // USER / ORGANIZER KPI CARDS
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="MY BOOKINGS"
              value={fmt(overview?.bookings?.total)}
              sub="All time"
              icon={<ConfirmationNumberOutlinedIcon />}
              color="#2563EB"
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="CONFIRMED"
              value={fmt(overview?.bookings?.confirmed)}
              sub="Active bookings"
              // icon={<CheckCircleOutlineIcon />}
              color="#22c55e"
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="UPCOMING EVENTS"
              value={fmt(overview?.events?.approved)}
              sub="Available to book"
              icon={<EventOutlinedIcon />}
              color="#f59e0b"
              loading={loading}
              onClick={() => navigate("/events")}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="TOTAL SPENT"
              value={fmtRs(overview?.bookings?.revenue)}
              sub="Across all bookings"
              icon={<CurrencyRupeeOutlinedIcon />}
              color="#a78bfa"
              loading={loading}
            />
          </Grid>
        </Grid>
      )}

      {/* ── ADMIN: CHARTS ROW ───────────────────────────────── */}
      {isAdmin && (
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          {/* Revenue area chart */}
          <Grid item xs={12} lg={8}>
            <Card
              sx={{
                background: "#1E293B",
                border: "1px solid #334155",
                height: 360,
              }}
            >
              <CardContent sx={{ height: "100%", pb: "16px !important" }}>
                <SectionHeader
                  title="Revenue Overview"
                  sub="Daily bookings & revenue for the last 30 days"
                  action="Full Analytics"
                  onAction={() => navigate("/analytics")}
                />
                <ResponsiveContainer width="100%" height={270}>
                  <AreaChart
                    data={revenueData}
                    margin={{ left: -10, right: 10 }}
                  >
                    <defs>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#2563EB"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#2563EB"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient id="bkGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#22c55e"
                          stopOpacity={0.2}
                        />
                        <stop
                          offset="95%"
                          stopColor="#22c55e"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: "#64748B", fontSize: 10 }}
                      tickFormatter={(d) => d?.slice(5)}
                    />
                    <YAxis
                      yAxisId="rev"
                      tick={{ fill: "#64748B", fontSize: 10 }}
                      tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                    />
                    <YAxis
                      yAxisId="bk"
                      orientation="right"
                      tick={{ fill: "#64748B", fontSize: 10 }}
                    />
                    <RTooltip content={<ChartTooltip />} />
                    <Area
                      yAxisId="rev"
                      type="monotone"
                      dataKey="revenue"
                      name="revenue"
                      stroke="#2563EB"
                      strokeWidth={2.5}
                      fill="url(#revGrad)"
                      dot={false}
                      activeDot={{
                        r: 5,
                        fill: "#2563EB",
                        stroke: "#60A5FA",
                        strokeWidth: 2,
                      }}
                    />
                    <Area
                      yAxisId="bk"
                      type="monotone"
                      dataKey="bookings"
                      name="bookings"
                      stroke="#22c55e"
                      strokeWidth={2}
                      fill="url(#bkGrad)"
                      dot={false}
                      activeDot={{ r: 4, fill: "#22c55e" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Category pie */}
          <Grid item xs={12} lg={4}>
            <Card
              sx={{
                background: "#1E293B",
                border: "1px solid #334155",
                height: 360,
              }}
            >
              <CardContent sx={{ height: "100%", pb: "16px !important" }}>
                <SectionHeader
                  title="Events by Category"
                  sub="Distribution of active events"
                />
                {catStats?.length > 0 ? (
                  <ResponsiveContainer width="100%" height={290}>
                    <PieChart>
                      <Pie
                        data={catStats}
                        cx="50%"
                        cy="42%"
                        innerRadius={55}
                        outerRadius={85}
                        dataKey="event_count"
                        nameKey="name"
                        paddingAngle={3}
                      >
                        {catStats.map((_, i) => (
                          <Cell
                            key={i}
                            fill={PIE_COLORS[i % PIE_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Legend
                        iconSize={8}
                        wrapperStyle={{
                          fontSize: 11,
                          color: "#94A3B8",
                          paddingTop: 8,
                        }}
                      />
                      <RTooltip
                        contentStyle={{
                          background: "#0F172A",
                          border: "1px solid #334155",
                          borderRadius: 8,
                          fontSize: 12,
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: 260,
                      color: "#334155",
                      flexDirection: "column",
                      gap: 1,
                    }}
                  >
                    <EventOutlinedIcon sx={{ fontSize: 40 }} />
                    <Typography sx={{ fontSize: 13 }}>No data yet</Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* ── TABLES ROW ──────────────────────────────────────── */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {/* Top events (admin) or Upcoming events (user) */}
        <Grid item xs={12} lg={isAdmin ? 7 : 12}>
          <Card sx={{ background: "#1E293B", border: "1px solid #334155" }}>
            <CardContent>
              <SectionHeader
                title={isAdmin ? "Top Events by Revenue" : "Upcoming Events"}
                sub={
                  isAdmin
                    ? "Best performing events this period"
                    : "Events available to book"
                }
                action="View All"
                onAction={() => navigate("/events")}
              />
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        color: "#64748B",
                        fontSize: 10,
                        fontWeight: 700,
                        borderBottom: "1px solid #334155",
                        pb: 1,
                        letterSpacing: 0.5,
                      }}
                    >
                      EVENT
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#64748B",
                        fontSize: 10,
                        fontWeight: 700,
                        borderBottom: "1px solid #334155",
                        pb: 1,
                        letterSpacing: 0.5,
                      }}
                    >
                      DATE
                    </TableCell>
                    {isAdmin && (
                      <>
                        <TableCell
                          sx={{
                            color: "#64748B",
                            fontSize: 10,
                            fontWeight: 700,
                            borderBottom: "1px solid #334155",
                            pb: 1,
                          }}
                        >
                          OCCUPANCY
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "#64748B",
                            fontSize: 10,
                            fontWeight: 700,
                            borderBottom: "1px solid #334155",
                            pb: 1,
                          }}
                        >
                          REVENUE
                        </TableCell>
                      </>
                    )}
                    <TableCell
                      sx={{
                        color: "#64748B",
                        fontSize: 10,
                        fontWeight: 700,
                        borderBottom: "1px solid #334155",
                        pb: 1,
                      }}
                    >
                      STATUS
                    </TableCell>
                    <TableCell sx={{ borderBottom: "1px solid #334155" }} />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(topEvents || []).slice(0, 7).map((e) => {
                    const occ =
                      e.total_tickets > 0
                        ? Math.round((e.sold_tickets / e.total_tickets) * 100)
                        : 0;
                    return (
                      <TableRow
                        key={e.id}
                        sx={{
                          "&:last-child td": { border: 0 },
                          "&:hover td": { background: "#0F172A" },
                        }}
                      >
                        <TableCell
                          sx={{ borderBottom: "1px solid #1E293B", py: 1.2 }}
                        >
                          <Typography
                            sx={{
                              fontSize: 12,
                              fontWeight: 600,
                              color: "#F8FAFC",
                              maxWidth: 200,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {e.title}
                          </Typography>
                          {e.organizer_name && (
                            <Typography sx={{ fontSize: 10, color: "#64748B" }}>
                              {e.organizer_name}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell sx={{ borderBottom: "1px solid #1E293B" }}>
                          <Typography
                            sx={{
                              fontSize: 11,
                              color: "#94A3B8",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {e.event_date
                              ? new Date(e.event_date).toLocaleDateString(
                                  "en-IN",
                                  { day: "numeric", month: "short" },
                                )
                              : "—"}
                          </Typography>
                        </TableCell>
                        {isAdmin && (
                          <>
                            <TableCell
                              sx={{
                                borderBottom: "1px solid #1E293B",
                                minWidth: 100,
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <LinearProgress
                                  variant="determinate"
                                  value={occ}
                                  sx={{
                                    flex: 1,
                                    height: 4,
                                    borderRadius: 2,
                                    background: "#334155",
                                    "& .MuiLinearProgress-bar": {
                                      borderRadius: 2,
                                      background:
                                        occ > 80
                                          ? "#22c55e"
                                          : occ > 50
                                            ? "#f59e0b"
                                            : "#2563EB",
                                    },
                                  }}
                                />
                                <Typography
                                  sx={{
                                    fontSize: 10,
                                    color: "#64748B",
                                    minWidth: 28,
                                  }}
                                >
                                  {occ}%
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell
                              sx={{ borderBottom: "1px solid #1E293B" }}
                            >
                              <Typography
                                sx={{
                                  fontSize: 12,
                                  fontWeight: 700,
                                  color: "#22c55e",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {fmtRs(
                                  e.revenue || e.sold_tickets * e.ticket_price,
                                )}
                              </Typography>
                            </TableCell>
                          </>
                        )}
                        <TableCell sx={{ borderBottom: "1px solid #1E293B" }}>
                          <StatusChip status={e.status} />
                        </TableCell>
                        <TableCell sx={{ borderBottom: "1px solid #1E293B" }}>
                          <Tooltip title="View event">
                            <IconButton
                              size="small"
                              onClick={() => navigate("/events")}
                              sx={{
                                color: "#64748B",
                                width: 24,
                                height: 24,
                                "&:hover": { color: "#2563EB" },
                              }}
                            >
                              <OpenInNewIcon sx={{ fontSize: 13 }} />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {(!topEvents || topEvents.length === 0) && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        sx={{
                          textAlign: "center",
                          py: 4,
                          color: "#475569",
                          border: 0,
                        }}
                      >
                        <EventOutlinedIcon
                          sx={{
                            fontSize: 36,
                            mb: 1,
                            display: "block",
                            mx: "auto",
                          }}
                        />
                        <Typography sx={{ fontSize: 13 }}>
                          No events yet
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent bookings (admin only) */}
        {isAdmin && (
          <Grid item xs={12} lg={5}>
            <Card
              sx={{
                background: "#1E293B",
                border: "1px solid #334155",
                height: "100%",
              }}
            >
              <CardContent>
                <SectionHeader
                  title="Recent Bookings"
                  sub="Latest transactions"
                  action="View All"
                  onAction={() => navigate("/bookings")}
                />
                {!recent || recent.length === 0 ? (
                  <Box sx={{ textAlign: "center", py: 5, color: "#334155" }}>
                    <ConfirmationNumberOutlinedIcon
                      sx={{ fontSize: 40, mb: 1 }}
                    />
                    <Typography sx={{ fontSize: 13 }}>
                      No bookings yet
                    </Typography>
                  </Box>
                ) : (
                  (recent || []).map((b) => (
                    <Box
                      key={b.id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        mb: 1.5,
                        pb: 1.5,
                        borderBottom: "1px solid #334155",
                        "&:last-child": { border: 0, mb: 0, pb: 0 },
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 34,
                          height: 34,
                          background: "#2563EB18",
                          color: "#60A5FA",
                          fontSize: 13,
                          fontWeight: 700,
                          border: "1px solid #2563EB30",
                          flexShrink: 0,
                        }}
                      >
                        {b.user_name?.[0]?.toUpperCase()}
                      </Avatar>
                      <Box sx={{ flex: 1, overflow: "hidden" }}>
                        <Typography
                          sx={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: "#F8FAFC",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {b.user_name}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: 11,
                            color: "#64748B",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {b.event_title}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: "right", flexShrink: 0 }}>
                        <Typography
                          sx={{
                            fontSize: 12,
                            fontWeight: 800,
                            color: "#22c55e",
                          }}
                        >
                          {fmtRs(b.total_amount)}
                        </Typography>
                        <StatusChip status={b.status} />
                      </Box>
                    </Box>
                  ))
                )}
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* ── ADMIN: HALL STATS STRIP ─────────────────────────── */}
      {isAdmin && hallStats && (
        <Card sx={{ background: "#1E293B", border: "1px solid #334155" }}>
          <CardContent sx={{ py: "14px !important" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                flexWrap: "wrap",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "8px",
                    background: "#14b8a618",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MeetingRoomOutlinedIcon
                    sx={{ fontSize: 16, color: "#14b8a6" }}
                  />
                </Box>
                <Typography
                  sx={{ fontSize: 13, fontWeight: 700, color: "#F8FAFC" }}
                >
                  Hall Capacity Summary
                </Typography>
              </Box>
              <Divider
                orientation="vertical"
                flexItem
                sx={{ borderColor: "#334155" }}
              />
              {[
                {
                  label: "Active Halls",
                  value: fmt(hallStats.total_halls),
                  color: "#2563EB",
                },
                {
                  label: "Total Seats",
                  value: fmt(hallStats.total_seats),
                  color: "#F8FAFC",
                },
                {
                  label: "Bookable Seats",
                  value: fmt(hallStats.bookable_seats),
                  color: "#22c55e",
                },
                {
                  label: "VIP Seats",
                  value: fmt(hallStats.vip_seats),
                  color: "#f59e0b",
                },
              ].map((item) => (
                <Box
                  key={item.label}
                  sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontSize: 18,
                        fontWeight: 800,
                        color: item.color,
                        lineHeight: 1,
                      }}
                    >
                      {item.value}
                    </Typography>
                    <Typography
                      sx={{ fontSize: 10, color: "#64748B", mt: 0.2 }}
                    >
                      {item.label}
                    </Typography>
                  </Box>
                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{ borderColor: "#334155" }}
                  />
                </Box>
              ))}
              <Button
                size="small"
                variant="outlined"
                endIcon={<ArrowForwardIcon sx={{ fontSize: 13 }} />}
                onClick={() => navigate("/halls")}
                sx={{
                  ml: "auto",
                  fontSize: 11,
                  borderRadius: "8px",
                  borderColor: "#334155",
                  color: "#64748B",
                  "&:hover": {
                    borderColor: "#2563EB44",
                    color: "#2563EB",
                    background: "#2563EB10",
                  },
                }}
              >
                Manage Halls
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* ── USER: QUICK ACTIONS ─────────────────────────────── */}
      {!isAdmin && (
        <Card sx={{ background: "#1E293B", border: "1px solid #334155" }}>
          <CardContent>
            <SectionHeader
              title="Quick Actions"
              sub="What would you like to do?"
            />
            <Grid container spacing={2}>
              {[
                {
                  label: "Browse Events",
                  icon: <EventOutlinedIcon />,
                  color: "#2563EB",
                  path: "/events",
                  desc: "Discover upcoming events",
                },
                {
                  label: "My Bookings",
                  icon: <ConfirmationNumberOutlinedIcon />,
                  color: "#22c55e",
                  path: "/bookings",
                  desc: "View your booking history",
                },
                {
                  label: "Saved Events",
                  icon: <TaskAltIcon />,
                  color: "#f59e0b",
                  path: "/events",
                  desc: "Events in your wishlist",
                },
                {
                  label: "Account",
                  // icon: <PersonOutline />,
                  color: "#a78bfa",
                  path: "/settings",
                  desc: "Update profile & password",
                },
              ].map((action) => (
                <Grid key={action.label} item xs={12} sm={6} lg={3}>
                  <Box
                    onClick={() => navigate(action.path)}
                    sx={{
                      p: 2,
                      borderRadius: "12px",
                      background: "#0F172A",
                      border: "1px solid #1E293B",
                      cursor: "pointer",
                      transition: "all 0.15s",
                      "&:hover": {
                        border: `1px solid ${action.color}44`,
                        background: `${action.color}08`,
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "10px",
                        background: `${action.color}18`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 1.5,
                      }}
                    >
                      <Box
                        sx={{ color: action.color, "& svg": { fontSize: 20 } }}
                      >
                        {action.icon}
                      </Box>
                    </Box>
                    <Typography
                      sx={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#F8FAFC",
                        mb: 0.3,
                      }}
                    >
                      {action.label}
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: "#64748B" }}>
                      {action.desc}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
