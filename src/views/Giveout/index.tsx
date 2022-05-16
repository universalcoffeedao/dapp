import React, { useState } from "react";
import { useSelector } from "react-redux";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import { Grid, TextField, Zoom } from "@material-ui/core";
import { trim } from "../../helpers";
import "./giveout.scss";
import { Skeleton } from "@material-ui/lab";
import { IReduxState } from "../../store/slices/state.interface";
import { IAppSlice } from "../../store/slices/app-slice";

function Giveout() {
  const [nftOpen, setNFTOpen] = useState(false);

  const onNFTOpenModal = () => setNFTOpen(true);
  const onNFTCloseModal = () => setNFTOpen(false);

  const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);
  const app = useSelector<IReduxState, IAppSlice>(state => state.app);

  const yourUCCBalance = useSelector<IReduxState, string>(state => {
    return state.account.balances && state.account.balances.ucc;
  });

  const handleClick = () => {
    console.log("hey");
  };

  return (
    <div className="dashboard-view">
      <div className="dashboard-infos-wrap">
        <Zoom in={true}>
          <Grid container spacing={4}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <div className="dashboard-card" onClick={onNFTOpenModal}>
                <p className="card-title">To NFT Holders</p>
              </div>
              <Modal open={nftOpen} onClose={onNFTCloseModal} center>
                <h2 className="modal-title">Give out UCC to your NFT holders</h2>

                <TextField label="Your NFT Address (0x..)" variant="outlined" />
              </Modal>
            </Grid>

            {/* <Grid item lg={6} md={6} sm={6} xs={12}>
              <div className="dashboard-card">
                <p className="card-title">Market Cap</p>
                <p className="card-value">
                  {isAppLoading ? (
                    <Skeleton width="160px" />
                  ) : (
                    new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                      minimumFractionDigits: 0,
                    }).format(app.marketCap)
                  )}
                </p>
              </div>
            </Grid>
            <Grid item lg={6} md={6} sm={6} xs={12}>
              <div className="dashboard-card">
                <p className="card-title">Circulating Supply</p>
                <p className="card-value">{isAppLoading ? <Skeleton width="160px" /> : app.circSupply.toLocaleString()} UCCs</p>
              </div>
            </Grid> */}
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <div className="dashboard-card">
                <p className="card-title">Your UCC Balance</p>
                <p className="card-value">{isAppLoading ? <Skeleton width="160px" /> : trim(Number(yourUCCBalance), 1)} UCC</p>
              </div>
            </Grid>
          </Grid>
        </Zoom>
      </div>
    </div>
  );
}

export default Giveout;
