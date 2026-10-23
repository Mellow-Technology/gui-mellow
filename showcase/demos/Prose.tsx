import { Prose } from "gui-mellow/Prose";
import { Example } from "../lib/Example";

const markdownHtml = `
<h2>Rendered Markdown</h2>
<p>Pass HTML from <strong>remark</strong> or similar with the <code>html</code> prop.</p>
<ul><li>Lists get accent markers</li><li>Links are <a href="#">underlined</a></li></ul>
`;

export default function ProseDemo() {
  return (
    <>
      <Example title="Elements">
        <Prose>
          <h2>Getting set up</h2>
          <p>
            Long-form content needs no classes of its own. <strong>Bold</strong>, <a href="#">links</a> and{" "}
            <code>inline code</code> all look after themselves.
          </p>
          <h3>Before you start</h3>
          <ol>
            <li>Check your machine has enough memory</li>
            <li>Open port 443</li>
          </ol>
          <blockquote>
            <p>Most installs take under ten minutes.</p>
          </blockquote>
          <pre>
            <code>npm run setup -- --region eu-west</code>
          </pre>
          <table>
            <thead>
              <tr>
                <th>Plan</th>
                <th>Nodes</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Community</td>
                <td>3</td>
                <td>Free</td>
              </tr>
              <tr>
                <td>Organisation</td>
                <td>Unlimited</td>
                <td>$40/mo</td>
              </tr>
            </tbody>
          </table>
        </Prose>
      </Example>
      <Example title="From HTML">
        <Prose html={markdownHtml} />
      </Example>
    </>
  );
}
