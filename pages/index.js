import Head from "next/head";
import axios from "axios";
import Tweet from "../components/Tweet";

export default function Home(props) {
  const { recentTweets, lastUpdate, cronDurationHour } = props;

  const tweets = recentTweets.data;
  const users = recentTweets.includes.users;

  const timeFormat = new Intl.DateTimeFormat("en-id", {
    hour: "numeric",
    minute: "numeric",
  });
  const dateFormat = new Intl.DateTimeFormat("en-id", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const formattedTweets = tweets.flatMap((tweet) => {
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

  return (
    <div>
      <Head>
        <title>Twitter VS Traveloka</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="mx-auto w-96 text-center my-4">
        <div className="text-gray-800">
          Selama {cronDurationHour} jam terakhir
        </div>
        <div>Last update: {dateFormat.format(lastUpdate)}</div>
      </div>
      <main className="w-full flex flex-col items-center">
        {formattedTweets.map((tweet, key) => (
          <Tweet key={tweet.id} {...tweet} />
        ))}
      </main>
    </div>
  );
}
export const getStaticProps = async () => {
  async function getRecentTweets() {
    const res = await axios.get(`${process.env.TWITTER_API_URL.trim()}`);

    if (res.data.errors) {
      console.error("errors", res.data.errors);
      return [];
    }
    return res.data;
  }

  const recentTweets = await getRecentTweets();
  const cronDurationHour = 1;

  return {
    revalidate: cronDurationHour * 60 * 60,
    props: {
      recentTweets,
      lastUpdate: new Date().getTime(),
      cronDurationHour,
    },
  };
};
