"use client";

import { useState } from "react";
import { SegmentedControl } from "gui-mellow/SegmentedControl";
import { Example } from "../lib/Example";

type Period = "day" | "week" | "month";

export default function SegmentedControlDemo() {
  const [period, setPeriod] = useState<Period>("week");

  return (
    <>
      <Example title="Controlled" description={`Selected: ${period}`}>
        <SegmentedControl<Period>
          label="Period"
          value={period}
          onChange={setPeriod}
          options={[
            { value: "day", label: "Day" },
            { value: "week", label: "Week" },
            { value: "month", label: "Month" },
          ]}
        />
      </Example>
      <Example title="In a form" description="Uncontrolled radios, submitted with the form.">
        <form>
          <SegmentedControl
            label="Audience"
            name="audience"
            size="sm"
            defaultValue="business"
            options={[
              { value: "business", label: "Business" },
              { value: "technical", label: "Technical" },
            ]}
          />
        </form>
      </Example>
    </>
  );
}
