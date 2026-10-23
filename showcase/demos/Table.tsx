import { Table } from "gui-mellow/Table";
import { Example } from "../lib/Example";

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const nodes = [
  { name: "atlas-01", region: "us-central", cores: 32, cost: 412.5, since: "2024-03-02" },
  { name: "borealis", region: "eu-north", cores: 8, cost: 96, since: "2025-01-17" },
  { name: "cirrus-7", region: "us-east", cores: 64, cost: 1208.25, since: "2023-11-20" },
  { name: "drift", region: "ap-south", cores: 16, cost: 230.8, since: "2025-06-05" },
];

export default function TableDemo() {
  return (
    <>
      <Example title="Office hours">
        <Table
          columns={["Day", "Open", "Close"]}
          rows={[
            ["Monday", "8:00 AM", "6:00 PM"],
            ["Tuesday", "8:00 AM", "6:00 PM"],
            ["Saturday", "9:00 AM", "1:00 PM"],
          ]}
        />
      </Example>
      <Example title="With caption">
        <Table
          caption="Prices are estimates and may vary."
          columns={["Procedure", { label: "Price", numeric: true }]}
          rows={[
            ["Exam", "$85"],
            ["Filling", "$150 – $250"],
          ]}
        />
      </Example>
      <Example
        title="Sortable, with numeric columns"
        description="Numeric columns align right in even-width figures. Cells given as { value, display } sort by value and show display."
      >
        <Table
          columns={[
            { label: "Node", sortable: true },
            "Region",
            { label: "Cores", numeric: true, sortable: true },
            { label: "Monthly", numeric: true, sortable: true },
            { label: "Since", sortable: true },
          ]}
          defaultSort={{ column: 3, direction: "descending" }}
          rows={nodes.map((node) => [
            node.name,
            node.region,
            node.cores,
            { value: node.cost, display: usd.format(node.cost) },
            {
              value: node.since,
              display: new Date(node.since).toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" }),
            },
          ])}
        />
      </Example>
    </>
  );
}
