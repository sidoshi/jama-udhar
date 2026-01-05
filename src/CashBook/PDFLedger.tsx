import dayjs from "dayjs";
import type { Entry } from "../store/slices/cashBookSlice";
import { toLocaleRupeeString } from "../utils";
import type { FC, RefObject } from "react";
import { useAppStore } from "../store";

type PDFLedgerProps = {
  balance: number;
  entries: Array<[Entry | undefined, Entry | undefined]>;
  debitTotal: number;
  creditTotal: number;
  targetRef: RefObject<HTMLDivElement | null>;
};

export const PDFLedger: FC<PDFLedgerProps> = ({
  entries,
  debitTotal,
  creditTotal,
  targetRef,
}) => {
  const activeDate = useAppStore((state) => state.activeDate);
  // Split entries into chunks that fit on a page (approximately 25-30 entries per page)
  const entries_PER_PAGE = 24;
  const entriesWithTotal = [
    ...entries,
    [
      { id: "creditTotal", account: "Total", amount: creditTotal } as Entry,
      { id: "debitTotal", account: "Total", amount: debitTotal } as Entry,
    ] as [Entry, Entry],
  ];
  const pageChunks: Array<typeof entries> = [];

  for (let i = 0; i < entriesWithTotal.length; i += entries_PER_PAGE) {
    pageChunks.push(entriesWithTotal.slice(i, i + entries_PER_PAGE));
  }

  const renderTableHeader = () => (
    <thead>
      <tr style={{ backgroundColor: "#f5f5f5" }}>
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
          Account
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
          Credit + જમા
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
          Account
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
          Debit - ઉધાર
        </th>
      </tr>
    </thead>
  );

  const renderTableentries = (pageentries: typeof entries) => (
    <tbody>
      {pageentries.map(([creditAccount, debitAccount], index) => (
        <tr
          key={index}
          style={{
            backgroundColor: index % 2 === 0 ? "#fff" : "#f9f9f9",
          }}
        >
          <td
            style={{
              border: "1px solid #ddd",
              padding: "8px 9px",
              color: "#000",
              textAlign: "right",
            }}
          >
            {creditAccount?.account || ""}
          </td>
          <td
            style={{
              border: "1px solid #ddd",
              padding: "8px 9px",
              textAlign: "left",
              color: "#000",
            }}
          >
            {creditAccount
              ? `${toLocaleRupeeString(creditAccount.amount)}`
              : ""}
          </td>
          <td
            style={{
              border: "1px solid #ddd",
              padding: "8px 9px",
              color: "#000",
              textAlign: "right",
            }}
          >
            {debitAccount?.account || ""}
          </td>
          <td
            style={{
              border: "1px solid #ddd",
              padding: "8px 9px",
              textAlign: "left",
              color: "#000",
            }}
          >
            {debitAccount
              ? `- ${toLocaleRupeeString(Math.abs(debitAccount.amount))}`
              : ""}
          </td>
        </tr>
      ))}
    </tbody>
  );

  return (
    <div
      style={{
        position: "absolute",
        top: "-9999px",
        left: "-9999px",
        width: "210mm",
        backgroundColor: "#fff",
      }}
    >
      <div ref={targetRef}>
        <div
          style={{
            fontFamily: "Arial, sans-serif",
            width: "100%",
            backgroundColor: "#fff",
            color: "#000",
          }}
        >
          {pageChunks.map((pageentries, pageIndex) => (
            <div
              key={pageIndex}
              style={{
                padding: "20px",
                minHeight: "297mm",
              }}
            >
              <div
                style={{
                  textAlign: "center",
                  marginBottom: "10px",
                  borderBottom: "2px solid #333",
                  paddingBottom: "10px",
                }}
              >
                <p
                  style={{
                    margin: "5px 0 0 0",
                    fontSize: "14px",
                    color: "#333",
                  }}
                >
                  ({dayjs(activeDate).format("YYYY-MM-DD")})
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
        </div>
      </div>
    </div>
  );
};
