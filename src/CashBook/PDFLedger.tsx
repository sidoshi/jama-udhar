import dayjs from "dayjs";
import type { Entry } from "../store/slices/cashBookSlice";
import { toLocaleRupeeString } from "../utils";
import type { FC, RefObject } from "react";

type PDFLedgerProps = {
  balance: number;
  entries: Array<[Entry | undefined, Entry | undefined]>;
  debitTotal: number;
  creditTotal: number;
  targetRef: RefObject<HTMLDivElement | null>;
};

export const PDFLedger: FC<PDFLedgerProps> = ({
  balance,
  entries,
  debitTotal,
  creditTotal,
  targetRef,
}) => {
  // Split entries into chunks that fit on a page (approximately 25-30 entries per page)
  const entries_PER_PAGE = 20;
  const pageChunks: Array<typeof entries> = [];

  for (let i = 0; i < entries.length; i += entries_PER_PAGE) {
    pageChunks.push(entries.slice(i, i + entries_PER_PAGE));
  }

  const renderTableHeader = () => (
    <thead>
      <tr style={{ backgroundColor: "#f5f5f5" }}>
        <th
          style={{
            border: "1px solid #ddd",
            padding: "14px 10px",
            textAlign: "left",
            fontWeight: "bold",
            width: "25%",
            color: "#000",
          }}
        >
          Account
        </th>
        <th
          style={{
            border: "1px solid #ddd",
            padding: "14px 10px",
            textAlign: "right",
            fontWeight: "bold",
            width: "25%",
            color: "#000",
          }}
        >
          Debit + જમા
        </th>
        <th
          style={{
            border: "1px solid #ddd",
            padding: "14px 10px",
            textAlign: "left",
            fontWeight: "bold",
            width: "25%",
            color: "#000",
          }}
        >
          Account
        </th>
        <th
          style={{
            border: "1px solid #ddd",
            padding: "14px 10px",
            textAlign: "right",
            fontWeight: "bold",
            width: "25%",
            color: "#000",
          }}
        >
          Credit - ઉધાર
        </th>
      </tr>
    </thead>
  );

  const renderTableentries = (pageentries: typeof entries) => (
    <tbody>
      {pageentries.map(([debitAccount, creditAccount], index) => (
        <tr
          key={index}
          style={{
            backgroundColor: index % 2 === 0 ? "#fff" : "#f9f9f9",
          }}
        >
          <td
            style={{
              border: "1px solid #ddd",
              padding: "12px 10px",
              color: "#000",
            }}
          >
            {debitAccount?.account || ""}
          </td>
          <td
            style={{
              border: "1px solid #ddd",
              padding: "12px 10px",
              textAlign: "right",
              color: "#000",
            }}
          >
            {debitAccount
              ? `+ ${toLocaleRupeeString(debitAccount.amount)}`
              : ""}
          </td>
          <td
            style={{
              border: "1px solid #ddd",
              padding: "12px 10px",
              color: "#000",
            }}
          >
            {creditAccount?.account || ""}
          </td>
          <td
            style={{
              border: "1px solid #ddd",
              padding: "12px 10px",
              textAlign: "right",
              color: "#000",
            }}
          >
            {creditAccount
              ? `- ${toLocaleRupeeString(Math.abs(creditAccount.amount))}`
              : ""}
          </td>
        </tr>
      ))}
    </tbody>
  );

  const renderTotalsTable = () => (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        fontSize: "16px",
      }}
    >
      {renderTableHeader()}
      <tbody>
        <tr
          style={{
            backgroundColor: "#f0f0f0",
            fontWeight: "bold",
            borderTop: "2px solid #333",
          }}
        >
          <td
            style={{
              border: "1px solid #ddd",
              padding: "14px 10px",
              fontWeight: "bold",
              color: "#000",
            }}
          >
            Total
          </td>
          <td
            style={{
              border: "1px solid #ddd",
              padding: "14px 10px",
              textAlign: "right",
              color: "#000",
              fontWeight: "bold",
            }}
          >
            + {toLocaleRupeeString(debitTotal)}
          </td>
          <td
            style={{
              border: "1px solid #ddd",
              padding: "14px 10px",
              fontWeight: "bold",
              color: "#000",
            }}
          >
            Total
          </td>
          <td
            style={{
              border: "1px solid #ddd",
              padding: "14px 10px",
              textAlign: "right",
              color: "#000",
              fontWeight: "bold",
            }}
          >
            - {toLocaleRupeeString(Math.abs(creditTotal))}
          </td>
        </tr>
      </tbody>
    </table>
  );

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "210mm", // A4 width
        minHeight: "297mm", // A4 height
        zIndex: -9999,
        opacity: 0, // Invisible but still rendered
        pointerEvents: "none", // Doesn't interfere with clicks
      }}
    >
      <div className="pdf-container" ref={targetRef}>
        <div
          style={{
            fontFamily: "Arial, sans-serif",
            maxWidth: "800px",
            margin: "0 auto",
            backgroundColor: "#fff",
            color: "#000",
          }}
        >
          {pageChunks.map((pageentries, pageIndex) => (
            <div
              key={pageIndex}
              style={{
                padding: "20px",
                height: "297mm",
                pageBreakBefore: pageIndex > 0 ? "always" : "auto",
              }}
            >
              {/* Repeat header on subsequent pages */}
              <div
                className="no-page-break"
                style={{
                  textAlign: "center",
                  marginBottom: "30px",
                  borderBottom: "2px solid #333",
                  paddingBottom: "15px",
                }}
              >
                <h1
                  style={{
                    margin: "0 0 10px 0",
                    fontSize: "32px",
                    color: "#000",
                  }}
                >
                  Ledger
                </h1>
                <p
                  style={{
                    margin: "0",
                    fontSize: "20px",
                    color: "#000",
                    fontWeight: "bold",
                  }}
                >
                  Balance: {balance >= 0 ? "+ " : "- "}
                  {toLocaleRupeeString(Math.abs(balance))}
                </p>
                <p
                  style={{
                    margin: "5px 0 0 0",
                    fontSize: "14px",
                    color: "#333",
                  }}
                >
                  Generated on ({dayjs().format("YYYY-MM-DD")})
                </p>
              </div>

              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "16px",
                }}
              >
                {renderTableHeader()}
                {renderTableentries(pageentries)}
              </table>
            </div>
          ))}

          {/* Totals table on the last page */}
          <div style={{ padding: "20px" }}>{renderTotalsTable()}</div>
        </div>
      </div>
    </div>
  );
};
