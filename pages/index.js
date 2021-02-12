import Head from "next/head";
import Tweet from "../components/Tweet";
import getRecentTweets from "../utils/getRecentTweets";

export default function Home(props) {
  const { recentTweets, lastUpdate, cronDurationHour } = props;
  const tweets = recentTweets;

  const timeFormat = new Intl.DateTimeFormat("en-id", {
    hour: "numeric",
    minute: "numeric",
  });
  const dateFormat = new Intl.DateTimeFormat("en-id", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="bg-gray-50 m-0 px-2 min-h-screen">
      <Head>
        <title>Kepencet Traveloka</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content={`${tweets.length} kepencet dalam ${cronDurationHour} jam terakhir`}
        />
      </Head>
      <div className="mx-auto max-w-96 w-full text-center py-3">
        <h1 className="flex flex-col mb-4 text-center">
          <span className="text-9xl font-bold">{tweets.length}</span>
          <span className="text-4xl font-bold text-gray-400">kepencet</span>
        </h1>
        <div className="text-gray-800">Selama 1 minggu terakhir</div>
        <div>
          Last update: {dateFormat.format(lastUpdate)}{" "}
          {timeFormat.format(lastUpdate)}
        </div>
        <small className="text-gray-400">(di-update setiap 1 jam)</small>
      </div>
      <main className="w-full flex flex-col items-center">
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} {...tweet} />
        ))}
      </main>
    </div>
  );
}
export const getStaticProps = async () => {
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
