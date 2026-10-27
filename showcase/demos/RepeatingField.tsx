"use client";

import { useState } from "react";
import { TextField, SelectField } from "gui-mellow/Field";
import { KeyValueField, ListField, RepeatingField, type KeyValue } from "gui-mellow/RepeatingField";
import { Example } from "../lib/Example";

interface Port {
  port: string;
  protocol: string;
}

export default function RepeatingFieldDemo() {
  const [hostnames, setHostnames] = useState(["shop.example.org", "www.shop.example.org"]);
  const [env, setEnv] = useState<KeyValue[]>([
    { key: "LOG_LEVEL", value: "info" },
    { key: "TZ", value: "UTC" },
  ]);
  const [command, setCommand] = useState(["npm", "run", "migrate"]);
  const [ports, setPorts] = useState<Port[]>([{ port: "8080", protocol: "TCP" }]);

  return (
    <>
      <Example title="A list of values" description="ListField: one text box to a row.">
        <div style={{ maxWidth: "32rem" }}>
          <ListField
            label="Hostnames"
            values={hostnames}
            onChange={setHostnames}
            placeholder="app.example.org"
            addLabel="Add a hostname"
            hint="Each is served over HTTPS."
          />
        </div>
      </Example>
      <Example title="Key/value pairs" description="KeyValueField, with headings over the columns.">
        <div style={{ maxWidth: "40rem" }}>
          <KeyValueField
            label="Environment variables"
            keyLabel="Name"
            rows={env}
            onChange={setEnv}
            keyPlaceholder="LOG_LEVEL"
            valuePlaceholder="info"
            addLabel="Add a variable"
            empty="None set."
            error={env.some((row) => row.value && !row.key) ? "Every value needs a name." : undefined}
          />
        </div>
      </Example>
      <Example title="Reorderable" description="Where order matters, reorderable adds buttons to move rows up and down.">
        <div style={{ maxWidth: "32rem" }}>
          <ListField
            label="Command"
            values={command}
            onChange={setCommand}
            reorderable
            addLabel="Add a part"
          />
        </div>
      </Example>
      <Example title="Rows of your own" description="RepeatingField takes newRow and renderRow for any shape of row.">
        <div style={{ maxWidth: "36rem" }}>
          <RepeatingField
            label="Ports"
            rows={ports}
            onChange={setPorts}
            columns={["Port", "Protocol"]}
            newRow={() => ({ port: "", protocol: "TCP" })}
            rowLabel={(row, index) => row.port || `port ${index + 1}`}
            max={4}
            addLabel="Add a port"
            hint="Up to four."
            renderRow={(row, index, update) => (
              <>
                <TextField
                  label={`Port ${index + 1}`}
                  hideLabel
                  inputMode="numeric"
                  value={row.port}
                  onChange={(event) => update({ ...row, port: event.target.value })}
                />
                <SelectField
                  label={`Protocol ${index + 1}`}
                  hideLabel
                  value={row.protocol}
                  onChange={(event) => update({ ...row, protocol: event.target.value })}
                  options={[
                    { value: "TCP", label: "TCP" },
                    { value: "UDP", label: "UDP" },
                  ]}
                />
              </>
            )}
          />
        </div>
      </Example>
    </>
  );
}
