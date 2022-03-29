import { SvgIcon, Link } from "@material-ui/core";
import GitHubIcon from "@material-ui/icons/GitHub";
import TwitterIcon from "@material-ui/icons/Twitter";
import TelegramIcon from "@material-ui/icons/Telegram";
import DiscordIcon from "../../../assets/Discord.png";

import { FaDiscord, FaMedium, FaTwitter, FaReddit } from "react-icons/fa";

export default function Social() {
  return (
    <div className="social-row" style={{ backgroundColor: "#ffa74f" }}>
      {" "}
      <Link href="https://github.com/universalcoffeedao" target="_blank">
        <GitHubIcon style={{ color: "#000000", fontSize: "30px" }} />{" "}
      </Link>
      <Link href="https://twitter.com/coffee_unversal" target="_blank">
        <TwitterIcon style={{ color: "#000000", fontSize: "30px" }} />{" "}
      </Link>
      <Link href="https://discord.gg/7D22JUbqPW" target="_blank">
        <img src={DiscordIcon} alt="" style={{ marginTop: "3px", width: "40px", height: "25px" }} />{" "}
      </Link>
    </div>
  );
}
