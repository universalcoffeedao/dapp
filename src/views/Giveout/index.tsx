import React, { useState, useCallback } from "react";
import { ethers } from "ethers";
import { useDispatch, useSelector } from "react-redux";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import { IconButton, Grid, TextField, OutlinedInput, Zoom } from "@material-ui/core";
import { trim } from "../../helpers";
import { useWeb3Context } from "../../hooks";
import "./giveout.scss";
import { Skeleton } from "@material-ui/lab";
import { messages } from "../../constants/messages";
import { warning } from "../../store/slices/messages-slice";
import { changeApproval } from "../../store/slices/multisend-thunk";
import { IPendingTxn, isPendingTxn, txnButtonText } from "../../store/slices/pending-txns-slice";
import { IReduxState } from "../../store/slices/state.interface";
import CircularProgress from "@material-ui/core/CircularProgress";
import { strHasLength } from "../../utils/strings";
import { giveoutUCC } from "../../store/slices/app-slice";
import classnames from "classnames";
import { makeStyles } from "@material-ui/core/styles";
import { listHasLength } from "../../utils/lists";

const useStyles = makeStyles(theme => ({
  textField: {
    "& p": {
      color: "white",
    },
  },
  notchedOutline: {
    borderWidth: "1px",
    borderColor: "#ffc768 !important",
  },
  input: {
    color: "white",
  },
}));

