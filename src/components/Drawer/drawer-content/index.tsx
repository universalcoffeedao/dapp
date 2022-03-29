import { useCallback, useState } from "react";
import { NavLink } from "react-router-dom";
import Social from "./social";
import Arrows from "../../../assets/icons/arrows.svg";
import Hamburger from "../../../assets/icons/settings.svg";
import StakeIcon from "../../../assets/icons/stake.svg";
import BondIcon from "../../../assets/icons/bond.svg";
import Icon from "../../../assets/logo.png";
import DashboardIcon from "../../../assets/icons/dashboard.svg";
import { trim, shorten } from "../../../helpers";
import { useAddress } from "../../../hooks";
import useBonds from "../../../hooks/bonds";
import { Button, Link, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import "./drawer-content.scss";
import GlobeIcon from "../../../assets/icons/wonderglobe.svg";
import classnames from "classnames";

function NavContent() {
  const [isActive] = useState();
  const address = useAddress();
  const { bonds } = useBonds();

  const checkPage = useCallback((location: any, page: string): boolean => {
    const currentPath = location.pathname.replace("/", "");
    if (currentPath.indexOf("dashboard") >= 0 && page === "dashboard") {
      return true;
    }
    if (currentPath.indexOf("stake") >= 0 && page === "stake") {
      return true;
    }
    if (currentPath.indexOf("bonds") >= 0 && page === "bonds") {
      return true;
    }
    if (currentPath.indexOf("pre-sale") >= 0 && page === "pre-sale") {
      return true;
    }
    if (currentPath.indexOf("calculator") >= 0 && page === "calculator") {
      return true;
    }
    return false;
  }, []);

  return (
    <div className="dapp-sidebar">
      <div className="branding-header">
        <Link href="https://app.universalcoffee.xyz" target="_blank">
          <div style={{ display: "flex", alignItems: "center" }}>
            <img alt="" src={Icon} style={{ width: "40px", height: "40px" }} />
            <Typography variant="subtitle1" color="primary" style={{ color: "#ffa74f", fontSize: "24px", fontWeight: "bold", marginLeft: "8px", textDecoration: "none" }}>
              UniversalCoffeeDAO
            </Typography>
          </div>
        </Link>

        {/* {address && (
          <div className="wallet-link">
            <Link href={`https://cchain.explorer.avax.network/address/${address}`} target="_blank">
              <p>{shorten(address)}</p>
            </Link>
          </div>
        )} */}
      </div>

      <div className="dapp-menu-links">
        <div className="dapp-nav">
          <Link
            component={NavLink}
            to="/dashboard"
            isActive={(match: any, location: any) => {
              return checkPage(location, "dashboard");
            }}
            className={classnames("button-dapp-menu", { active: isActive })}
            style={{ textDecoration: "none" }}
          >
            <div className="dapp-menu-item">
              <img alt="" src={DashboardIcon} />
              <p>Dashboard</p>
            </div>
          </Link>

          {/* <Link
            component={NavLink}
            to="/stake"
            isActive={(match: any, location: any) => {
              return checkPage(location, "stake");
            }}
            className={classnames("button-dapp-menu", { active: isActive })}
            style={{ textDecoration: "none" }}
          >
            <div className="dapp-menu-item">
              <img alt="" src={StakeIcon} />
              <p>Stake CALM</p>
            </div>
          </Link> */}

          {/* <Link
            component={NavLink}
            id="bond-nav"
            to="/bonds"
            isActive={(match: any, location: any) => {
              return checkPage(location, "bonds");
            }}
            className={classnames("button-dapp-menu", { active: isActive })}
          >
            <div className="dapp-menu-item">
              <img alt="" src={Hamburger} />
              <p>Mint CALM</p>
            </div>
          </Link> */}

          {/* <div className="bond-discounts">
            <p>Minting discounts</p>
            {bonds.map((bond, i) => (
              <Link component={NavLink} to={bond.bondDiscount && Number(trim(bond.bondDiscount * 100, 2)) > 0 ? `/bonds/${bond.name}` : `/bonds`} key={i} className={"bond"}>
                {!bond.bondDiscount ? (
                  <Skeleton variant="text" width={"150px"} />
                ) : (
                  <p>
                    {bond.displayName}
                    {bond.bondDiscount && Number(trim(bond.bondDiscount * 100, 2)) > 0 ? (
                      <span className="bond-pair-roi">{trim(bond.bondDiscount * 100, 2)}%</span>
                    ) : (
                      <span className="bond-pair-roi" style={{ color: "green", textDecoration: "line-through" }}>
                        SOLD OUT!
                      </span>
                    )}
                  </p>
                )}
              </Link>
            ))}
          </div> */}

          {/* <Link
            component={NavLink}
            to="/pre-sale"
            isActive={(match: any, location: any) => {
              return checkPage(location, "pre-sale");
            }}
            className={classnames("button-dapp-menu", { active: isActive })}
            style={{ textDecoration: "none" }}
          >
            <div className="dapp-menu-item">
              <img alt="" src={StakeIcon} />
              <p>PreSale</p>
            </div>
          </Link> */}
          <Link
            href="https://quickswap.exchange/#/swap?inputCurrency=&outputCurrency=0x35C3c8096CDe3c13a565b68d17b9Bf1f9836B9eB"
            target="_blank"
            className={classnames("button-dapp-menu", { active: isActive })}
          >
            <div className="dapp-menu-item">
              <img alt="" src={Arrows} />
              <p>Buy on QuickSwap</p>
            </div>
          </Link>

          {/* <Link
                        component={NavLink}
                        to="/calculator"
                        isActive={(match: any, location: any) => {
                            return checkPage(location, "calculator");
                        }}
                        className={classnames("button-dapp-menu", { active: isActive })}
                    >
                        <div className="dapp-menu-item">
                            <img alt="" src={GlobeIcon} />
                            <p>Calculator</p>
                        </div>
                    </Link> */}
        </div>
      </div>
      <div className="dapp-menu-doc-link">
        <Link href="https://docs.universalcoffee.xyz/" target="_blank">
          <img alt="" src={BondIcon} />
          <p>Docs</p>
        </Link>
      </div>
      <Social />
    </div>
  );
}

export default NavContent;
