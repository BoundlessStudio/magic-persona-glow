"use client";

import { type TweetProps, useTweet } from "react-tweet";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

// Truncate helper
const truncate = (str: string | null, length: number) => {
  if (!str || str.length <= length) return str;
  return `${str.slice(0, length - 3)}...`;
};

// Skeleton
const TweetSkeleton = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex size-full max-h-max min-w-72 flex-col gap-2 rounded-lg border p-4",
      className
    )}
    {...props}
  >
    <div className="flex flex-row gap-2">
      <Skeleton className="size-10 shrink-0 rounded-full" />
      <div className="flex flex-col gap-1">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
    <Skeleton className="h-16 w-full" />
  </div>
);

const TweetNotFound = () => (
  <div className="flex size-full flex-col items-center justify-center gap-2 rounded-lg border p-4 text-center">
    <p className="text-sm text-muted-foreground">Tweet not found</p>
  </div>
);

// Formatted tweet body
const TweetBody = ({ tweet }: { tweet: any }) => (
  <div className="break-words leading-normal tracking-tight">
    <span
      className="text-sm font-normal"
      dangerouslySetInnerHTML={{ __html: tweet.text || "" }}
    />
  </div>
);

// Media display
const TweetMedia = ({ tweet }: { tweet: any }) => {
  const media = tweet.mediaDetails;
  if (!media || media.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      {media.map((m: any, i: number) => (
        <div key={i} className="overflow-hidden rounded-lg">
          {m.type === "photo" && (
            <img
              src={m.media_url_https}
              alt={tweet.text}
              className="w-full rounded-lg object-cover shadow-sm"
            />
          )}
          {m.type === "video" && m.video_info?.variants?.[0]?.url && (
            <video
              className="w-full rounded-lg"
              controls
              src={m.video_info.variants.find(
                (v: any) => v.content_type === "video/mp4"
              )?.url}
            />
          )}
        </div>
      ))}
    </div>
  );
};

// Main tweet display
const MagicTweet = ({
  tweet,
  className,
  ...props
}: {
  tweet: any;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "relative flex size-full max-w-lg flex-col gap-2 overflow-hidden rounded-lg border p-4 backdrop-blur-md",
        className
      )}
      {...props}
    >
      <div className="flex flex-row justify-between tracking-tight">
        <div className="flex items-center gap-2">
          <a href={`https://x.com/${tweet.user.screen_name}`} target="_blank" rel="noreferrer">
            <img
              src={tweet.user.profile_image_url_https}
              alt={tweet.user.name}
              className="size-10 overflow-hidden rounded-full border"
            />
          </a>
          <div>
            <a
              href={`https://x.com/${tweet.user.screen_name}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 font-semibold whitespace-nowrap"
            >
              {truncate(tweet.user.name, 20)}
              {tweet.user.verified ||
              tweet.user.is_blue_verified ? (
                  <svg
                  aria-label="Verified Account"
                  viewBox="0 0 24 24"
                  className="size-4 fill-primary"
                >
                  <g>
                    <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                  </g>
                </svg>
              ) : null}
            </a>
            <div className="flex items-center gap-1">
              <a
                href={`https://x.com/${tweet.user.screen_name}`}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-muted-foreground transition-all duration-75"
              >
                @{truncate(tweet.user.screen_name, 16)}
              </a>
            </div>
          </div>
        </div>
        <a href={`https://x.com/${tweet.user.screen_name}/status/${tweet.id_str}`} target="_blank" rel="noreferrer">
          <span className="sr-only">Link to tweet</span>
          <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 fill-current">
            <g>
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </g>
          </svg>
        </a>
      </div>

      <TweetBody tweet={tweet} />
      <TweetMedia tweet={tweet} />

      {tweet.created_at && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <time dateTime={tweet.created_at}>
            {new Date(tweet.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </time>
        </div>
      )}

      {(tweet.favorite_count > 0 || tweet.conversation_count > 0) && (
        <div className="flex items-center gap-3 border-t pt-2 text-xs text-muted-foreground">
          {tweet.conversation_count > 0 && (
            <span>{tweet.conversation_count} replies</span>
          )}
          {tweet.favorite_count > 0 && (
            <span>{tweet.favorite_count.toLocaleString()} likes</span>
          )}
        </div>
      )}
    </div>
  );
};

// Client Tweet Card
export const ClientTweetCard = ({
  id,
  className,
  onError,
  ...props
}: {
  id: string;
  className?: string;
  onError?: (error: any) => any;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "id">) => {
  const { data, error, isLoading } = useTweet(id);

  if (isLoading) return <TweetSkeleton className={className} />;
  if (error || !data) return <TweetNotFound />;

  return <MagicTweet tweet={data} className={className} {...props} />;
};

export { TweetSkeleton, TweetNotFound, MagicTweet };
