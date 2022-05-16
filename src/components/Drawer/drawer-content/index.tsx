import { useCallback, useState } from "react";
import { NavLink } from "react-router-dom";
import Social from "./social";
import Arrows from "../../../assets/icons/arrows.svg";
import Hamburger from "../../../assets/icons/settings.svg";
import BondIcon from "../../../assets/icons/bond.svg";
import Icon from "../../../assets/logo.png";
import DashboardIcon from "../../../assets/icons/dashboard.svg";
import Giveaway from "../../../assets/icons/giveaway.svg";
import Buy from "../../../assets/icons/buy.svg";
import Report from "../../../assets/icons/report.svg";

import { shorten } from "../../../helpers";
import { useAddress } from "../../../hooks";
import useBonds from "../../../hooks/bonds";
import { Button, Link, Typography } from "@material-ui/core";
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
    if (currentPath.indexOf("flat-sale") >= 0 && page === "flat-sale") {
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

        {address && (
          <div className="wallet-link">
            <Link href={`https://polygonscan.com/address/${address}`} target="_blank">
              <p>{shorten(address)}</p>
            </Link>
          </div>
        )}
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

          <Link
            component={NavLink}
            to="/flat-sale"
            isActive={(match: any, location: any) => {
              return checkPage(location, "flat-sale");
            }}
            className={classnames("button-dapp-menu", { active: isActive })}
            style={{ textDecoration: "none" }}
          >
            <div className="dapp-menu-item">
              <img alt="" src={Buy} />
              <p>Buy UCC</p>
            </div>
          </Link>
          <Link
            href="https://app.uniswap.org/#/swap?chain=polygon&inputCurrency=0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063&outputCurrency=0x35C3c8096CDe3c13a565b68d17b9Bf1f9836B9eB"
            target="_blank"
            className={classnames("button-dapp-menu", { active: isActive })}
          >
            <div className="dapp-menu-item">
              <img alt="" src={Arrows} />
              <p>Buy on Uniswap</p>
            </div>
          </Link>
          <Link component={NavLink} to="/give-out" className={classnames("button-dapp-menu", { active: isActive })}>
            <div className="dapp-menu-item">
              <img alt="" src={Giveaway} />
              <p>Give out UCC</p>
            </div>
          </Link>
          <Link href="https://www.universalcoffee.xyz/assets/whitePaper.93a63cb7.pdf" target="_blank" className={classnames("button-dapp-menu", { active: isActive })}>
            <div className="dapp-menu-item">
              <img alt="" src={Report} />
              <p>White Paper</p>
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
