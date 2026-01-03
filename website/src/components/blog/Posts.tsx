import { fetchBlogPosts } from "@/utils/blogs";
import { Grid } from "@once-ui-system/core";
import Post from "./Post";
import { BlogPost } from "@/types";

interface PostsProps {
  range?: [number] | [number, number];
  columns?: "1" | "2" | "3";
  thumbnail?: boolean;
  direction?: "row" | "column";
  exclude?: string[];
}

export function Posts({
  range,
  columns = "1",
  thumbnail = false,
  exclude = [],
  direction,
}: PostsProps) {
  // fetch on server
  const loadBlogs = async (): Promise<BlogPost[]> => {
    let allBlogs = await fetchBlogPosts();

    if (exclude.length) {
      allBlogs = allBlogs.filter((post) => !exclude.includes(post.slug));
    }

    const sortedBlogs = allBlogs.sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );

    const displayedBlogs = range
      ? sortedBlogs.slice(range[0] - 1, range.length === 2 ? range[1] : sortedBlogs.length)
      : sortedBlogs;

    return displayedBlogs;
  };

  // async server component wrapper
  async function Render() {
    const displayedBlogs = await loadBlogs();
    if (!displayedBlogs.length) return null;

    return (
      <Grid columns={columns} s={{ columns: 1 }} fillWidth marginBottom="40" gap="16">
        {displayedBlogs.map((post) => (
          <Post key={post.slug} post={post} thumbnail={thumbnail} direction={direction} />
        ))}
      </Grid>
    );
  }

  return <Render />;
}
