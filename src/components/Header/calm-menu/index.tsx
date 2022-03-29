import { useState } from "react";
import { getAddresses, TOKEN_DECIMALS, DEFAULT_NETWORK } from "../../../constants";
import { useSelector } from "react-redux";
import { Link, Fade, Popper } from "@material-ui/core";
import "./time-menu.scss";
import { IReduxState } from "../../../store/slices/state.interface";
import { getTokenUrl } from "../../../helpers";

const addTokenToWallet = (tokenSymbol: string, tokenAddress: string) => async () => {
  const tokenImage = getTokenUrl(tokenSymbol.toLowerCase());

  if (window.ethereum) {
    try {
      await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: TOKEN_DECIMALS,
            image: tokenImage,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
};

function CalmMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const isEthereumAPIAvailable = window.ethereum;

  const networkID = useSelector<IReduxState, number>(state => {
    return (state.app && state.app.networkID) || DEFAULT_NETWORK;
  });

  const addresses = getAddresses(networkID);

  const SCALM_ADDRESS = addresses.SCALM_ADDRESS;
  const CALM_ADDRESS = addresses.CALM_ADDRESS;

  const UCC_ADDRESS = addresses.UCC_ADDRESS;

  const handleClick = (event: any) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);

  return (
    <div className="time-menu-root" onMouseEnter={e => handleClick(e)} onMouseLeave={e => handleClick(e)}>
      <div className="time-menu-btn">
        <p>Add UCC</p>
      </div>

      <Popper className="time-menu-popper" open={open} anchorEl={anchorEl} transition>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={200}>
            <div className="tooltip">
              {/* <Link className="tooltip-item" href={`https://www.traderjoexyz.com/#/trade?inputCurrency=&outputCurrency=${CALM_ADDRESS}`} target="_blank">
                                <p>Buy on Trader Joe</p>
                            </Link> */}

              {isEthereumAPIAvailable && (
                <div className="add-tokens">
                  <div className="divider" />
                  <p className="add-tokens-title">ADD TOKEN TO WALLET</p>
                  <div className="divider" />
                  <div className="tooltip-item" onClick={addTokenToWallet("UCC", UCC_ADDRESS)}>
                    <p>UCC</p>
                  </div>
                  {/* <div className="tooltip-item" onClick={addTokenToWallet("SCALM", SCALM_ADDRESS)}>
                    <p>SCALM</p>
                  </div> */}
                </div>
              )}
            </div>
          </Fade>
        )}
      </Popper>
    </div>
  );
}

export default CalmMenu;
