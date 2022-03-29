import TimeImg from "../assets/tokens/TIME.svg";
import MemoImg from "../assets/tokens/MEMO.png";

function toUrl(tokenPath: string): string {
  const host = window.location.origin;
  return `${host}/${tokenPath}`;
}

export function getTokenUrl(name: string) {
  if (name === "ucc") {
    return toUrl("logo.png");
  }

  if (name === "calm") {
    return toUrl("calmLogo.png");
  }

  if (name === "scalm") {
    return toUrl("sCalmLogo.png");
  }

  throw Error(`Token url doesn't support: ${name}`);
}
