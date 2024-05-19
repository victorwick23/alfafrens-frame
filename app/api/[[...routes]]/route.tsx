/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from "frog";
import { devtools } from "frog/dev";
// import { neynar } from "frog/hubs";
import { handle } from "frog/next";
import { serveStatic } from "frog/serve-static";
import { Box, Heading, Text, HStack, VStack, vars, Image } from "./ui";
// import { neynar } from "frog/middlewares";
import { createNeynar } from "frog/middlewares";

// import { neynar } from "frog/middlewares";

const neynarApiKey = process.env.NEXT_NEYNAR_API_KEY || "default_api_key";
const neynar = createNeynar({ apiKey: neynarApiKey });
// const neynarMiddleware = neynar({
//   apiKey: neynarApiKey,
//   features: ["interactor", "cast"],
// });

const app = new Frog({
  assetsPath: "/",
  basePath: "/api",
  imageOptions: { height: 600, width: 600 },
  ui: { vars },
  // Supply a Hub to enable frame verification.
  hub: neynar.hub(),
}).use(neynar.middleware({ features: ["interactor", "cast"] }));

// Uncomment to use Edge Runtime
// export const runtime = 'edge'

app.frame("/", (c) => {
  const { buttonValue, inputText, status } = c;
  const fruit = inputText || buttonValue;
  // console.log(frameData, "COk");
  // console.log(verified, "cuk");

  return c.res({
    action: "/result",
    image: (
      <div
        style={{
          alignItems: "center",
          background: "black",
          backgroundSize: "100% 100%",
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          height: "100%",
          justifyContent: "center",
          textAlign: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            color: "white",
            fontSize: 60,
            fontStyle: "normal",
            letterSpacing: "-0.025em",
            lineHeight: 1.4,
            marginTop: 30,
            padding: "0 120px",
            whiteSpace: "pre-wrap",
          }}
        >
          Choose your weapon
        </div>
      </div>
    ),
    intents: [
      <Button value="rock">Rock</Button>,
      <Button value="paper">Paper</Button>,
      <Button value="scissors">Scissors</Button>,
    ],
  });
});

app.frame("/result", (c) => {
  const rand = Math.floor(Math.random() * 3);
  const choices = ["rock", "paper", "scissors"];
  const userChoice = choices[(c.buttonIndex || 1) - 1];
  const computerChoice = choices[rand];
  let msg = "";

  if (userChoice === computerChoice) {
    msg = "draw";
  }

  if (
    (userChoice === "rock" && computerChoice === "scissors") ||
    (userChoice === "paper" && computerChoice === "rock") ||
    (userChoice === "scissors" && computerChoice === "paper")
  ) {
    msg = "You win";
  }

  if (
    (userChoice === "rock" && computerChoice === "paper") ||
    (userChoice === "paper" && computerChoice === "scissors") ||
    (userChoice === "scissors" && computerChoice === "rock")
  ) {
    msg = "You lose";
  }

  return c.res({
    image: (
      <div
        style={{
          alignItems: "center",
          background: "black",
          backgroundSize: "100% 100%",
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          height: "100%",
          justifyContent: "center",
          textAlign: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            color: "white",
            fontSize: 60,
            fontStyle: "normal",
            letterSpacing: "-0.025em",
            lineHeight: 1.4,
            marginTop: 30,
            padding: "0 120px",
            whiteSpace: "pre-wrap",
            display: "flex",
          }}
        >
          {userChoice} vs {computerChoice}
        </div>

        <div
          style={{
            color: "white",
            fontSize: 60,
            fontStyle: "normal",
            letterSpacing: "-0.025em",
            lineHeight: 1.4,
            marginTop: 30,
            padding: "0 120px",
            whiteSpace: "pre-wrap",
          }}
        >
          {c.var.interactor?.displayName}
          {msg}
        </div>
      </div>
    ),
    intents: [<Button action="/">Play again</Button>],
  });
});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
