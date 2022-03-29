import { useSelector } from "react-redux";
import { Grid, Zoom } from "@material-ui/core";
import { trim } from "../../helpers";
import "./dashboard.scss";
import { Skeleton } from "@material-ui/lab";
import { IReduxState } from "../../store/slices/state.interface";
import { IAppSlice } from "../../store/slices/app-slice";

function Dashboard() {
  const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);
  const app = useSelector<IReduxState, IAppSlice>(state => state.app);

  const trimmedStakingAPY = trim(app.stakingAPY * 100, 1);

  const yourUCCBalance = useSelector<IReduxState, string>(state => {
    return state.account.balances && state.account.balances.ucc;
  });

  return (
    <div className="dashboard-view">
      <div className="dashboard-infos-wrap">
        <Zoom in={true}>
          <Grid container spacing={4}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <div className="dashboard-card">
                <p className="card-title">UCC Market Price</p>
                {/* <p className="card-value">{isAppLoading ? <Skeleton width="100px" /> : `$${trim(app.marketPrice, 2)}`}</p> */}
                <p className="card-value">{isAppLoading ? <Skeleton width="100px" /> : `$0.08`}</p>
              </div>
            </Grid>

            <Grid item lg={12} md={12} sm={12} xs={12}>
              <div className="dashboard-card">
                <p className="card-title">Market Cap</p>
                {/* <p className="card-value">
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
                </p> */}
                <p className="card-value">{isAppLoading ? <Skeleton width="160px" /> : `$1,325,439`}</p>
              </div>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <div className="dashboard-card">
                <p className="card-title">Your UCC Balance</p>
                <p className="card-value">{isAppLoading ? <Skeleton width="160px" /> : trim(Number(yourUCCBalance), 4)} UCC</p>
              </div>
            </Grid>

            {/* <Grid item lg={6} md={6} sm={6} xs={12}>
                            <div className="dashboard-card">
                                <p className="card-title">Supply (Staked/Total)</p>
                                <p className="card-value">
                                    {isAppLoading ? (
                                        <Skeleton width="250px" />
                                    ) : (
                                        `${new Intl.NumberFormat("en-US", {
                                            maximumFractionDigits: 0,
                                            minimumFractionDigits: 0,
                                        }).format(app.circSupply)}
                                        /
                                        ${new Intl.NumberFormat("en-US", {
                                            maximumFractionDigits: 0,
                                            minimumFractionDigits: 0,
                                        }).format(app.totalSupply)}`
                                    )}
                                </p>
                            </div>
                        </Grid> */}

            {/* <Grid item lg={6} md={6} sm={6} xs={12}>
              <div className="dashboard-card">
                <p className="card-title">TVL</p>
                <p className="card-value">
                  {isAppLoading ? (
                    <Skeleton width="250px" />
                  ) : (
                    new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                      minimumFractionDigits: 0,
                    }).format(app.stakingTVL)
                  )}
                </p>
              </div>
            </Grid> */}

            {/* <Grid item lg={6} md={6} sm={6} xs={12}>
              <div className="dashboard-card">
                <p className="card-title">APY</p>
                <p className="card-value">{isAppLoading ? <Skeleton width="250px" /> : `${new Intl.NumberFormat("en-US").format(Number(trimmedStakingAPY))}%`}</p>
              </div>
            </Grid> */}

            {/* <Grid item lg={6} md={6} sm={6} xs={12}>
              <div className="dashboard-card">
                <p className="card-title">Current Index</p>
                <p className="card-value">{isAppLoading ? <Skeleton width="250px" /> : `${trim(Number(app.currentIndex), 2)} CALM`}</p>
              </div>
            </Grid> */}

            {/* <Grid item lg={6} md={6} sm={6} xs={12}>
              <div className="dashboard-card">
                <p className="card-title">Treasury Balance</p>
                <p className="card-value">
                  {isAppLoading ? (
                    <Skeleton width="250px" />
                  ) : (
                    new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                      minimumFractionDigits: 0,
                    }).format(app.treasuryBalance)
                  )}
                </p>
              </div>
            </Grid> */}

            {/* <Grid item lg={6} md={6} sm={6} xs={12}>
              <div className="dashboard-card">
                <p className="card-title">Backing per $CALM</p>
                <p className="card-value">
                  {isAppLoading ? (
                    <Skeleton width="250px" />
                  ) : (
                    new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                      minimumFractionDigits: 0,
                    }).format(app.rfv)
                  )}
                </p>
              </div>
            </Grid> */}

            {/* <Grid item lg={6} md={6} sm={6} xs={12}>
              <div className="dashboard-card">
                <p className="card-title">Runway</p>
                <p className="card-value">{isAppLoading ? <Skeleton width="250px" /> : `${trim(Number(app.runway), 1)} Days`}</p>
              </div>
            </Grid> */}
          </Grid>
        </Zoom>
      </div>
    </div>
  );
}

export default Dashboard;
