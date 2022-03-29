import { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Grid, OutlinedInput, Zoom } from "@material-ui/core";
import { trim } from "../../helpers";
import { buyUCC } from "../../store/slices/app-slice";
import { changeApproval } from "../../store/slices/presale-thunk";
import "./stake.scss";
import { useWeb3Context } from "../../hooks";
import { IPendingTxn, isPendingTxn, txnButtonText } from "../../store/slices/pending-txns-slice";
import { Skeleton } from "@material-ui/lab";
import { IReduxState } from "../../store/slices/state.interface";
import { messages } from "../../constants/messages";
import classnames from "classnames";
import { warning } from "../../store/slices/messages-slice";

function PreSale() {
  const dispatch = useDispatch();
  const { provider, address, connect, chainID, checkWrongNetwork } = useWeb3Context();

  const [view, setView] = useState(0);
  const [quantity, setQuantity] = useState<string>("");

  const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);

  const calmBalance = useSelector<IReduxState, string>(state => {
    return state.account.balances && state.account.balances.calm;
  });
  const scalmBalance = useSelector<IReduxState, string>(state => {
    return state.account.balances && state.account.balances.scalm;
  });

  const yourDaiBalance = useSelector<IReduxState, string>(state => {
    return state.account.balances && state.account.balances.dai;
  });

  const salesProceedDaiBalance = useSelector<IReduxState, string>(state => {
    return state.account.balances && state.account.balances.salesProceedDai;
  });

  const pendingTransactions = useSelector<IReduxState, IPendingTxn[]>(state => {
    return state.pendingTransactions;
  });

  const uccPrice = useSelector<IReduxState, number>(state => {
    return state.app.uccPrice;
  });

  const uccPurchaseLimit = useSelector<IReduxState, number>(state => {
    return state.app.uccPurchaseLimit;
  });

  const daiAllowance = useSelector<IReduxState, number>(state => {
    return state.account.ucc.dai;
  });

  const yourUCCBalance = useSelector<IReduxState, string>(state => {
    return state.account.balances && state.account.balances.ucc;
  });

  const onSeekApproval = async (token: string) => {
    if (await checkWrongNetwork()) return;

    await dispatch(changeApproval({ address, token, provider, networkID: chainID }));
  };

  const onChangeBuy = async (action: string) => {
    if (await checkWrongNetwork()) return;
    if (quantity === "" || parseFloat(quantity) === 0) {
      dispatch(warning({ text: action === "buy" ? messages.before_buying : messages.before_swapping }));
    } else {
      await dispatch(buyUCC({ address, action, value: String(quantity), provider, networkID: chainID }));
      setQuantity("");
    }
  };

  const hasAllowance = useCallback(
    token => {
      if (token === "ucc") return daiAllowance > 0;
      return 0;
    },
    [daiAllowance],
  );

  const changeView = (newView: number) => () => {
    setView(newView);
    setQuantity("");
  };

  const trimmedsDaiBalance = trim(Number(yourDaiBalance) / Math.pow(10, 9), 2);

  const trimmedSalesProceedDaiBalance = trim(Number(salesProceedDaiBalance) / Math.pow(10, 9), 3);
  const formattedUCCPrice = new Intl.NumberFormat("en-US").format(Number(uccPrice) / Math.pow(10, 9));
  const numUCCSold = Number(trimmedSalesProceedDaiBalance) / Number(formattedUCCPrice);

  return (
    <div className="stake-view">
      <Zoom in={true}>
        <div className="stake-card">
          <Grid className="stake-card-grid" container direction="column" spacing={2}>
            <Grid item>
              <div className="stake-card-header">
                <p className="stake-card-header-title">UCC PreSale (☕, ☕)</p>
              </div>
              <div className="stake-card-header">
                {numUCCSold > 0 ? <p className="stake-card-header-subtitle"> {numUCCSold} / 10000 Sold!</p> : <p className="stake-card-header-subtitle">Limited Supply</p>}
              </div>
            </Grid>

            <Grid item>
              <div className="stake-card-metrics">
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4} md={4} lg={4}>
                    <div className="stake-card-apy">
                      <p className="stake-card-metrics-title">UCC Price</p>
                      <p className="stake-card-metrics-value">{uccPrice ? <>${formattedUCCPrice} USD</> : <Skeleton width="150px" />}</p>
                    </div>
                  </Grid>

                  <Grid item xs={6} sm={4} md={4} lg={4}>
                    <div className="stake-card-tvl">
                      <p className="stake-card-metrics-title">Your DAI Balance</p>
                      <p className="stake-card-metrics-value">{trimmedsDaiBalance}</p>
                    </div>
                  </Grid>

                  <Grid item xs={6} sm={4} md={4} lg={4}>
                    <div className="stake-card-index">
                      <p className="stake-card-metrics-title">Max You Can Buy</p>
                      <p className="stake-card-metrics-value">{uccPurchaseLimit ? <>{trim(Number(uccPurchaseLimit) - 1, 2)} UCCs</> : <Skeleton width="150px" />}</p>
                    </div>
                  </Grid>
                </Grid>
              </div>
            </Grid>

            <div className="stake-card-area">
              {!address && (
                <div className="stake-card-wallet-notification">
                  <div className="stake-card-wallet-connect-btn" onClick={connect}>
                    <p>Connect Wallet</p>
                  </div>
                  <p className="stake-card-wallet-desc-text">Connect your wallet to stake CALM tokens!</p>
                </div>
              )}
              {address && (
                <div>
                  <div className="stake-card-action-area">
                    <div className="stake-card-action-stage-btns-wrap">
                      <div onClick={changeView(0)} className={classnames("stake-card-action-stage-btn", { active: !view })}>
                        <p>Buy UCC</p>
                      </div>
                      {/* <div onClick={changeView(1)} className={classnames("stake-card-action-stage-btn", { active: view })}>
                                                <p>Unstake</p>
                                            </div> */}
                    </div>

                    <div className="stake-card-action-row">
                      <OutlinedInput
                        type="number"
                        placeholder="UCC Amount"
                        className="stake-card-action-input"
                        value={quantity}
                        onChange={e => setQuantity(e.target.value)}
                        labelWidth={0}
                      />

                      {view === 0 && (
                        <div className="stake-card-tab-panel">
                          {address && hasAllowance("ucc") ? (
                            <div
                              className="stake-card-tab-panel-btn"
                              onClick={() => {
                                if (isPendingTxn(pendingTransactions, "buying")) return;
                                onChangeBuy("buy");
                              }}
                            >
                              <p>{txnButtonText(pendingTransactions, "buying", "Buy UCC")}</p>
                            </div>
                          ) : (
                            <div
                              className="stake-card-tab-panel-btn"
                              onClick={() => {
                                if (isPendingTxn(pendingTransactions, "approve_staking")) return;
                                onSeekApproval("ucc");
                              }}
                            >
                              <p>{txnButtonText(pendingTransactions, "approve_staking", "Approve")}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="stake-card-action-help-text">
                      {address && !hasAllowance("ucc") && view === 0 && <p>Note: The "Approve" transaction is only needed when buying UCC for the first time.</p>}
                    </div>
                  </div>

                  <div className="stake-user-data">
                    <div className="data-row">
                      <p className="data-row-name">Your Balance</p>
                      <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>{trim(Number(yourUCCBalance), 4)} UCC</>}</p>
                    </div>

                    {/* <div className="data-row">
                      <p className="data-row-name">Your Staked Balance</p>
                      <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>{trimmedsCalmBalance} SCALM</>}</p>
                    </div>

                    <div className="data-row">
                      <p className="data-row-name">Next Reward Amount</p>
                      <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>{nextRewardValue} SCALM</>}</p>
                    </div>

                    <div className="data-row">
                      <p className="data-row-name">Next Reward Yield</p>
                      <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>{stakingRebasePercentage}%</>}</p>
                    </div>

                    <div className="data-row">
                      <p className="data-row-name">ROI (5-Day Rate)</p>
                      <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>{trim(Number(fiveDayRate) * 100, 4)}%</>}</p>
                    </div> */}
                  </div>
                </div>
              )}
            </div>
          </Grid>
        </div>
      </Zoom>
    </div>
  );
}

export default PreSale;