function Giveout() {
  const dispatch = useDispatch();
  const { provider, address, connect, chainID, checkWrongNetwork } = useWeb3Context();

  const [view, setView] = useState(0);
  const [uccSpendForEachAddress, setUccSpendForEachAddress] = useState<string>("");

  const [multisendOpen, setMultisendOpen] = useState(false);

  const [addressesList, setAddressesList] = useState([]);
  const [numAddresses, setNumAddresses] = useState(0);

  const [errorMessage, setErrorMessage] = useState("");

  const classes = useStyles();

  const onMultisendOpenModal = () => {
    setMultisendOpen(true);
  };
  const onMultisendCloseModal = () => {
    setAddressesList([]);
    setNumAddresses(0);
    setUccSpendForEachAddress("");
    setErrorMessage("");
    setMultisendOpen(false);
  };

  const onSeekApproval = async (token: string) => {
    if (await checkWrongNetwork()) return;

    await dispatch(changeApproval({ address, token, provider, networkID: chainID }));
  };

  const onChangeGiveout = async (action: string) => {
    if (await checkWrongNetwork()) return;
    if (uccSpendForEachAddress === "" || parseFloat(uccSpendForEachAddress) === 0) {
      dispatch(warning({ text: action === "giveout" ? messages.before_givingout : messages.before_swapping }));
    } else {
      await dispatch(giveoutUCC({ address, action, value: String(uccSpendForEachAddress), provider, networkID: chainID, beneficiaryAddresses: addressesList }));
      setUccSpendForEachAddress("");
    }
  };

  const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);

  const pendingTransactions = useSelector<IReduxState, IPendingTxn[]>(state => {
    return state.pendingTransactions;
  });

  const multisendUccAllowance = useSelector<IReduxState, number>(state => {
    return state.account.multisend.ucc;
  });

  const yourUCCBalance = useSelector<IReduxState, string>(state => {
    return state.account.balances && state.account.balances.ucc;
  });

  const handleAddressesChange = async e => {
    const submittedAddresses = e.target.value;
    const strippedAddressesList = submittedAddresses.split(",").map(address => address.trim());

    setAddressesList(strippedAddressesList);
    setErrorMessage("");
    setNumAddresses(0);
    setUccSpendForEachAddress("");
  };

  const checkValidAddresses = () => {
    if (listHasLength(addressesList)) {
      if (areValidAddresses(addressesList)) {
        setNumAddresses(addressesList.length);
      } else {
        setErrorMessage("ERROR: One or more addresses are not valid Ethereum addresses");
      }
    }
  };

  const areValidAddresses = (addresses: string[]): boolean => addresses.every(address => ethers.utils.isAddress(address));

  // const getOwnersFromMetadata = async data => {
  //   const addressesList: string[] = data.nftOwnersAddresses;
  //   setNFTHolderAddresses(addressesList);
  //   setNumNFTHolders(addressesList?.length ?? []);
  //   setIsLoading(false);

  //   console.log("nftowners", nftHolderAddresses);
  // };

  const hasAllowance = useCallback(
    token => {
      if (token === "ucc") return multisendUccAllowance > 0;
      return 0;
    },
    [multisendUccAllowance],
  );

  const changeView = (newView: number) => () => {
    setView(newView);
    setUccSpendForEachAddress("");
  };

  // const SearchButton = () => (
  //   <IconButton onClick={handleSubmitNFTAddress} style={{ marginLeft: "0.3rem" }}>
  //     <SearchIcon />
  //   </IconButton>
  // );

  const connectWallet = () => (
    <div className="wallet-notification">
      <div className="wallet-connect-btn" onClick={connect}>
        <p>Connect Wallet</p>
      </div>
      <p className="wallet-desc-text">Connect your wallet to give out UCC!</p>
    </div>
  );

  const sendOutUCCInterface = () => (
    <div className="dashboard-view">
      <div className="dashboard-infos-wrap">
        <Zoom in={true}>
          <Grid container spacing={4}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <div className="card" onClick={onMultisendOpenModal}>
                <p className="card-title">To Multiple Addresses</p>
              </div>

              <Modal
                classNames={{
                  modal: "custom-modal",
                  closeIcon: "close-icon",
                  overlayAnimationIn: "customEnterOverlayAnimation",
                  overlayAnimationOut: "customLeaveOverlayAnimation",
                  modalAnimationIn: "customEnterModalAnimation",
                  modalAnimationOut: "customLeaveModalAnimation",
                }}
                open={multisendOpen}
                onClose={onMultisendCloseModal}
                center
              >
                <div className="stake-view">
                  <Zoom in={true}>
                    <div className="stake-card">
                      <Grid className="stake-card-grid" container direction="column" spacing={2}>
                        <Grid item>
                          <div className="stake-card-header">
                            <p className="stake-card-header-title">Give Out UCC (☕, ☕)</p>
                          </div>
                        </Grid>

                        <Grid item>
                          <div className="stake-card-metrics">
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={12} md={12} lg={12}>
                                <div className="stake-card-apy">
                                  <p className="stake-card-metrics-title">Your UCC Balance</p>
                                  <p className="stake-card-metrics-value">{isAppLoading ? <Skeleton width="80px" /> : <>{trim(Number(yourUCCBalance), 1)} UCC</>}</p>
                                </div>
                              </Grid>
                            </Grid>
                          </div>
                        </Grid>

                        {address && hasAllowance("ucc") ? (
                          <div className="stake-card-area">
                            <div>
                              <div className="stake-card-action-area">
                                <div className="stake-card-action-stage-btns-wrap">
                                  <div className={classnames("stake-card-action-stage", { active: !view })}>
                                    <p>Give Out UCC</p>
                                  </div>
                                </div>

                                <div className="data-row">
                                  <p className="data-row-name">List of Public Addresses</p>
                                </div>
                                <TextField
                                  multiline
                                  label="Address1,Address2,Address3, etc"
                                  variant="outlined"
                                  onChange={handleAddressesChange}
                                  onBlur={checkValidAddresses}
                                  classes={{ root: classes.textField }}
                                  InputProps={{
                                    classes: {
                                      notchedOutline: classes.notchedOutline,
                                    },
                                    className: classes.input,
                                  }}
                                  InputLabelProps={{
                                    style: { color: "rgba(255, 255, 255, 0.6)" },
                                  }}
                                  helperText="Example: 0x12Cf657fc557EDC51E99265d5e13eB9D9bc517Af, 0x15CF4e5746eadd70478cD7Cb6a771F764a351B3A, 0x37a90ea81e00CA9dc86a8568AE7615aAD93906Fb"
                                />
                                {strHasLength(errorMessage) ? (
                                  <div className="data-row">
                                    <p className="data-row-name" style={{ color: "red", backgroundColor: "" }}>
                                      {errorMessage}
                                    </p>
                                  </div>
                                ) : (
                                  <div></div>
                                )}

                                <div className="stake-card-action-row">
                                  <OutlinedInput
                                    type="number"
                                    placeholder="UCC Amount For Each Address"
                                    className="stake-card-action-input"
                                    value={uccSpendForEachAddress}
                                    onChange={e => setUccSpendForEachAddress(e.target.value)}
                                    labelWidth={0}
                                  />

                                  {view === 0 && (
                                    <div className="stake-card-tab-panel">
                                      <div
                                        className="stake-card-tab-panel-btn"
                                        onClick={() => {
                                          if (isPendingTxn(pendingTransactions, "giveout")) return;
                                          onChangeGiveout("giveout");
                                        }}
                                        style={{ backgroundColor: isPendingTxn(pendingTransactions, "giveout") ? "#007500" : "rgba(255, 255, 255, 0.2)" }}
                                      >
                                        {console.log(pendingTransactions)}
                                        <p>{txnButtonText(pendingTransactions, "giveout", "Give Out UCC")}</p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="stake-user-data">
                              <div className="data-row">
                                <p className="data-row-name">Total UCC You Will Spend</p>
                                <p className="data-row-value">{numAddresses * Number(uccSpendForEachAddress)} UCC</p>
                              </div>
                              <div className="data-row">
                                <p className="data-row-name">Current UCC Balance</p>
                                <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>{trim(Number(yourUCCBalance), 1)} UCC</>}</p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div
                              className="stake-card-tab-panel-btn"
                              onClick={() => {
                                if (isPendingTxn(pendingTransactions, "approve_givingout")) return;
                                onSeekApproval("ucc");
                              }}
                              style={{ backgroundColor: isPendingTxn(pendingTransactions, "approve_givingout") ? "#007500" : "rgba(255, 255, 255, 0.2)" }}
                            >
                              <p>{txnButtonText(pendingTransactions, "approve_givingout", "Approve")}</p>
                            </div>
                            <div className="stake-card-action-help-text">
                              {view === 0 && <p>Note: The "Approve" transaction is only needed when giving out UCC for the first time.</p>}
                            </div>
                          </>
                        )}
                      </Grid>
                    </div>
                  </Zoom>
                </div>
              </Modal>
            </Grid>
            {/* <Grid item lg={12} md={12} sm={12} xs={12}>
              <div className="dashboard-card">
                <p className="card-title">To POAP Holders (In-Progress)</p>
              </div>
            </Grid> */}
          </Grid>
        </Zoom>
      </div>
    </div>
  );

  return !address ? connectWallet() : sendOutUCCInterface();
}

export default Giveout;
