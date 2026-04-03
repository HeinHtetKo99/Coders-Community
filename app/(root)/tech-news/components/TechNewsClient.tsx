import DataRenderer from "@/components/DataRenderer";
import Image from "next/image";
import Link from "next/link";

export type TechNewsArticle = {
  id: number;
  title: string;
  description: string;
  url: string;
  readable_publish_date: string;
  public_reactions_count: number;
  comments_count: number;
  cover_image: string | null;
  user?: {
    name?: string;
    profile_image?: string;
  };
};

function TechNewsClient({
  articles,
  success,
  message,
}: {
  articles: TechNewsArticle[];
  success: boolean;
  message?: string;
}) {
  return (
    <DataRenderer
      success={success}
      message={message || ""}
      data={articles}
      emptyTitle="No Tech News Found"
      emptyDescription="There are no tech articles available right now."
      errorDescription="We couldn’t load tech news right now. Please try again."
      render={(items) => (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {items.map((article, index) => (
            <Link
              href={article.url}
              target="_blank"
              rel="noreferrer"
              key={article.id}
              className="group rounded-2xl border border-white/5 bg-primary/30 p-4 hover:bg-primary/40 hover:border-main/30 transition-all"
            >
              <div className="relative h-40 w-full overflow-hidden rounded-xl border border-white/10 bg-secondary/50">
                {article.cover_image ? (
                  <Image
                    src={article.cover_image}
                    alt={article.title}
                    fill
                    loading={index < 2 ? "eager" : "lazy"}
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                ) : (
                  <div className="h-full w-full" />
                )}
              </div>

              <h3 className="mt-4 text-lg font-semibold text-white line-clamp-2 group-hover:text-main transition-colors">
                {article.title}
              </h3>
              <p className="mt-2 text-sm text-gray-400 line-clamp-3">
                {article.description}
              </p>

              <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
                <span>{article.user?.name || "Unknown author"}</span>
                <span>{article.readable_publish_date}</span>
              </div>
              <div className="mt-2 flex items-center gap-4 text-xs text-gray-300">
                <span>{article.public_reactions_count || 0} reactions</span>
                <span>{article.comments_count || 0} comments</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    />
  );
}

export default TechNewsClient;
