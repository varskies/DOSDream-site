const fs = require("fs");

const USER = "varskies";
const TOKEN = process.env.GITHUB_TOKEN;

const query = `
query($login:String!) {
  user(login:$login) {
    contributionsCollection {
      contributionCalendar {
        weeks {
          contributionDays {
            date
            contributionCount
          }
        }
      }
    }
  }
}
`;

async function run() {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `bearer ${TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      query,
      variables: { login: USER }
    })
  });

  const json = await res.json();

  fs.writeFileSync(
    "calendar.json",
    JSON.stringify(
      json.data.user.contributionsCollection.contributionCalendar.weeks,
      null,
      2
    )
  );

  console.log("calendar.json updated");
}

run();