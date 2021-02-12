import axios from "axios";

async function getRecentTweetsWithQuery() {
  const res = await axios.get(`${process.env.N8N_API_URL_KEPENCET_TRAVELOKA.trim()}`, {
    auth: {
      username: `${process.env.N8N_BASIC_AUTH_USER.trim()}`,
      password: `${process.env.N8N_BASIC_AUTH_PASSWORD.trim()}`,
    },
  });

  if (res.data.errors) {
    console.error("errors", res.data.errors);
    return [];
  }

  return res.data;
}

export default async function getRecentTweets() {
  let data = await getRecentTweetsWithQuery();
  return data;
}
