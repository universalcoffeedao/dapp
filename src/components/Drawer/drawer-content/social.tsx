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
      <Link href="https://twitter.com/coffeedao_eth" target="_blank">
        <TwitterIcon style={{ color: "#000000", fontSize: "30px" }} />{" "}
      </Link>
      <Link href="https://discord.gg/7D22JUbqPW" target="_blank">
        <FaDiscord style={{ marginTop: "3px", width: "40px", height: "25px", color: "#000000" }} />{" "}
      </Link>
      <Link href="https://medium.com/@universalcoffeecoin/introducing-universalcoffeedao-ea64c87be613" target="_blank">
        <FaMedium style={{ marginTop: "3px", width: "40px", height: "25px", color: "#000000" }} />
      </Link>
    </div>
  );
}
