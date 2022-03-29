import { AppBar, Toolbar, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import MenuIcon from "../../assets/logo.svg";
import TimeMenu from "./calm-menu";
import ConnectButton from "./connect-button";
import WrapButton from "./wrap-button";
import "./header.scss";
import { DRAWER_WIDTH, TRANSITION_DURATION } from "../../constants/style";

interface IHeader {
  handleDrawerToggle: () => void;
  drawe: boolean;
}

const useStyles = makeStyles(theme => ({
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: "100%",
      padding: "20px 0 30px 0",
    },
    justifyContent: "flex-end",
    alignItems: "flex-end",
    background: "transparent",
    backdropFilter: "none",
    zIndex: 10,
  },
  topBar: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: TRANSITION_DURATION,
    }),
    marginLeft: DRAWER_WIDTH,
  },
  topBarShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: TRANSITION_DURATION,
    }),
    marginLeft: 0,
  },
}));

function Header({ handleDrawerToggle, drawe }: IHeader) {
  const classes = useStyles();
  const isVerySmallScreen = useMediaQuery("(max-width: 400px)");
  const isWrapShow = useMediaQuery("(max-width: 480px)");

  return (
    <div className={`${classes.topBar} ${!drawe && classes.topBarShift}`}>
      <AppBar position="sticky" className={classes.appBar} elevation={0}>
        <Toolbar disableGutters className="dapp-topbar">
          <div onClick={handleDrawerToggle} className="dapp-topbar-slider-btn">
            <div style={{ display: "flex", alignItems: "center" }}>
              <img alt="" src={MenuIcon} style={{ width: "40px", height: "40px" }} />
              <Typography variant="subtitle1" color="primary" style={{ color: "#ffa74f", fontSize: "24px", fontWeight: "bold", marginLeft: "8px", textDecoration: "none" }}>
                UniversalCoffeeDAO
              </Typography>
            </div>{" "}
          </div>
          <div className="dapp-topbar-btns-wrap">
            {!isVerySmallScreen && <TimeMenu />}
            {/* {!isWrapShow && <WrapButton />} */}
            <ConnectButton />
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Header;
