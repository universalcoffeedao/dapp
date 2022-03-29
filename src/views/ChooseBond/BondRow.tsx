import { trim } from "../../helpers";
import BondLogo from "../../components/BondLogo";
import { Paper, TableRow, TableCell, Slide, Link } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import "./choosebond.scss";
import { Skeleton } from "@material-ui/lab";
import { IAllBondData } from "../../hooks/bonds";

interface IBondProps {
  bond: IAllBondData;
}

export function BondDataCard({ bond }: IBondProps) {
  const isBondLoading = !bond.bondPrice ?? true;

  return (
    <Slide direction="up" in={true}>
      <Paper className="bond-data-card">
        <div className="bond-pair">
          <BondLogo bond={bond} />
          <div className="bond-name">
            <p className="bond-name-title">{bond.displayName}</p>
            {bond.isLP && (
              <div>
                <Link href={bond.lpUrl} target="_blank">
                  <p className="bond-name-title">View Contract</p>
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="data-row">
          <p className="bond-name-title">Minting Price</p>
          <p className="bond-price bond-name-title">
            <>{isBondLoading ? <Skeleton width="50px" /> : `${trim(bond.bondPrice, 2)} ${bond.displayName}`}</>
          </p>
        </div>

        <div className="data-row">
          <p className="bond-name-title">ROI</p>
          <p className="bond-name-title">{isBondLoading ? <Skeleton width="50px" /> : `${trim(bond.bondDiscount * 100, 2)}%`}</p>
        </div>

        <div className="data-row">
          <p className="bond-name-title">Purchased</p>
          <p className="bond-name-title">
            {isBondLoading ? (
              <Skeleton width="80px" />
            ) : (
              new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
                minimumFractionDigits: 0,
              }).format(bond.purchased)
            )}
          </p>
        </div>
        {bond.bondDiscount && Number(trim(bond.bondDiscount * 100, 2)) > 0 ? (
          <Link component={NavLink} to={`/bonds/${bond.name}`}>
            <div className="bond-table-btn">
              <p>Mint</p>
            </div>
          </Link>
        ) : (
          <div className="bond-table-btn">
            <p style={{ color: "green", textDecoration: "line-through" }}>SOLD OUT</p>
          </div>
        )}
      </Paper>
    </Slide>
  );
}

export function BondTableData({ bond }: IBondProps) {
  const isBondLoading = !bond.bondPrice ?? true;

  return (
    <TableRow>
      <TableCell align="center">
        <div style={{ display: "flex" }}>
          <BondLogo bond={bond} />
          <p className="bond-name-title">{bond.displayName}</p>
        </div>
        <div className="bond-name">
          {bond.isLP && (
            <Link color="primary" href={bond.lpUrl} target="_blank">
              <p className="bond-name-title">View Contract</p>
            </Link>
          )}
        </div>
      </TableCell>
      <TableCell align="center">
        <p className="bond-name-title">
          <>{isBondLoading ? <Skeleton width="50px" /> : `${trim(bond.bondPrice, 2)} ${bond.displayName}`}</>
        </p>
      </TableCell>
      <TableCell align="right">
        <p className="bond-name-title">{isBondLoading ? <Skeleton width="50px" /> : `${trim(bond.bondDiscount * 100, 2)}%`}</p>
      </TableCell>
      <TableCell align="right">
        <p className="bond-name-title">
          {isBondLoading ? (
            <Skeleton width="50px" />
          ) : (
            new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
              minimumFractionDigits: 0,
            }).format(bond.purchased)
          )}
        </p>
      </TableCell>
      <TableCell>
        {bond.bondDiscount && Number(trim(bond.bondDiscount * 100, 2)) > 0 ? (
          <Link component={NavLink} to={`/bonds/${bond.name}`}>
            <div className="bond-table-btn">
              <p>Mint</p>
            </div>
          </Link>
        ) : (
          <div className="bond-table-btn">
            <p style={{ color: "green", textDecoration: "line-through" }}>SOLD OUT</p>
          </div>
        )}
      </TableCell>
    </TableRow>
  );
}
