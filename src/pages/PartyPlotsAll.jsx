import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import Partyplote from "../components/Partyplote";
import { fetchAllPartyPlotsThunk } from "../features/partyPlot/partyPlotThunks";

export default function PartyPlotsAll() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllPartyPlotsThunk());
  }, [dispatch]);

  return <Partyplote skipInitialFetch />;
}
