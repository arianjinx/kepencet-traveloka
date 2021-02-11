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

  const tweets = data.data;
  const users = data.includes.users;

  return tweets.flatMap((tweet) => {
    const user = users.find((user) => user.id === tweet.author_id);

    if (!user) {
      console.log("invalid user", { tweet });
      return [];
    }

    return {
      id: tweet.id,
      name: user.name,
      avatarUrl: user.profile_image_url,
      username: user.username,
      text: tweet.text,
      timestamp: tweet.created_at,
    };
  });
}
